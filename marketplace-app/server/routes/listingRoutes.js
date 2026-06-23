import express from 'express';
import {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
  buyListing,
} from '../controllers/listingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getListings);
router.get('/mine', protect, getMyListings);
router.get('/:id', getListingById);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/:id/buy', protect, buyListing);

export default router;
