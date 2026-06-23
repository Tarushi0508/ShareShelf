import mongoose from 'mongoose';
import addressSchema from './Address.js';

const bookingSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    deliveryAddress: { type: addressSchema, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalCost: { type: Number },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;