import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    order: { type: Number, default: 0 },
    title: String,
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Video = mongoose.model('Video', videoSchema);
