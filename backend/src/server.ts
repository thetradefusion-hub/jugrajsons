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

// Connect to database
connectDB();

const app = express();

// Middleware - CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:8080'];

// Add common Vercel patterns
if (process.env.NODE_ENV === 'production') {
  // Allow Vercel preview and production URLs
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
    
    // Development mode - allow all
    if (process.env.NODE_ENV === 'development') {
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
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

