import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    transactionType: { type: String, enum: ['order', 'booking'], required: true },
    transactionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

reviewSchema.index({ reviewer: 1, transactionId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;