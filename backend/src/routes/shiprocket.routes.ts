import express from 'express';
import {
  getShippingRates,
  createShiprocketOrder,
  createShipment,
  trackShipment,
  cancelShipment,
} from '../controllers/shiprocket.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get shipping rates
router.post('/rates', getShippingRates);

// Create order in Shiprocket
router.post('/create-order', createShiprocketOrder);

// Create shipment (Generate AWB)
router.post('/create-shipment', createShipment);

// Track shipment
router.get('/track/:orderId', trackShipment);

// Cancel shipment
router.post('/cancel', cancelShipment);

export default router;

