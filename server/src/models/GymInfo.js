import mongoose from 'mongoose';

const gymInfoSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'SD Fitness' },
    address: { type: String },
    phonePrimary: { type: String },
    phoneSecondary: { type: String },
    email: { type: String },
    openingHours: {
      mondayFriday: String,
      saturday: String,
      sunday: String,
    },
    mapEmbedUrl: String,
  },
  { timestamps: true }
);

export const GymInfo = mongoose.model('GymInfo', gymInfoSchema);
