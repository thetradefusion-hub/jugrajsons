import express from 'express';
import { createOrder, getUserOrders, getOrder, trackOrder, cancelOrder } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public route - track order (no auth required)
router.get('/track/:id', trackOrder);

// All other routes require authentication
router.use(protect);

// Create order
router.post('/', createOrder);

// Get user's orders
router.get('/my-orders', getUserOrders);

// Cancel order
router.put('/:id/cancel', cancelOrder);

// Get single order
router.get('/:id', getOrder);

export default router;

