import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';

export const createReview = async (req, res) => {
  try {
    const { transactionType, transactionId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    let revieweeId, listingId;

    if (transactionType === 'order') {
      const order = await Order.findById(transactionId).populate('listing');
      if (!order) return res.status(404).json({ message: 'Order not found' });
      const isBuyer = order.buyer.toString() === req.user._id.toString();
      const isSeller = order.listing.owner.toString() === req.user._id.toString();
      if (!isBuyer && !isSeller) return res.status(403).json({ message: 'Not part of this transaction' });
      revieweeId = isBuyer ? order.listing.owner : order.buyer;
      listingId = order.listing._id;
    } else if (transactionType === 'booking') {
      const booking = await Booking.findById(transactionId).populate('listing');
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (!['approved', 'completed'].includes(booking.status)) {
        return res.status(400).json({ message: 'Can only review approved or completed bookings' });
      }
      const isBorrower = booking.borrower.toString() === req.user._id.toString();
      const isOwner = booking.listing.owner.toString() === req.user._id.toString();
      if (!isBorrower && !isOwner) return res.status(403).json({ message: 'Not part of this transaction' });
      revieweeId = isBorrower ? booking.listing.owner : booking.borrower;
      listingId = booking.listing._id;
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    const existing = await Review.findOne({ reviewer: req.user._id, transactionId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this transaction' });

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      listing: listingId,
      transactionType,
      transactionId,
      rating,
      comment,
    });

    const populated = await review.populate('reviewer', 'name');
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this transaction' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.json({ reviews, avgRating, count: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReviewForTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const review = await Review.findOne({ reviewer: req.user._id, transactionId });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};