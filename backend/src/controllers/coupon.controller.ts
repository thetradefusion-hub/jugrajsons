import { Request, Response } from 'express';
import Coupon from '../models/Coupon';
import { AuthRequest } from '../middleware/auth.middleware';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal, items } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    // Check validity dates
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // Check minimum purchase
    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase of ₹${coupon.minPurchase} required`,
      });
    }

    // Check applicability
    if (coupon.applicableTo === 'category' && coupon.categories) {
      const itemCategories = items.map((item: any) => item.category);
      const hasApplicableCategory = itemCategories.some((cat: string) =>
        coupon.categories?.includes(cat)
      );
      if (!hasApplicableCategory) {
        return res.status(400).json({
          message: 'Coupon not applicable to items in cart',
        });
      }
    }

    if (coupon.applicableTo === 'product' && coupon.products) {
      const itemProductIds = items.map((item: any) => item.productId);
      const hasApplicableProduct = itemProductIds.some((id: string) =>
        coupon.products?.some((pid) => pid.toString() === id)
      );
      if (!hasApplicableProduct) {
        return res.status(400).json({
          message: 'Coupon not applicable to items in cart',
        });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
      if (discount > cartTotal) {
        discount = cartTotal;
      }
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
      },
      discount: Math.round(discount),
      finalTotal: cartTotal - Math.round(discount),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const { active } = req.query;
    const query: any = {};

    if (active === 'true') {
      const now = new Date();
      query.isActive = true;
      query.validFrom = { $lte: now };
      query.validUntil = { $gte: now };
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const applyCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const { code, orderId } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    // Increment usage count
    coupon.usedCount += 1;
    await coupon.save();

    res.json({ message: 'Coupon applied successfully', coupon });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

