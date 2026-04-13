import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Order from '../models/Order';
import Product from '../models/Product';
import Notification from '../models/Notification';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, discount, shippingCost } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Calculate total and validate products
    let subtotal = 0;
    const orderItems = [];
    const productMap = new Map(); // Store product info for stock update

    for (const item of items) {
      // Try to find product by _id, if fails try by slug or other identifier
      let product = null;
      
      // Check if productId is a valid MongoDB ObjectId
      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(item.productId);
      }
      
      // If not found by _id, try to find by slug or other field
      if (!product) {
        // Try to find by any identifier - this is a fallback
        product = await Product.findOne({
          $or: [
            { _id: item.productId },
            { slug: item.productId },
            { sku: item.productId }
          ]
        });
      }
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product with ID ${item.productId} not found. Please refresh and try again.` 
        });
      }

      if (!product.inStock || product.stockCount < item.quantity) {
        return res.status(400).json({ 
          message: `Product ${product.name} is out of stock or insufficient quantity. Available: ${product.stockCount}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // Store product info for stock update
      productMap.set(product._id.toString(), {
        product,
        quantity: item.quantity
      });
    }

    // Calculate shipping cost
    // Temporarily set to 0 so you can test with low-value orders
    const calculatedShippingCost = 0;
    
    // Apply discount if coupon used
    const finalTotal = subtotal + calculatedShippingCost - (discount || 0);

    // Validate final total
    if (finalTotal < 0) {
      return res.status(400).json({ message: 'Invalid order total. Please check your cart.' });
    }

    // Create order
    const order = await Order.create({
      user: req.user!._id,
      items: orderItems,
      total: finalTotal,
      discount: discount || 0,
      couponCode: couponCode || undefined,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: 'pending'
    });

    // Update coupon usage if applied
    if (couponCode) {
      try {
        const Coupon = (await import('../models/Coupon')).default;
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
        if (coupon) {
          coupon.usedCount = (coupon.usedCount || 0) + 1;
          await coupon.save();
        }
      } catch (couponError) {
        console.error('Error updating coupon usage:', couponError);
        // Don't fail the order if coupon update fails
      }
    }

    // Update product stock using the stored product info
    for (const [productId, { product, quantity }] of productMap) {
      try {
        product.stockCount -= quantity;
        if (product.stockCount <= 0) {
          product.inStock = false;
          product.stockCount = 0;
        }
        await product.save();
      } catch (stockError) {
        console.error(`Error updating stock for product ${productId}:`, stockError);
        // Continue with other products even if one fails
      }
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!populatedOrder) {
      return res.status(500).json({ message: 'Failed to retrieve created order' });
    }

    // Create notification for admin
    try {
      const userName = (populatedOrder.user as any)?.name || 'Customer';
      await Notification.create({
        type: 'order',
        title: 'New Order Received',
        message: `Order #${order._id.toString().slice(-6).toUpperCase()} has been placed by ${userName}`,
        link: `/admin/orders`,
        read: false,
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't fail the order if notification creation fails
    }

    // Shiprocket: COD = sync immediately. Online prepaid = sync after Razorpay verify (payment.controller).
    let shiprocketMeta: { synced: boolean; message?: string } | undefined;
    const payMethod = (paymentMethod || 'cod').toLowerCase();
    if (
      payMethod !== 'online' &&
      process.env.SHIPROCKET_EMAIL?.trim() &&
      process.env.SHIPROCKET_PASSWORD?.trim()
    ) {
      const { syncShiprocketOrderFromDb } = await import('../services/shiprocket.service');
      const sr = await syncShiprocketOrderFromDb(order._id.toString());
      shiprocketMeta = sr.ok
        ? { synced: true }
        : { synced: false, message: sr.message };
      if (!sr.ok) {
        console.error('[Shiprocket] Checkout sync failed:', sr.message, sr.details ?? '');
      }
    }

    const payload =
      typeof (populatedOrder as any).toObject === 'function'
        ? (populatedOrder as any).toObject()
        : { ...(populatedOrder as any) };
    if (shiprocketMeta) {
      (payload as any).shiprocket = shiprocketMeta;
    }

    res.status(201).json(payload);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to place order. Please try again.' 
    });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order (user endpoint)
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order can be cancelled
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel a delivered order' });
    }

    if (order.status === 'shipped') {
      return res.status(400).json({ message: 'Cannot cancel a shipped order. Please contact customer support.' });
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      try {
        const product = await Product.findById(item.product);
        if (product) {
          product.stockCount += item.quantity;
          if (product.stockCount > 0) {
            product.inStock = true;
          }
          await product.save();
        }
      } catch (error) {
        console.error(`Error restoring stock for product ${item.product}:`, error);
      }
    }

    // Create notification for user
    try {
      await Notification.create({
        type: 'order',
        title: 'Order Cancelled',
        message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been cancelled successfully.`,
        link: `/orders`,
        userId: req.user!._id,
        read: false,
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }

    res.json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: error.message || 'Failed to cancel order' });
  }
};

// Track order (public endpoint - no auth required)
export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let order;
    
    // Check if the ID is a valid MongoDB ObjectId (24 hex characters)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Search by full ObjectId
      order = await Order.findById(id)
        .populate('items.product', 'name images price slug');
    } else {
      // Search by short order number (last 6 characters of _id)
      // Since MongoDB doesn't support substring queries on _id efficiently,
      // we'll fetch recent orders (last 1000) and filter in memory
      // For production, consider adding an orderNumber field to the schema
      const shortIdUpper = id.toUpperCase().trim();
      
      // Get recent orders (sorted by creation date, most recent first)
      // Limit to 1000 to avoid performance issues
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(1000)
        .select('_id')
        .lean();
      
      // Find order where last 6 chars of _id match
      const matchingOrder = recentOrders.find(o => {
        const orderIdStr = o._id.toString().toUpperCase();
        return orderIdStr.slice(-6) === shortIdUpper;
      });
      
      if (matchingOrder) {
        // Fetch the full order with populated data
        order = await Order.findById(matchingOrder._id)
          .populate('items.product', 'name images price slug');
      }
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get tracking data from Shiprocket if available
    let tracking = null;
    if (order.shiprocketAwbCode || order.shiprocketShipmentId) {
      try {
        const axios = require('axios');
        const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';
        
        // Get Shiprocket token
        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;
        
        if (email && password) {
          const authResponse = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
            email,
            password,
          });
          
          const token = authResponse.data.token;
          if (token) {
            const trackingId = order.shiprocketAwbCode || order.shiprocketShipmentId;
            const response = await axios.get(
              `${SHIPROCKET_API_URL}/courier/track/shipment/${trackingId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            tracking = response.data?.data?.tracking_data?.shipment_track || null;
          }
        }
      } catch (error: any) {
        // If Shiprocket tracking fails, continue without tracking data
        console.error('Shiprocket tracking error:', error.message);
      }
    }

    res.json({
      order: {
        _id: order._id,
        items: order.items,
        total: order.total,
        discount: order.discount,
        couponCode: order.couponCode,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        shiprocketOrderId: order.shiprocketOrderId,
        shiprocketShipmentId: order.shiprocketShipmentId,
        shiprocketAwbCode: order.shiprocketAwbCode,
        shiprocketCourierName: order.shiprocketCourierName,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      tracking: tracking,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

