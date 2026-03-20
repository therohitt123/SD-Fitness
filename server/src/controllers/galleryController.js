import { GalleryItem } from '../models/GalleryItem.js';
import { uploadBufferToCloudinary } from '../services/cloudinaryService.js';

const toPublicUrl = (filePath) => {
  if (!filePath) return filePath;
  if (filePath.startsWith('http')) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const filename = parts[parts.length - 1];
  return `/uploads/${filename}`;
};

export const getGallery = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const items = await GalleryItem.find(filter).sort({ createdAt: -1 });
  res.json(items);
};

export const createGalleryItems = async (req, res) => {
  const { category } = req.body;
  const files = req.files || [];
  const folder = req.uploadFolder || 'sd-fitness/gallery';

  const payload = await Promise.all(
    files.map(async (file) => {
      const uploadedUrl = await uploadBufferToCloudinary(file.buffer, folder);
      return { url: uploadedUrl || null, category };
    })
  );

  const docs = await GalleryItem.insertMany(payload);
  res.status(201).json(docs);
};

export const deleteGalleryItem = async (req, res) => {
  const { id } = req.params;
  await GalleryItem.findByIdAndDelete(id);
  res.json({ message: 'Gallery item deleted' });
};
