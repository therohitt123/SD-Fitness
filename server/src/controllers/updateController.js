import { Update } from '../models/Update.js';

export const getUpdates = async (req, res) => {
  if (req.query.all === 'true') {
    const allUpdates = await Update.find().sort({ createdAt: -1 });
    return res.json(allUpdates);
  }

  const now = new Date();
  const updates = await Update.find({
    $or: [
      { activeFrom: null, activeTo: null },
      { activeFrom: { $lte: now }, activeTo: { $gte: now } },
      { activeFrom: null, activeTo: { $gte: now } },
      { activeFrom: { $lte: now }, activeTo: null },
    ],
  }).sort({ createdAt: -1 });
  res.json(updates);
};

export const createUpdate = async (req, res) => {
  const update = await Update.create(req.body);
  res.status(201).json(update);
};

export const updateUpdate = async (req, res) => {
  const { id } = req.params;
  const doc = await Update.findByIdAndUpdate(id, req.body, { new: true });
  res.json(doc);
};

export const deleteUpdate = async (req, res) => {
  const { id } = req.params;
  await Update.findByIdAndDelete(id);
  res.json({ message: 'Update deleted' });
};
