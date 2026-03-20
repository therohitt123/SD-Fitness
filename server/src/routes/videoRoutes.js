import express from 'express';
import {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
} from '../controllers/videoController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getVideos);
router.post('/', requireAuth, requireAdmin, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/slider-media';
  next();
}, upload.single('media'), createVideo);
router.put('/:id', requireAuth, requireAdmin, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/slider-media';
  next();
}, upload.single('media'), updateVideo);
router.delete('/:id', requireAuth, requireAdmin, deleteVideo);
router.post('/reorder', requireAuth, requireAdmin, reorderVideos);

export default router;
