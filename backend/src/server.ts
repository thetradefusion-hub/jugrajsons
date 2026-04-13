import path from 'path';
import dotenv from 'dotenv';

// Load .env from backend folder (so it works even when running from project root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import connectDB from './config/database';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import couponRoutes from './routes/coupon.routes';
import adminRoutes from './routes/admin.routes';
import reviewRoutes from './routes/review.routes';
import notificationRoutes from './routes/notification.routes';
import activityLogRoutes from './routes/activityLog.routes';
import expertRoutes from './routes/expert.routes';
import appointmentRoutes from './routes/appointment.routes';
import chatRoutes from './routes/chat.routes';
import paymentRoutes from './routes/payment.routes';
import shiprocketRoutes from './routes/shiprocket.routes';
import pincodeRoutes from './routes/pincode.routes';

// Connect to database
connectDB();

const app = express();

// Middleware - CORS Configuration
// localhost and 127.0.0.1 are different origins — both must be allowed if you open the app either way
const localDevOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim()).filter(Boolean)
  : [];

// Always merge local + FRONTEND_URL so production NODE_ENV with only "localhost" in .env
// does not break when the site is opened at 127.0.0.1 (common Vite / browser behaviour).
const allowedOrigins: string[] = [...new Set([...localDevOrigins, ...envOrigins])];

if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push('https://*.vercel.app');
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check exact match
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Check wildcard patterns (for Vercel)
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace('*', '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      return callback(null, true);
    }
    
    // Local / non-production: allow any origin (covers unset NODE_ENV and alternate ports)
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Log for debugging
    console.log('CORS blocked origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/activity-logs', activityLogRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/shiprocket', shiprocketRoutes);
app.use('/api/pincode', pincodeRoutes);

// Health check (public — used by checkout to show Shiprocket one-click status)
app.get('/api/health', (req, res) => {
  const shiprocketEnabled =
    Boolean(process.env.SHIPROCKET_EMAIL?.trim()) && Boolean(process.env.SHIPROCKET_PASSWORD?.trim());
  res.json({
    status: 'OK',
    message: 'Server is running',
    shiprocket: {
      enabled: shiprocketEnabled,
      /** AWB assign runs after create unless SHIPROCKET_AUTO_AWB=false */
      autoAwb: process.env.SHIPROCKET_AUTO_AWB !== 'false',
    },
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`✅ Production mode enabled`);
  }
});

