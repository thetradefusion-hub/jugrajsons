import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { createActivityLog } from '../utils/activityLog';

// Get all reviews (admin)
export const getReviews = async (req: Request, res: Response) => {
  try {
    const { status, productId } = req.query;
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    if (productId) {
      query.productId = productId;
    }

    const reviews = await Review.find(query)
      .populate('productId', 'name slug')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform to match frontend format
    const transformedReviews = reviews.map((review: any) => ({
      ...review,
      productId: review.productId?._id || review.productId,
      productName: review.productId?.name || 'Unknown Product',
      userId: review.userId?._id || review.userId,
      userName: review.userId?.name || 'Unknown User',
    }));

    res.json(transformedReviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get single review
export const getReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('productId', 'name slug')
      .populate('userId', 'name email');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create review (user)
export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = (req as any).user._id;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      productId,
      userId,
      rating,
      comment,
      status: 'pending',
    });

    await review.populate('productId', 'name slug');
    await review.populate('userId', 'name email');

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update review status (admin)
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const adminId = (req as any).user._id;

    const review = await Review.findById(req.params.id)
      .populate('productId', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;
    await review.save();

    // Update product rating if approved
    if (status === 'approved') {
      const product = await Product.findById(review.productId);
      if (product) {
        const approvedReviews = await Review.find({
          productId: review.productId,
          status: 'approved',
        });
        
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        product.rating = totalRating / approvedReviews.length;
        product.reviewCount = approvedReviews.length;
        await product.save();
      }
    }

    // Log activity
    await createActivityLog({
      adminId,
      action: status === 'approved' ? 'approved' : 'rejected',
      entity: 'review',
      entityId: review._id,
      entityName: (review.productId as any).name,
      details: `Review ${status} for product`,
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    });

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user._id;
    const review = await Review.findById(req.params.id)
      .populate('productId', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const product = await Product.findById(review.productId);
    if (product) {
      const approvedReviews = await Review.find({
        productId: review.productId,
        status: 'approved',
      });
      
      if (approvedReviews.length > 0) {
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        product.rating = totalRating / approvedReviews.length;
        product.reviewCount = approvedReviews.length;
      } else {
        product.rating = 0;
        product.reviewCount = 0;
      }
      await product.save();
    }

    // Log activity
    await createActivityLog({
      adminId,
      action: 'deleted',
      entity: 'review',
      entityId: review._id,
      entityName: (review.productId as any).name,
      details: 'Review deleted',
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get product reviews (public)
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
      status: 'approved',
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

