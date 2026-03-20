import { Admin } from '../models/Admin.js';
import { Trainer } from '../models/Trainer.js';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: admin._id, role: admin.role });
    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginTrainer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const trainer = await Trainer.findOne({ email }).select('+password');
    if (!trainer) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await trainer.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: trainer._id, role: 'trainer', trainerId: trainer._id });
    res.json({
      token,
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        role: 'trainer',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password, mobile });
    const token = signToken({ id: user._id, role: 'user', userId: user._id });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'user',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user._id, role: 'user', userId: user._id });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'user',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerTrainer = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await Trainer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered as trainer' });
    }

    const trainer = await Trainer.create({ name, email, password, mobile });
    const token = signToken({ id: trainer._id, role: 'trainer', trainerId: trainer._id });

    res.status(201).json({
      token,
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        role: 'trainer',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkEmailAvailability = async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  const role = String(req.query.role || 'user').trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const isTrainerRole = role === 'trainer';
    const Model = isTrainerRole ? Trainer : User;

    const existing = await Model.findOne({ email }).select('_id');

    return res.json({
      available: !existing,
      email,
      role: isTrainerRole ? 'trainer' : 'user',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateAdminCredentials = async (req, res) => {
  const { email, oldEmail, currentPassword, oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const providedOldPassword = oldPassword || currentPassword;

    if (typeof email === 'string' && email.trim()) {
      if (!(typeof oldEmail === 'string' && oldEmail.trim())) {
        return res.status(400).json({ message: 'Old email is required to change email' });
      }

      const providedOldEmail = oldEmail.trim().toLowerCase();
      if (providedOldEmail !== String(admin.email || '').trim().toLowerCase()) {
        return res.status(401).json({ message: 'Old email does not match current admin email' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await Admin.findOne({ email: normalizedEmail, _id: { $ne: admin._id } });
      if (existing) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      admin.email = normalizedEmail;
    }

    if (typeof newPassword === 'string' && newPassword.trim()) {
      if (!providedOldPassword) {
        return res.status(400).json({ message: 'Old password is required to change password' });
      }

      const isMatch = await admin.matchPassword(providedOldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Old password is incorrect' });
      }

      if (newPassword.trim().length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      admin.password = newPassword.trim();
    }

    if (!(typeof email === 'string' && email.trim()) && !(typeof newPassword === 'string' && newPassword.trim())) {
      return res.status(400).json({ message: 'Provide new email and/or new password' });
    }

    await admin.save();

    return res.json({
      message: 'Admin credentials updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
