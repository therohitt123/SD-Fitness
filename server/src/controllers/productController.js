import { Product } from '../models/Product.js';
import { uploadBufferToCloudinary } from '../services/cloudinaryService.js';

const toPublicUrl = (filePath) => {
  if (!filePath) return filePath;
  if (filePath.startsWith('http')) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const filename = parts[parts.length - 1];
  return `/uploads/${filename}`;
};

export const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  const normalized = products.map((prod) => {
    const obj = prod.toObject();
    return {
      ...obj,
      imageUrl: toPublicUrl(obj.imageUrl),
    };
  });

  res.json(normalized);
};

export const createProduct = async (req, res) => {
  const { title, name, brand, description, price, stock, category, isFeatured } = req.body;
  let imageUrl = null;

  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/products';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    imageUrl = uploadedUrl;
  }
  const product = await Product.create({
    title,
    name,
    brand,
    description,
    price: Number(price),
    stock: Number.isFinite(Number(stock)) ? Number(stock) : 0,
    category,
    isFeatured: isFeatured === true || isFeatured === 'true',
    imageUrl,
  });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.stock !== undefined) {
    updates.stock = Number.isFinite(Number(updates.stock)) ? Number(updates.stock) : 0;
  }
  if (updates.isFeatured !== undefined) {
    updates.isFeatured = updates.isFeatured === true || updates.isFeatured === 'true';
  }
  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/products';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    updates.imageUrl = uploadedUrl;
  }
  const product = await Product.findByIdAndUpdate(id, updates, { new: true });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.json({ message: 'Product deleted' });
};
