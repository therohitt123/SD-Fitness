import express from 'express';
import {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getMyTrainerProfile,
  updateMyTrainerProfile,
  uploadTrainerPhotos,
  uploadMyTrainerPhotos,
  deleteTrainerPhoto,
  deleteMyTrainerPhoto,
} from '../controllers/trainerController.js';
import {
  requireAuth,
  requireAdmin,
  requireTrainer,
  requireAdminOrTrainerSelf,
} from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getTrainers);
router.get('/me/profile', requireAuth, requireTrainer, getMyTrainerProfile);
router.put('/me/profile', requireAuth, requireTrainer, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/trainers';
  next();
}, upload.single('photo'), updateMyTrainerProfile);
router.post('/me/photos', requireAuth, requireTrainer, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/trainers/gallery';
  next();
}, upload.array('photos', 12), uploadMyTrainerPhotos);
router.delete('/me/photos/:photoId', requireAuth, requireTrainer, deleteMyTrainerPhoto);

router.get('/:id', getTrainerById);
router.post('/', requireAuth, requireAdmin, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/trainers';
  next();
}, upload.single('photo'), createTrainer);
router.put('/:id', requireAuth, requireAdminOrTrainerSelf, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/trainers';
  next();
}, upload.single('photo'), updateTrainer);
router.delete('/:id', requireAuth, requireAdmin, deleteTrainer);
router.post('/:id/photos', requireAuth, requireAdminOrTrainerSelf, (req, res, next) => {
  req.uploadFolder = 'sd-fitness/trainers/gallery';
  next();
}, upload.array('photos', 12), uploadTrainerPhotos);
router.delete('/:id/photos/:photoId', requireAuth, requireAdminOrTrainerSelf, deleteTrainerPhoto);

export default router;
