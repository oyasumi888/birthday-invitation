import type { Request, Response } from 'express';
import type { DatabaseError } from 'pg';
import { z } from 'zod';
import { pool } from '../db/connection.js';
import { sendError } from '../utils/errors.js';

function pgDebugFields(err: unknown): {
  pgCode: string | null;
  constraint: string | null;
  detailPreview: string | null;
  driverPreview: string | null;
} {
  if (!err || typeof err !== 'object') {
    return { pgCode: null, constraint: null, detailPreview: null, driverPreview: null };
  }
  const e = err as Partial<DatabaseError> & { message?: string };
  return {
    pgCode: typeof e.code === 'string' ? e.code : null,
    constraint: typeof e.constraint === 'string' ? e.constraint : null,
    detailPreview: typeof e.detail === 'string' ? e.detail.slice(0, 160) : null,
    driverPreview: typeof e.message === 'string' ? e.message.slice(0, 160) : null,
  };
}

export type GuestStatus = 'going' | 'not_going' | 'cancelled';

export interface GuestRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: GuestStatus;
  plus_ones: number;
  message: string | null;
  created_at: Date;
  updated_at: Date;
}

const uuidSchema = z.string().uuid();

const createRsvpSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.union([z.literal(''), z.string().trim().max(20)]).optional(),
  plus_ones: z.number().int().min(0).max(5).optional(),
  message: z.union([z.literal(''), z.string().trim().max(2000)]).optional(),
});

const patchGuestSchema = z.object({
  status: z.enum(['going', 'not_going', 'cancelled']),
});

function normalizeOptional(str: string | undefined): string | null {
  if (str === undefined || str === '') return null;
  return str;
}

export async function submitRsvp(req: Request, res: Response): Promise<void> {
  const parsed = createRsvpSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      'validation_error',
      parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
    );
    return;
  }

  const { name, phone, plus_ones, message } = parsed.data;
  const status = 'going' as const;
  const phoneNorm = normalizeOptional(phone);

  try {
    const duplicate = await pool.query<{ id: string }>(
      `SELECT id FROM guests
       WHERE lower(trim(name)) = lower(trim($1))
       AND (
         ($2::text IS NULL AND phone IS NULL)
         OR phone IS NOT DISTINCT FROM $2
       )
       AND created_at > NOW() - INTERVAL '2 minutes'
       LIMIT 1`,
      [name, phoneNorm]
    );

    if (duplicate.rowCount && duplicate.rowCount > 0) {
      sendError(
        res,
        429,
        'duplicate_rsvp',
        'This RSVP was already received. Please wait before submitting again.'
      );
      return;
    }

    const result = await pool.query<GuestRow>(
      `INSERT INTO guests (name, email, phone, status, plus_ones, message)
       VALUES ($1, $2, $3, $4::guest_status, $5, $6)
       RETURNING id, name, email, phone, status, plus_ones, message, created_at, updated_at`,
      [
        name,
        null,
        phoneNorm,
        status,
        plus_ones ?? 0,
        normalizeOptional(message),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    const dbg = pgDebugFields(err);

    const devHint =
      process.env.NODE_ENV !== 'production'
        ? [dbg.pgCode, dbg.detailPreview ?? dbg.driverPreview].filter(Boolean).join(' — ')
        : '';
    sendError(
      res,
      500,
      'server_error',
      devHint ? `Could not save RSVP (${devHint})` : 'Could not save RSVP'
    );
  }
}

export async function listGuests(_req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query<GuestRow>(
      `SELECT id, name, email, phone, status, plus_ones, message, created_at, updated_at
       FROM guests
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    sendError(res, 500, 'server_error', 'Could not load guests');
  }
}

export async function updateGuest(req: Request, res: Response): Promise<void> {
  const idParse = uuidSchema.safeParse(req.params.id);
  if (!idParse.success) {
    sendError(res, 404, 'not_found', 'Guest not found');
    return;
  }

  const parsed = patchGuestSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      'validation_error',
      parsed.error.issues.map((e) => e.message).join('; ')
    );
    return;
  }

  const id = idParse.data;
  const { status } = parsed.data;

  try {
    const result = await pool.query<GuestRow>(
      `UPDATE guests SET status = $2::guest_status WHERE id = $1
       RETURNING id, name, email, phone, status, plus_ones, message, created_at, updated_at`,
      [id, status]
    );

    if (result.rowCount === 0) {
      sendError(res, 404, 'not_found', 'Guest not found');
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    sendError(res, 500, 'server_error', 'Could not update guest');
  }
}

export async function deleteGuest(req: Request, res: Response): Promise<void> {
  const idParse = uuidSchema.safeParse(req.params.id);
  if (!idParse.success) {
    sendError(res, 404, 'not_found', 'Guest not found');
    return;
  }

  try {
    const result = await pool.query(`DELETE FROM guests WHERE id = $1`, [idParse.data]);
    if (result.rowCount === 0) {
      sendError(res, 404, 'not_found', 'Guest not found');
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    sendError(res, 500, 'server_error', 'Could not delete guest');
  }
}

export async function getStats(_req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query<{
      total: string;
      going: string;
      not_going: string;
      cancelled: string;
    }>(
      `SELECT
        COUNT(*)::text AS total,
        COUNT(*) FILTER (WHERE status = 'going')::text AS going,
        COUNT(*) FILTER (WHERE status = 'not_going')::text AS not_going,
        COUNT(*) FILTER (WHERE status = 'cancelled')::text AS cancelled
       FROM guests`
    );

    const row = result.rows[0];
    res.json({
      total: Number(row.total),
      going: Number(row.going),
      not_going: Number(row.not_going),
      cancelled: Number(row.cancelled),
    });
  } catch (err) {
    console.error(err);
    sendError(res, 500, 'server_error', 'Could not load stats');
  }
}
