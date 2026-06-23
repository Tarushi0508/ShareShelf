import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

// Checks whether a date range overlaps with any existing pending/approved booking
const hasConflict = async (listingId, startDate, endDate) => {
  const conflict = await Booking.findOne({
    listing: listingId,
    status: { $in: ['pending', 'approved'] },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });
  return !!conflict;
};

export const createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate, deliveryAddress } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({ message: 'A delivery address is required' });
    }
    const required = ['fullName', 'line1', 'city', 'postalCode', 'country', 'phone'];
    for (const field of required) {
      if (!deliveryAddress[field] || !deliveryAddress[field].trim()) {
        return res.status(400).json({ message: `Delivery address is missing ${field}` });
      }
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.listingType === 'sale') {
      return res.status(400).json({ message: 'This listing is not available for rent' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const conflict = await hasConflict(listingId, start, end);
    if (conflict) {
      return res.status(400).json({ message: 'These dates are already booked' });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalCost = listing.rentalRate ? listing.rentalRate * days : 0;

    const booking = await Booking.create({
      listing: listingId,
      borrower: req.user._id,
      startDate: start,
      endDate: end,
      deliveryAddress,
      totalCost,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ borrower: req.user._id })
      .populate('listing')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReceivedBookings = async (req, res) => {
  try {
    const myListings = await Listing.find({ owner: req.user._id }).select('_id');
    const listingIds = myListings.map((l) => l._id);

    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate('listing')
      .populate('borrower', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
