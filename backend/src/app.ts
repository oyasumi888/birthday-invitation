import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { rsvpRouter } from './routes/rsvp.js';

const app = express();

const frontendRaw = process.env.FRONTEND_URL;
const frontendOrigins = frontendRaw
  ? frontendRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : null;

app.use(
  cors({
    origin: frontendOrigins?.length ? frontendOrigins : true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/rsvp', rsvpRouter);

export default app;
