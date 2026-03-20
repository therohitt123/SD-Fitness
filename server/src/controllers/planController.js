import { Plan } from '../models/Plan.js';
import { uploadBufferToCloudinary } from '../services/cloudinaryService.js';

const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) {
    return features.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof features === 'string') {
    const trimmed = features.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        // Fall back to comma-separated parsing below.
      }
    }

    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const toBoolean = (value, fallback) => {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return Boolean(value);
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getPlans = async (req, res) => {
  const plans = await Plan.find({ isActive: true }).sort({ offerPrice: 1, createdAt: -1 });
  res.json(plans);
};

export const getAllPlansForAdmin = async (req, res) => {
  const plans = await Plan.find({}).sort({ createdAt: -1 });
  res.json(plans);
};

export const getPlanById = async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  res.json(plan);
};

export const createPlan = async (req, res) => {
  const { name, plan, duration, listPrice, offerPrice, price, features, isActive } = req.body;

  const normalizedOfferPrice = toNumber(offerPrice, toNumber(price, 0));
  const normalizedListPrice = toNumber(listPrice, normalizedOfferPrice);

  if (normalizedListPrice < 0 || normalizedOfferPrice < 0) {
    return res.status(400).json({ message: 'Prices cannot be negative' });
  }
  if (normalizedOfferPrice > normalizedListPrice) {
    return res.status(400).json({ message: 'Offer price cannot be greater than list price' });
  }

  const payload = {
    name,
    plan,
    duration,
    listPrice: normalizedListPrice,
    offerPrice: normalizedOfferPrice,
    price: normalizedOfferPrice,
    features: parseFeatures(features),
    isActive: toBoolean(isActive, true),
  };

  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/plans';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    payload.image = uploadedUrl;
  }

  const createdPlan = await Plan.create(payload);
  res.status(201).json(createdPlan);
};

export const updatePlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });

  const { name, plan: planName, duration, listPrice, offerPrice, price, features, isActive } = req.body;

  if (name !== undefined) plan.name = name;
  if (planName !== undefined) plan.plan = planName;
  if (duration !== undefined) plan.duration = duration;
  if (listPrice !== undefined) plan.listPrice = toNumber(listPrice, plan.listPrice);
  if (offerPrice !== undefined) {
    const nextOffer = toNumber(offerPrice, plan.offerPrice);
    plan.offerPrice = nextOffer;
    plan.price = nextOffer;
  } else if (price !== undefined) {
    const nextOffer = toNumber(price, plan.offerPrice);
    plan.offerPrice = nextOffer;
    plan.price = nextOffer;
  }
  if (features !== undefined) plan.features = parseFeatures(features);
  if (isActive !== undefined) plan.isActive = toBoolean(isActive, plan.isActive);

  if (plan.listPrice < 0 || plan.offerPrice < 0) {
    return res.status(400).json({ message: 'Prices cannot be negative' });
  }
  if (plan.offerPrice > plan.listPrice) {
    return res.status(400).json({ message: 'Offer price cannot be greater than list price' });
  }

  if (req.file?.buffer) {
    const folder = req.uploadFolder || 'sd-fitness/plans';
    const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, folder);
    plan.image = uploadedUrl;
  }

  const updatedPlan = await plan.save();
  res.json(updatedPlan);
};

export const deletePlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });

  await plan.deleteOne();
  res.json({ message: 'Plan deleted' });
};
