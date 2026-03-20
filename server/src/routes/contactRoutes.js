import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  markContactResolved,
} from '../controllers/contactController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', requireAuth, requireAdmin, getContactMessages);
router.patch('/:id/resolve', requireAuth, requireAdmin, markContactResolved);

export default router;
