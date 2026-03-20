import { Trainer } from '../models/Trainer.js';
import { uploadBufferToCloudinary } from '../services/cloudinaryService.js';

const toPublicUrl = (filePath) => {
  if (!filePath) return filePath;
  if (filePath.startsWith('http')) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const filename = parts[parts.length - 1];
  return `/uploads/${filename}`;
};

export const getTrainers = async (req, res) => {
  const trainers = await Trainer.find().select('-password').sort({ createdAt: -1 });

  const normalized = trainers.map((doc) => {
    const obj = doc.toObject();
    return {
      ...obj,
      photoUrl: toPublicUrl(obj.photoUrl),
    };
  });

  res.json(normalized);
};

export const getTrainerById = async (req, res) => {
  const { id } = req.params;
  const trainer = await Trainer.findById(id).select('-password');
  if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
  const obj = trainer.toObject();
  res.json({
    ...obj,
    photoUrl: toPublicUrl(obj.photoUrl),
  });
};

export const createTrainer = async (req, res) => {
  const { name, email, password, age, mobile, speciality, bio, experienceYears, socials, isFeatured } = req.body;
  let photoUrl = null;

  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/trainers';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    photoUrl = uploadedUrl;
  }

  const trainerEmail = email?.trim().toLowerCase();
  if (trainerEmail) {
    const exists = await Trainer.findOne({ email: trainerEmail });
    if (exists) return res.status(400).json({ message: 'Trainer email already exists' });
  }

  const trainer = await Trainer.create({
    name,
    email: trainerEmail,
    password,
    age: Number.isFinite(Number(age)) ? Number(age) : 0,
    mobile,
    speciality,
    bio,
    experienceYears: Number.isFinite(Number(experienceYears)) ? Number(experienceYears) : 0,
    socials: socials ? JSON.parse(socials) : undefined,
    isFeatured: isFeatured === true || isFeatured === 'true',
    photoUrl,
  });
  res.status(201).json({ ...trainer.toObject(), password: undefined });
};

export const updateTrainer = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/trainers';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    updates.photoUrl = uploadedUrl;
  }
  if (updates.socials) updates.socials = JSON.parse(updates.socials);
  if (updates.age !== undefined) updates.age = Number.isFinite(Number(updates.age)) ? Number(updates.age) : 0;
  if (updates.experienceYears !== undefined) {
    updates.experienceYears = Number.isFinite(Number(updates.experienceYears))
      ? Number(updates.experienceYears)
      : 0;
  }
  if (updates.isFeatured !== undefined) {
    updates.isFeatured = updates.isFeatured === true || updates.isFeatured === 'true';
  }

  if (updates.email) {
    updates.email = updates.email.trim().toLowerCase();
    const exists = await Trainer.findOne({ email: updates.email, _id: { $ne: id } });
    if (exists) return res.status(400).json({ message: 'Trainer email already exists' });
  }

  if (updates.password) {
    const target = await Trainer.findById(id).select('+password');
    if (!target) return res.status(404).json({ message: 'Trainer not found' });
    target.set(updates);
    if (req.file?.buffer) {
      const folder = req.uploadFolder || 'sd-fitness/trainers';
      const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
      target.photoUrl = uploadedUrl;
    }
    await target.save();
    return res.json({ ...target.toObject(), password: undefined });
  }

  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/trainers';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    updates.photoUrl = uploadedUrl;
  }

  const trainer = await Trainer.findByIdAndUpdate(id, updates, { new: true });
  if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
  res.json(trainer);
};

export const deleteTrainer = async (req, res) => {
  const { id } = req.params;
  await Trainer.findByIdAndDelete(id);
  res.json({ message: 'Trainer deleted' });
};

export const getMyTrainerProfile = async (req, res) => {
  const trainerId = req.user.trainerId || req.user.id;
  const trainer = await Trainer.findById(trainerId).select('-password');
  if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
  const obj = trainer.toObject();
  res.json({
    ...obj,
    photoUrl: toPublicUrl(obj.photoUrl),
  });
};

export const updateMyTrainerProfile = async (req, res) => {
  const trainerId = req.user.trainerId || req.user.id;
  const updates = { ...req.body };
  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/trainers';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    updates.photoUrl = uploadedUrl;
  }

  delete updates.isFeatured;
  delete updates.socials;

  if (updates.age !== undefined) updates.age = Number.isFinite(Number(updates.age)) ? Number(updates.age) : 0;
  if (updates.experienceYears !== undefined) {
    updates.experienceYears = Number.isFinite(Number(updates.experienceYears))
      ? Number(updates.experienceYears)
      : 0;
  }

  if (updates.password) {
    const target = await Trainer.findById(trainerId).select('+password');
    if (!target) return res.status(404).json({ message: 'Trainer not found' });
    target.set(updates);
    await target.save();
    return res.json({ ...target.toObject(), password: undefined });
  }

  const trainer = await Trainer.findByIdAndUpdate(trainerId, updates, { new: true });
  if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
  res.json(trainer);
};

export const uploadTrainerPhotos = async (req, res) => {
  const { id } = req.params;
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: 'At least one photo is required' });

  const trainer = await Trainer.findById(id);
  if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

  const folder = req.uploadFolder || 'sd-fitness/trainers/gallery';
  const newPhotos = await Promise.all(
    files.map(async (file) => {
      const uploadedUrl = await uploadBufferToCloudinary(file.buffer, folder);
      return { url: uploadedUrl || null };
    })
  );
  trainer.galleryPhotos = [...(trainer.galleryPhotos || []), ...newPhotos];
  await trainer.save();
  res.json(trainer);
};

export const uploadMyTrainerPhotos = async (req, res) => {
  req.params.id = req.user.trainerId || req.user.id;
  return uploadTrainerPhotos(req, res);
};

export const deleteTrainerPhoto = async (req, res) => {
  const { id, photoId } = req.params;
  const trainer = await Trainer.findById(id);
  if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

  trainer.galleryPhotos = (trainer.galleryPhotos || []).filter(
    (photo) => String(photo._id) !== String(photoId)
  );
  await trainer.save();
  res.json(trainer);
};

export const deleteMyTrainerPhoto = async (req, res) => {
  req.params.id = req.user.trainerId || req.user.id;
  return deleteTrainerPhoto(req, res);
};
