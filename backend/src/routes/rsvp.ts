import { Router } from 'express';
import {
  deleteGuest,
  getStats,
  listGuests,
  submitRsvp,
  updateGuest,
} from '../controllers/rsvpController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const rsvpRouter = Router();

rsvpRouter.post('/', submitRsvp);

rsvpRouter.get('/stats', verifyToken, getStats);
rsvpRouter.get('/', verifyToken, listGuests);
rsvpRouter.patch('/:id', verifyToken, updateGuest);
rsvpRouter.delete('/:id', verifyToken, deleteGuest);
