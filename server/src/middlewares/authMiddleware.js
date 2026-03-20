import { verifyToken } from '../utils/jwt.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

export const requireTrainer = (req, res, next) => {
  if (!req.user || req.user.role !== 'trainer') {
    return res.status(403).json({ message: 'Trainer access only' });
  }
  next();
};

export const requireAdminOrTrainerSelf = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No token, authorization denied' });
  if (req.user.role === 'admin') return next();

  const trainerId = req.params.id;
  const loggedTrainerId = req.user.trainerId || req.user.id;
  if (req.user.role === 'trainer' && String(loggedTrainerId) === String(trainerId)) {
    return next();
  }

  return res.status(403).json({ message: 'Access denied' });
};
