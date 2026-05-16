import { Router } from 'express';
import { login } from '../controllers/authController.js';

export const authRouter = Router();

authRouter.post('/login', login);
