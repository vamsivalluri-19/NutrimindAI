import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for monorepo development testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads static directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Healthy check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Main routes mapping
app.use('/api', apiRoutes);

// Error fallback handler
app.use(errorHandler);

export default app;
