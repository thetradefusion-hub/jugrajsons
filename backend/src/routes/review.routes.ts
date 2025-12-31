import express from 'express';
import {
  getReviews,
  getReview,
  createReview,
  updateReviewStatus,
  deleteReview,
  getProductReviews,
} from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// User routes
router.post('/', protect, createReview);

// Admin routes
router.get('/', protect, admin, getReviews);
router.get('/:id', protect, admin, getReview);
router.put('/:id/status', protect, admin, updateReviewStatus);
router.delete('/:id', protect, admin, deleteReview);

export default router;

