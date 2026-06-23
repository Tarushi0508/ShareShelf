import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    listingType: { type: String, enum: ['sale', 'rent', 'both'], required: true },
    currency: { type: String, enum: ['USD', 'INR'], default: 'USD' },
    salePrice: { type: Number },
    rentalRate: { type: Number },
    rentalUnit: { type: String, enum: ['day', 'week'], default: 'day' },
    location: { type: String, required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
