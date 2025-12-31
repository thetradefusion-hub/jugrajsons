import express from 'express';
import {
  getNotifications,
  getUserNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = express.Router();

// User routes
router.get('/user', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);

// Admin routes
router.get('/', protect, admin, getNotifications);
router.post('/', protect, admin, createNotification);
router.delete('/:id', protect, admin, deleteNotification);

export default router;

