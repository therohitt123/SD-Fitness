import express from 'express';
import { Trainer } from '../models/Trainer.js';
import { Product } from '../models/Product.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { Update } from '../models/Update.js';
import { Enquiry } from '../models/Enquiry.js';
import { User } from '../models/User.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  const [trainers, products, messages, updates, enquiries] = await Promise.all([
    Trainer.countDocuments(),
    Product.countDocuments(),
    ContactMessage.countDocuments(),
    Update.countDocuments(),
    Enquiry.countDocuments(),
  ]);

  res.json({
    totalTrainers: trainers,
    totalProducts: products,
    totalMessages: messages,
    totalUpdates: updates,
    totalEnquiries: enquiries,
  });
});

router.get('/enquiries/monthly', requireAuth, requireAdmin, async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const data = await Enquiry.aggregate(pipeline);
  res.json(data.map((d) => ({ month: d._id, count: d.count })));
});

// Members management
router.get('/members', requireAuth, requireAdmin, async (req, res) => {
  const members = await User.find({}, 'name email mobile role createdAt').sort({ createdAt: -1 });
  res.json(members);
});

router.put('/members/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  const updates = {};
  if (typeof name === 'string') updates.name = name;
  if (typeof email === 'string') updates.email = email.toLowerCase().trim();
  if (typeof mobile === 'string') updates.mobile = mobile;

  try {
    const member = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select(
      'name email mobile role createdAt'
    );
    if (!member) return res.status(404).json({ message: 'Member not found' });
    return res.json(member);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    return res.status(500).json({ message: 'Failed to update member' });
  }
});

router.delete('/members/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const member = await User.findById(id);
  if (!member) return res.status(404).json({ message: 'Member not found' });

  try {
    await member.deleteOne();
    return res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete member' });
  }
});

router.post('/members/:id/email', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  const member = await User.findById(id);
  if (!member) return res.status(404).json({ message: 'Member not found' });

  try {
    await sendEmail({
      to: member.email,
      subject,
      text: message,
    });
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default router;
