import express from 'express';
import {
  sendMessage,
  getConversations,
  getThread,
  getUnreadCount,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.get('/:listingId/:otherUserId', protect, getThread);

export default router;