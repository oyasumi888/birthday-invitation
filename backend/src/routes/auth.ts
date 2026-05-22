import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimit.js';

export const authRouter = Router();

authRouter.post('/login', loginLimiter, login);
