import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/errors.js';

type RateLimitOptions = {
  windowMs: number;
  max: number;
  errorMessage: string;
};

const buckets = new Map<string, number[]>();

function clientKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max, errorMessage } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = clientKey(req);
    const now = Date.now();
    const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= max) {
      sendError(res, 429, 'rate_limit', errorMessage);
      return;
    }

    recent.push(now);
    buckets.set(key, recent);
    next();
  };
}

const rsvpWindowMs = Number(process.env.RSVP_RATE_LIMIT_WINDOW_MS) || 60_000;
const rsvpMax = Number(process.env.RSVP_RATE_LIMIT_MAX) || 3;

export const rsvpSubmitLimiter = createRateLimiter({
  windowMs: rsvpWindowMs,
  max: rsvpMax,
  errorMessage: 'Too many RSVP submissions. Please wait a minute and try again.',
});

const loginWindowMs = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60_000;
const loginMax = Number(process.env.LOGIN_RATE_LIMIT_MAX) || 10;

export const loginLimiter = createRateLimiter({
  windowMs: loginWindowMs,
  max: loginMax,
  errorMessage: 'Too many login attempts. Please wait before trying again.',
});
