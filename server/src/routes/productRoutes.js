import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', requireAuth, requireAdmin, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/products';
  next();
}, upload.single('image'), createProduct);
router.put('/:id', requireAuth, requireAdmin, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/products';
  next();
}, upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
