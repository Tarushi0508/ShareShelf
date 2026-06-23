import express from 'express';
import {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/mine', protect, getMyBookings);
router.get('/received', protect, getReceivedBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
