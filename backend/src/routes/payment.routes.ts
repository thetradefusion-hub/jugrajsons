import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify', verifyRazorpayPayment);

export default router;

