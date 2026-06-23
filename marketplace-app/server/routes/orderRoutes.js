import express from 'express';
import { getReceivedOrders, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/received', protect, getReceivedOrders);
router.get('/mine', protect, getMyOrders);

export default router;