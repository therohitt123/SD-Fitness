import { Enquiry } from '../models/Enquiry.js';

export const createEnquiry = async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json(enquiry);
};

export const getEnquiries = async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
};
