import express from 'express';
import {
  getUpdates,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} from '../controllers/updateController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getUpdates);
router.post('/', requireAuth, requireAdmin, createUpdate);
router.put('/:id', requireAuth, requireAdmin, updateUpdate);
router.delete('/:id', requireAuth, requireAdmin, deleteUpdate);

export default router;
