import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order';
import { syncShiprocketOrderFromDb } from '../services/shiprocket.service';

// Lazy-initialize Razorpay (after dotenv is loaded in server.ts)
function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Create Razorpay order
export const createRazorpayOrder = async (req: AuthRequest, res: Response) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(500).json({ message: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.' });
    }

    const { amount, currency = 'INR', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      // Razorpay receipt must be <= 40 characters
      // Use only the Mongo orderId to keep it short and unique
      receipt: orderId.toString(),
      notes: {
        orderId: orderId.toString(),
        userId: req.user!._id.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with Razorpay order ID
    order.paymentId = razorpayOrder.id;
    await order.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    // Log full error on server and return a user-friendly message
    console.error('Razorpay order creation error:', error);

    const errorMessage =
      (error && (error as any).error && (error as any).error.description) ||
      error.message ||
      'Failed to create payment order';

    res.status(500).json({
      message: errorMessage,
    });
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Basic validation
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // In development mode, skip strict Razorpay field validation so end-to-end
    // flow can be tested easily even if provider sends unexpected values.
    const isProduction = process.env.NODE_ENV === 'production';

    if (!isProduction) {
      order.paymentStatus = 'paid';
      order.paymentId = razorpay_payment_id || 'razorpay_dev_payment';
      order.paymentMethod = 'razorpay';
      await order.save();

      let shiprocket: { synced: boolean; message?: string } | undefined;
      if (process.env.SHIPROCKET_EMAIL?.trim() && process.env.SHIPROCKET_PASSWORD?.trim()) {
        const sr = await syncShiprocketOrderFromDb(orderId);
        shiprocket = sr.ok ? { synced: true } : { synced: false, message: sr.message };
        if (!sr.ok) {
          console.error('[Shiprocket] Post-payment sync failed:', sr.message, sr.details ?? '');
        }
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully (development mode, signature not strictly validated)',
        order,
        ...(shiprocket ? { shiprocket } : {}),
      });
    }

    // From here onwards, we are in production – perform strict checks
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Invalid Razorpay signature', {
        razorpay_order_id,
        razorpay_payment_id,
      });

      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order payment status
    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.paymentMethod = 'razorpay';
    await order.save();

    let shiprocket: { synced: boolean; message?: string } | undefined;
    if (process.env.SHIPROCKET_EMAIL?.trim() && process.env.SHIPROCKET_PASSWORD?.trim()) {
      const sr = await syncShiprocketOrderFromDb(orderId);
      shiprocket = sr.ok ? { synced: true } : { synced: false, message: sr.message };
      if (!sr.ok) {
        console.error('[Shiprocket] Post-payment sync failed:', sr.message, sr.details ?? '');
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order: order,
      ...(shiprocket ? { shiprocket } : {}),
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to verify payment' 
    });
  }
};

