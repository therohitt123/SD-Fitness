import express from 'express';
import { getGymInfo, upsertGymInfo } from '../controllers/gymInfoController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getGymInfo);
router.put('/', requireAuth, requireAdmin, upsertGymInfo);

export default router;
