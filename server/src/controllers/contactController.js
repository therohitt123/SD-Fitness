import { ContactMessage } from '../models/ContactMessage.js';

export const createContactMessage = async (req, res) => {
  const message = await ContactMessage.create(req.body);
  res.status(201).json(message);
};

export const getContactMessages = async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
};

export const markContactResolved = async (req, res) => {
  const { id } = req.params;
  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { resolved: true },
    { new: true }
  );
  res.json(message);
};
