import mongoose from 'mongoose';
import addressSchema from './Address.js';

const orderSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    deliveryAddress: { type: addressSchema, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;