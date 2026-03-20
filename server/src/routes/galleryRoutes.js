import express from 'express';
import {
  getGallery,
  createGalleryItems,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', requireAuth, requireAdmin, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/gallery';
  next();
}, upload.array('images', 10), createGalleryItems);
router.delete('/:id', requireAuth, requireAdmin, deleteGalleryItem);

export default router;
