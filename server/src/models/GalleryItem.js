import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    category: { type: String, enum: ['workout', 'machines', 'transformation'], default: 'workout' },
    caption: String,
  },
  { timestamps: true }
);

export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
