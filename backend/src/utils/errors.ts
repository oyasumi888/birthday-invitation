import type { Response } from 'express';

export type ApiErrorBody = {
  error: string;
  message: string;
};

export function sendError(
  res: Response,
  status: number,
  error: string,
  message: string
): void {
  const body: ApiErrorBody = { error, message };
  res.status(status).json(body);
}
