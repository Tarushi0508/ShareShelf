import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookingRequestForm from '../components/BookingRequestForm.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import AddressForm from '../components/AddressForm.jsx';
import { formatPrice } from '../utils/currency.js';
import SellerRating from '../components/SellerRating.jsx';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBuyAddress, setShowBuyAddress] = useState(false);
  const [buying, setBuying] = useState(false);

  const fetchListing = async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);
      setListing(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleBuy = async (deliveryAddress) => {
    setBuying(true);
    try {
      await api.post(`/listings/${id}/buy`, { deliveryAddress });
      setMessage('Purchase confirmed! The owner will be in touch to arrange handoff.');
      setShowBuyAddress(false);
      fetchListing();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not complete purchase');
    } finally {
      setBuying(false);
    }
  };

  const handleMessageOwner = () => {
    navigate(`/messages/${listing._id}/${listing.owner._id}`, {
      state: { listingTitle: listing.title, otherUserName: listing.owner.name },
    });
  };

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-12 text-ink/50">Loading...</p>;
  if (!listing) return <p className="max-w-4xl mx-auto px-6 py-12 text-ink/50">Listing not found.</p>;

  const isOwner = user && listing.owner._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <ImageGallery images={listing.images} title={listing.title} />

        <div>
          <h1 className="font-display text-3xl font-semibold text-ink mb-2">{listing.title}</h1>
          <p className="text-ink/60 mb-4">{listing.location} · {listing.category}</p>

          <div className="flex gap-4 font-mono mb-6">
            {(listing.listingType === 'sale' || listing.listingType === 'both') && listing.salePrice && (
              <div className="px-4 py-2 rounded-xl bg-clay/10 border border-clay/30">
                <p className="text-xs uppercase text-clay/80">Buy</p>
                <p className="text-lg font-semibold text-clay">
                  {formatPrice(listing.salePrice, listing.currency)}
                </p>
              </div>
            )}
            {(listing.listingType === 'rent' || listing.listingType === 'both') && listing.rentalRate && (
              <div className="px-4 py-2 rounded-xl bg-sage-100 border border-sage-400/40">
                <p className="text-xs uppercase text-sage-700/80">Borrow</p>
                <p className="text-lg font-semibold text-sage-700">
                  {formatPrice(listing.rentalRate, listing.currency)}/{listing.rentalUnit}
                </p>
              </div>
            )}
          </div>

          <p className="text-ink/80 leading-relaxed mb-4">{listing.description}</p>

          <p className="text-sm text-ink/50 mb-2">Listed by {listing.owner?.name}</p>
          <SellerRating userId={listing.owner?._id} />
          <div className="mb-6" />

          {listing.status === 'sold' ? (
            <p className="text-clay font-medium">This item has been sold.</p>
          ) : isOwner ? (
            <p className="text-sm text-ink/50 italic">This is your listing.</p>
          ) : !user ? (
            <p className="text-sm text-ink/60">
              <a href="/login" className="text-sage-600 font-medium">Log in</a> to buy or borrow this item.
            </p>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleMessageOwner}
                className="w-full py-2.5 rounded-full border border-sage-400 text-sage-700 font-medium hover:bg-sage-50 transition-colors"
              >
                Message {listing.owner?.name}
              </button>
              {(listing.listingType === 'sale' || listing.listingType === 'both') && (
                showBuyAddress ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowBuyAddress(false)}
                      className="text-xs text-sage-600 font-medium"
                    >
                      &larr; Cancel
                    </button>
                    <AddressForm
                      onSubmit={handleBuy}
                      submitLabel={`Confirm purchase — ${formatPrice(listing.salePrice, listing.currency)}`}
                      submitting={buying}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBuyAddress(true)}
                    className="w-full py-2.5 rounded-full bg-clay text-paper font-medium hover:bg-clay/90 transition-colors"
                  >
                    Buy now — {formatPrice(listing.salePrice, listing.currency)}
                  </button>
                )
              )}
              {(listing.listingType === 'rent' || listing.listingType === 'both') && (
                <BookingRequestForm
                  listing={listing}
                  onSuccess={() => setMessage('Borrow request sent! Check your dashboard for status.')}
                />
              )}
              {message && <p className="text-sm text-sage-700">{message}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
