import express from 'express';
import {
  getExperts,
  getExpert,
  createExpert,
  updateExpert,
  deleteExpert,
} from '../controllers/expert.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = express.Router();

// Public routes
router.get('/', getExperts);
router.get('/:id', getExpert);

// Admin routes
router.use(protect, admin);
router.post('/', createExpert);
router.put('/:id', updateExpert);
router.delete('/:id', deleteExpert);

export default router;

