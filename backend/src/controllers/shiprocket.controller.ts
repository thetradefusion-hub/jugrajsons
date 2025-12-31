import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import axios from 'axios';
import Order from '../models/Order';
import Product from '../models/Product';

// Shiprocket API Base URL
const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

// Get Shiprocket Auth Token
const getShiprocketToken = async (): Promise<string | null> => {
  try {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
      console.error('Shiprocket credentials not configured');
      return null;
    }

    const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
      email,
      password,
    });

    return response.data.token;
  } catch (error: any) {
    console.error('Shiprocket authentication error:', error.response?.data || error.message);
    return null;
  }
};

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
        weight: weight || 0.5, // Default weight in kg
        cod_amount: cod_amount || 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

    // Get order from database
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const token = await getShiprocketToken();
    if (!token) {
      return res.status(500).json({ message: 'Shiprocket authentication failed' });
    }

    // Prepare order items for Shiprocket
    const orderItems = [];
    let totalWeight = 0;

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const weight = product.weight || 0.1; // Default weight in kg
        totalWeight += weight * item.quantity;

        orderItems.push({
          name: product.name,
          sku: product.sku || product._id.toString(),
          units: item.quantity,
          selling_price: item.price,
        });
      }
    }

    // Prepare Shiprocket order payload
    const shiprocketOrder = {
      order_id: order._id.toString(),
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
      billing_customer_name: order.shippingAddress.name,
      billing_last_name: '',
      billing_address: order.shippingAddress.addressLine1,
      billing_address_2: order.shippingAddress.addressLine2 || '',
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: 'India',
      billing_email: req.user!.email,
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      shipping_customer_name: order.shippingAddress.name,
      shipping_last_name: '',
      shipping_address: order.shippingAddress.addressLine1,
      shipping_address_2: order.shippingAddress.addressLine2 || '',
      shipping_city: order.shippingAddress.city,
      shipping_pincode: order.shippingAddress.pincode,
      shipping_country: 'India',
      shipping_state: order.shippingAddress.state,
      shipping_phone: order.shippingAddress.phone,
      shipping_email: req.user!.email,
      order_items: orderItems,
      payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total: order.total - (order.discount || 0),
      length: 10,
      breadth: 10,
      height: 10,
      weight: totalWeight || 0.5,
    };

    const response = await axios.post(
      `${SHIPROCKET_API_URL}/orders/create/adhoc`,
      shiprocketOrder,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update order with Shiprocket order ID
    order.shiprocketOrderId = response.data.order_id;
    order.shiprocketShipmentId = response.data.shipment_id;
    await order.save();

    res.json({
      success: true,
      shiprocket_order_id: response.data.order_id,
      shipment_id: response.data.shipment_id,
      order: order,
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

    if (!order.shiprocketOrderId) {
      return res.status(400).json({ message: 'Shiprocket order not created yet' });
    }

    const token = await getShiprocketToken();
    if (!token) {
      return res.status(500).json({ message: 'Shiprocket authentication failed' });
    }

    const response = await axios.post(
      `${SHIPROCKET_API_URL}/orders/create/adhoc/shipment/awb`,
      {
        shipment_id: order.shiprocketShipmentId,
        courier_id: courier_id || null, // Auto-assign if not provided
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update order with AWB details
    order.shiprocketAwbCode = response.data.awb_code;
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

    if (!order.shiprocketShipmentId && !order.shiprocketAwbCode) {
      return res.status(400).json({ message: 'Shipment not created yet' });
    }

    const token = await getShiprocketToken();
    if (!token) {
      return res.status(500).json({ message: 'Shiprocket authentication failed' });
    }

    const trackingId = order.shiprocketAwbCode || order.shiprocketShipmentId;

    const response = await axios.get(
      `${SHIPROCKET_API_URL}/courier/track/shipment/${trackingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
        },
      }
    );

    // Update order status
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

