import express from 'express';
import {
  getActivityLogs,
  getActivityLog,
} from '../controllers/activityLog.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

router.get('/', getActivityLogs);
router.get('/:id', getActivityLog);

export default router;

