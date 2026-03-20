import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, default: 0 },
    mobile: { type: String },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    speciality: { type: String },
    bio: { type: String },
    experienceYears: { type: Number, default: 0 },
    photoUrl: { type: String },
    galleryPhotos: [
      {
        url: { type: String, required: true },
        caption: { type: String },
      },
    ],
    socials: {
      instagram: String,
      facebook: String,
      youtube: String,
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

trainerSchema.pre('save', async function trainerPasswordHash(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

trainerSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export const Trainer = mongoose.model('Trainer', trainerSchema);
