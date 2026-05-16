import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { sendError } from '../utils/errors.js';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const JWT_EXPIRY = '8h';

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, 'validation_error', parsed.error.issues.map((e) => e.message).join('; '));
    return;
  }

  const { username, password } = parsed.data;
  const adminUser = process.env.ADMIN_USERNAME;
  const adminHash = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;

  if (!adminUser || !adminHash || !secret) {
    sendError(res, 500, 'server_error', 'Admin credentials are not configured');
    return;
  }

  const userOk = username === adminUser;
  let passOk = false;
  try {
    passOk = await bcrypt.compare(password, adminHash);
  } catch {
    passOk = false;
  }

  if (!userOk || !passOk) {
    sendError(res, 401, 'unauthorized', 'Invalid username or password');
    return;
  }

  const token = jwt.sign({ sub: adminUser, role: 'admin' }, secret, {
    expiresIn: JWT_EXPIRY,
  });

  res.json({ token });
}
