import express from 'express';
import {
  createPlan,
  deletePlan,
  getAllPlansForAdmin,
  getPlanById,
  getPlans,
  updatePlan,
} from '../controllers/planController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getPlans);
router.get('/admin/all', requireAuth, requireAdmin, getAllPlansForAdmin);
router.get('/:id', getPlanById);
router.post('/', requireAuth, requireAdmin, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/plans';
  next();
}, upload.single('image'), createPlan);
router.put('/:id', requireAuth, requireAdmin, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/plans';
  next();
}, upload.single('image'), updatePlan);
router.delete('/:id', requireAuth, requireAdmin, deletePlan);

export default router;
