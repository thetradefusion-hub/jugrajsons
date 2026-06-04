import express from 'express';
import {
  getProducts,
  getProduct,
  getProductsBySlugs,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.post('/by-slugs', getProductsBySlugs);
// Slugs may contain "/" (e.g. Apis-dorsata-/rock-bee-...) — wildcard before :slug
router.get('/detail/*', getProduct);
router.get('/:slug', getProduct);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;

