import { Video } from '../models/Video.js';
import { uploadBufferToCloudinary } from '../services/cloudinaryService.js';

const toPublicUrl = (filePath) => {
  if (!filePath) return filePath;
  if (filePath.startsWith('http')) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const filename = parts[parts.length - 1];
  return `/uploads/${filename}`;
};

export const getVideos = async (req, res) => {
  const videos = await Video.find().sort({ order: 1, createdAt: -1 });
  res.json(videos);
};

export const createVideo = async (req, res) => {
  const { title, description, order } = req.body;
  if (!req.file?.buffer) {
    return res.status(400).json({ message: 'Slider media file is required' });
  }
  const folder = req.uploadFolder || 'sd-fitness/slider-media';
  const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
  const url = uploadedUrl;
  const mediaType = req.file?.mimetype?.startsWith('video') ? 'video' : 'image';
  const video = await Video.create({
    title,
    description,
    order: Number.isFinite(Number(order)) ? Number(order) : 0,
    url,
    mediaType,
  });
  res.status(201).json(video);
};

export const updateVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, order } = req.body;
  const updates = {};

  if (typeof title === 'string') updates.title = title;
  if (typeof description === 'string') updates.description = description;
  if (order !== undefined) {
    updates.order = Number.isFinite(Number(order)) ? Number(order) : 0;
  }
  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/slider-media';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    updates.url = uploadedUrl;
    updates.mediaType = req.file?.mimetype?.startsWith('video') ? 'video' : 'image';
  }

  const video = await Video.findByIdAndUpdate(id, updates, { new: true });
  if (!video) return res.status(404).json({ message: 'Slider item not found' });
  res.json(video);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  res.json({ message: 'Slider item deleted' });
};

export const reorderVideos = async (req, res) => {
  const { orders } = req.body; // [{id, order}]
  const bulk = orders.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: id },
      update: { order },
    },
  }));
  await Video.bulkWrite(bulk);
  res.json({ message: 'Order updated' });
};
