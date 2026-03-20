import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import updateRoutes from './routes/updateRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import gymInfoRoutes from './routes/gymInfoRoutes.js';
import adminStatsRoutes from './routes/adminStatsRoutes.js';
import planRoutes from './routes/planRoutes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');
const isDbConfigured = Boolean(ENV.MONGO_URI);

// Configure Helmet so that static assets like images can be loaded
// from a different origin (e.g. Vite dev server on a different port)
// without being blocked by Cross-Origin-Resource-Policy.
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors({ origin: ENV.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.static(clientDistPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Serve uploaded files (for backwards compatibility with older local files)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'SD Fitness API' });
});

if (!isDbConfigured) {
  app.use('/api', (req, res, next) => {
    if (req.path === '/health') return next();
    return res.status(503).json({
      message: 'Database is not configured. Set MONGO_URI in server/.env and restart server.',
    });
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/gym-info', gymInfoRoutes);
app.use('/api/admin', adminStatsRoutes);
app.use('/api/plans', planRoutes);

app.use(notFound);
app.use(errorHandler);



const start = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
};

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error?.message || error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error?.message || error);
});

start();
