import express from 'express';
import {
	loginAdmin,
	loginTrainer,
	registerUser,
	loginUser,
	registerTrainer,
	checkEmailAvailability,
	updateAdminCredentials,
} from '../controllers/authController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/admin/login', loginAdmin);
router.post('/trainer/login', loginTrainer);
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/trainer/register', registerTrainer);
router.get('/email-availability', checkEmailAvailability);
router.put('/admin/credentials', requireAuth, requireAdmin, updateAdminCredentials);

export default router;
