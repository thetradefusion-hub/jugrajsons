import express from 'express';
import {
  sendMessage,
  getChatMessages,
  getChatList,
  sendExpertReply,
  getExpertChatMessages,
} from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/send', sendMessage);
router.get('/list', getChatList);
router.get('/:expertId', getChatMessages);

// Expert/Admin routes
router.post('/expert/reply', sendExpertReply);
router.get('/expert/:expertId/user/:userId', getExpertChatMessages);

export default router;

