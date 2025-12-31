import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import { createActivityLog } from '../utils/activityLog';

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const unpaidOrders = await Order.countDocuments({ paymentStatus: 'pending' });

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      paidOrders,
      unpaidOrders,
      recentOrders
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status and payment status
router.put('/orders/:id', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email').populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products (admin view)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Inventory Management
router.get('/inventory', async (req, res) => {
  try {
    const products = await Product.find().select('name slug stockCount inStock category sku price').sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update product stock
router.put('/products/:id/stock', async (req, res) => {
  try {
    const { stockCount } = req.body;
    const adminId = (req as any).user._id;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stockCount = stockCount;
    product.inStock = stockCount > 0;
    await product.save();

    // Log activity
    await createActivityLog({
      adminId,
      action: 'updated',
      entity: 'product',
      entityId: product._id,
      entityName: product.name,
      details: `Stock updated to ${stockCount}`,
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    });

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk stock update
router.put('/products/bulk-stock', async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, stockCount }
    const adminId = (req as any).user._id;

    const results = [];
    for (const update of updates) {
      const product = await Product.findById(update.id);
      if (product) {
        product.stockCount = update.stockCount;
        product.inStock = update.stockCount > 0;
        await product.save();

        await createActivityLog({
          adminId,
          action: 'updated',
          entity: 'product',
          entityId: product._id,
          entityName: product.name,
          details: `Bulk stock update to ${update.stockCount}`,
          ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        });

        results.push(product);
      }
    }

    res.json({ updated: results.length, products: results });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Reports
router.get('/reports', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate as string) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate as string) };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      averageOrderValue,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

