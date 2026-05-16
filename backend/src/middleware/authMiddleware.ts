import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/errors.js';

export interface JwtPayload {
  sub: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    sendError(res, 500, 'server_error', 'JWT secret is not configured');
    return;
  }

  if (!header?.startsWith('Bearer ')) {
    sendError(res, 401, 'unauthorized', 'Missing or invalid authorization header');
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.admin = decoded;
    next();
  } catch {
    sendError(res, 401, 'unauthorized', 'Invalid or expired token');
  }
}
