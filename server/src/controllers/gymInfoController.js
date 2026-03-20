import { GymInfo } from '../models/GymInfo.js';

export const getGymInfo = async (req, res) => {
  const info = await GymInfo.findOne();
  res.json(info);
};

export const upsertGymInfo = async (req, res) => {
  const info = await GymInfo.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
  });
  res.json(info);
};
