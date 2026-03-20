import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String },
    name: { type: String, required: true },
    brand: { type: String },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: String,
    category: String,
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
