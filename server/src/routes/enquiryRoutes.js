import express from 'express';
import {
  createEnquiry,
  getEnquiries,
} from '../controllers/enquiryController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', requireAuth, requireAdmin, getEnquiries);

export default router;
