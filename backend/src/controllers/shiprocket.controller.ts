import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import axios from 'axios';
import Order from '../models/Order';
import { getShiprocketToken, syncShiprocketOrderFromDb } from '../services/shiprocket.service';

const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

// Get Shipping Rates
export const getShippingRates = async (req: AuthRequest, res: Response) => {
  try {
    const { pickup_pincode, delivery_pincode, weight, cod_amount } = req.body;

    if (!pickup_pincode || !delivery_pincode || !weight) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const token = await getShiprocketToken();
    if (!token) {
      return res.status(500).json({ message: 'Shiprocket authentication failed' });
    }

    const response = await axios.post(
      `${SHIPROCKET_API_URL}/courier/serviceability/rate`,
      {
        pickup_pincode,
        delivery_pincode,
        weight: weight || 0.5,
        cod_amount: cod_amount || 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Shiprocket shipping rates error:', error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.message || 'Failed to fetch shipping rates',
    });
  }
};

// Create Order in Shiprocket
export const createShiprocketOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const result = await syncShiprocketOrderFromDb(orderId, {
      requireUserId: req.user!._id.toString(),
    });

    if (!result.ok) {
      return res.status(result.message === 'Unauthorized' ? 403 : 500).json({
        message: result.message,
        details: result.details,
      });
    }

    const order = await Order.findById(orderId).populate('items.product');
    res.json({
      success: true,
      shiprocket_order_id: result.order_id,
      shipment_id: result.shipment_id,
      order,
    });
  } catch (error: any) {
    console.error('Shiprocket order creation error:', error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.message || 'Failed to create Shiprocket order',
      error: error.response?.data,
    });
  }
};

// Create Shipment (Generate AWB)
export const createShipment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, courier_id } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!order.shiprocketOrderId) {
      return res.status(400).json({ message: 'Shiprocket order not created yet' });
    }

    const token = await getShiprocketToken();
    if (!token) {
      return res.status(500).json({ message: 'Shiprocket authentication failed' });
    }

    const body: { shipment_id: string; courier_id?: number } = {
      shipment_id: order.shiprocketShipmentId!,
    };
    if (typeof courier_id === 'number' && !Number.isNaN(courier_id)) {
      body.courier_id = courier_id;
    }

    const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc/shipment/awb`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    order.shiprocketAwbCode = String(response.data.awb_code);
    order.shiprocketCourierName = response.data.courier_name;
    order.status = 'shipped';
    await order.save();

    res.json({
      success: true,
      awb_code: response.data.awb_code,
      courier_name: response.data.courier_name,
      order: order,
    });
  } catch (error: any) {
    console.error('Shiprocket shipment creation error:', error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.message || 'Failed to create shipment',
      error: error.response?.data,
    });
  }
};

// Track Shipment
export const trackShipment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!order.shiprocketShipmentId && !order.shiprocketAwbCode) {
      return res.status(400).json({ message: 'Shipment not created yet' });
    }

    const token = await getShiprocketToken();
    if (!token) {
      return res.status(500).json({ message: 'Shiprocket authentication failed' });
    }

    const trackingId = order.shiprocketAwbCode || order.shiprocketShipmentId;

    const response = await axios.get(`${SHIPROCKET_API_URL}/courier/track/shipment/${trackingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Shiprocket tracking error:', error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.message || 'Failed to track shipment',
    });
  }
};

// Cancel Shipment
export const cancelShipment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, awbs } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({ message: 'AWB code not found' });
    }

    const token = await getShiprocketToken();
    if (!token) {
      return res.status(500).json({ message: 'Shiprocket authentication failed' });
    }

    const response = await axios.post(
      `${SHIPROCKET_API_URL}/orders/cancel/shipment/awb`,
      {
        awbs: awbs || [order.shiprocketAwbCode],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Shipment cancelled successfully',
      data: response.data,
    });
  } catch (error: any) {
    console.error('Shiprocket cancellation error:', error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.message || 'Failed to cancel shipment',
    });
  }
};
