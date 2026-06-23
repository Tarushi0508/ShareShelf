import Order from '../models/Order.js';
import Listing from '../models/Listing.js';

export const getReceivedOrders = async (req, res) => {
  try {
    const myListings = await Listing.find({ owner: req.user._id }).select('_id');
    const listingIds = myListings.map((l) => l._id);

    const orders = await Order.find({ listing: { $in: listingIds } })
      .populate('listing', 'title images currency')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('listing', 'title images currency')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};