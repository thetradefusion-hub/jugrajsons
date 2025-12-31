import express from 'express';
import {
  createAppointment,
  getUserAppointments,
  getExpertAppointments,
  updateAppointment,
  cancelAppointment,
  getAllAppointments,
} from '../controllers/appointment.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createAppointment);
router.get('/my-appointments', getUserAppointments);
router.put('/:id', updateAppointment);
router.put('/:id/cancel', cancelAppointment);

// Expert routes
router.get('/expert/:expertId', getExpertAppointments);

// Admin routes
router.use(admin);
router.get('/all', getAllAppointments);

export default router;

