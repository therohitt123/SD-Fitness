import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['news', 'event', 'offer'], default: 'news' },
    activeFrom: Date,
    activeTo: Date,
  },
  { timestamps: true }
);

export const Update = mongoose.model('Update', updateSchema);
