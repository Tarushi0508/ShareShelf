import express from 'express';
import { createReview, getUserReviews, getMyReviewForTransaction } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/my/:transactionId', protect, getMyReviewForTransaction);

export default router;