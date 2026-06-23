import Listing from '../models/Listing.js';
import Order from '../models/Order.js';

export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, owner: req.user._id });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const { search, category, listingType } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (listingType) query.listingType = listingType;

    const listings = await Listing.find(query)
      .populate('owner', 'name')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(listing, req.body);
    const updated = await listing.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buyListing = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;
    if (!deliveryAddress) {
      return res.status(400).json({ message: 'A delivery address is required' });
    }

    const required = ['fullName', 'line1', 'city', 'postalCode', 'country', 'phone'];
    for (const field of required) {
      if (!deliveryAddress[field] || !deliveryAddress[field].trim()) {
        return res.status(400).json({ message: `Delivery address is missing ${field}` });
      }
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status === 'sold') {
      return res.status(400).json({ message: 'Listing already sold' });
    }

    listing.status = 'sold';
    await listing.save();

    const order = await Order.create({
      listing: listing._id,
      buyer: req.user._id,
      price: listing.salePrice,
      deliveryAddress,
    });

    res.json({ message: 'Purchase successful', listing, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
