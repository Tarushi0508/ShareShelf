import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { formatPrice } from '../utils/currency.js';
import ReviewForm from '../components/ReviewForm.jsx';

const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-amber-400/15 text-amber-600 border-amber-400/40',
    approved: 'bg-sage-100 text-sage-700 border-sage-400/40',
    declined: 'bg-clay/10 text-clay border-clay/30',
    completed: 'bg-ink/5 text-ink/60 border-ink/10',
    cancelled: 'bg-ink/5 text-ink/40 border-ink/10',
  };
  return (
    <span className={`text-xs font-mono uppercase px-2 py-1 rounded-full border ${colors[status]}`}>
      {status}
    </span>
  );
};

const AddressBlock = ({ address }) => {
  if (!address) return null;
  return (
    <div className="text-sm text-ink/60 bg-sage-50 rounded-lg px-3 py-2 mb-3">
      <p className="font-medium text-ink/80">{address.fullName} · {address.phone}</p>
      <p>
        {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}
        {address.state ? `, ${address.state}` : ''} {address.postalCode}, {address.country}
      </p>
    </div>
  );
};

const ReviewPrompt = ({ transactionType, transactionId, revieweeName, userId }) => {
  const [reviewed, setReviewed] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await api.get(`/reviews/my/${transactionId}`);
        setReviewed(!!data);
      } catch {
        setReviewed(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [transactionId]);

  if (loading) return null;

  if (reviewed) {
    return (
      <p className="text-xs text-ink/40 mt-2">
        ✓ You reviewed this transaction ·{' '}
        <Link to={`/users/${userId}`} className="text-sage-600 underline">See their profile</Link>
      </p>
    );
  }

  if (showForm) {
    return (
      <div className="mt-3">
        <ReviewForm
          transactionType={transactionType}
          transactionId={transactionId}
          revieweeName={revieweeName}
          onSuccess={() => setReviewed(true)}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="mt-2 text-xs font-medium text-amber-600 border border-amber-400/40 px-3 py-1 rounded-full hover:bg-amber-400/10 transition-colors"
    >
      Leave a review for {revieweeName}
    </button>
  );
};

const Dashboard = () => {
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [listingsRes, myBookingsRes, receivedRes, ordersRes, myOrdersRes] = await Promise.all([
        api.get('/listings/mine'),
        api.get('/bookings/mine'),
        api.get('/bookings/received'),
        api.get('/orders/received'),
        api.get('/orders/mine'),
      ]);
      setListings(listingsRes.data);
      setMyBookings(myBookingsRes.data);
      setReceivedBookings(receivedRes.data);
      setReceivedOrders(ordersRes.data);
      setMyOrders(myOrdersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return;
    await api.delete(`/listings/${id}`);
    fetchAll();
  };

  const handleBookingStatus = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    fetchAll();
  };

  const handleCancelBooking = async (id) => {
    await api.put(`/bookings/${id}/cancel`);
    fetchAll();
  };

  const tabs = [
    { key: 'listings', label: 'My listings' },
    { key: 'orders', label: 'Orders received' },
    { key: 'myorders', label: 'My purchases' },
    { key: 'received', label: 'Borrow requests received' },
    { key: 'bookings', label: 'My borrow requests' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">Dashboard</h1>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-sage-100">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? 'border-ink text-ink' : 'border-transparent text-ink/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink/50">Loading...</p>
      ) : (
        <>
          {tab === 'listings' && (
            <div className="space-y-3">
              {listings.length === 0 && <p className="text-ink/50">You haven't listed anything yet.</p>}
              {listings.map((l) => (
                <div key={l._id} className="flex items-center justify-between p-4 rounded-xl border border-sage-100 bg-white">
                  <div>
                    <Link to={`/listings/${l._id}`} className="font-display font-semibold text-ink">{l.title}</Link>
                    <p className="text-sm text-ink/50 capitalize">{l.listingType} · {l.status}</p>
                  </div>
                  <button onClick={() => handleDeleteListing(l._id)} className="text-sm text-clay font-medium">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-3">
              {receivedOrders.length === 0 && <p className="text-ink/50">No purchases on your listings yet.</p>}
              {receivedOrders.map((o) => (
                <div key={o._id} className="p-4 rounded-xl border border-sage-100 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-display font-semibold text-ink">{o.listing?.title}</p>
                    <span className="text-sm font-mono text-ink/70">{formatPrice(o.price, o.listing?.currency)}</span>
                  </div>
                  <p className="text-sm text-ink/60 mb-3">
                    Bought by {o.buyer?.name} ({o.buyer?.email}) · {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                  <AddressBlock address={o.deliveryAddress} />
                  <ReviewPrompt
                    transactionType="order"
                    transactionId={o._id}
                    revieweeName={o.buyer?.name}
                    userId={o.buyer?._id}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'myorders' && (
            <div className="space-y-3">
              {myOrders.length === 0 && <p className="text-ink/50">You haven't purchased anything yet.</p>}
              {myOrders.map((o) => (
                <div key={o._id} className="p-4 rounded-xl border border-sage-100 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <Link to={`/listings/${o.listing?._id}`} className="font-display font-semibold text-ink">
                      {o.listing?.title}
                    </Link>
                    <span className="text-sm font-mono text-ink/70">{formatPrice(o.price, o.listing?.currency)}</span>
                  </div>
                  <p className="text-sm text-ink/60 mb-2">{new Date(o.createdAt).toLocaleDateString()}</p>
                  <ReviewPrompt
                    transactionType="order"
                    transactionId={o._id}
                    revieweeName="the seller"
                    userId={o.listing?.owner}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'received' && (
            <div className="space-y-3">
              {receivedBookings.length === 0 && <p className="text-ink/50">No borrow requests on your listings yet.</p>}
              {receivedBookings.map((b) => (
                <div key={b._id} className="p-4 rounded-xl border border-sage-100 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-display font-semibold text-ink">{b.listing?.title}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-ink/60 mb-1">
                    Requested by {b.borrower?.name} ({b.borrower?.email})
                  </p>
                  <p className="text-sm text-ink/60 mb-3">
                    {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    {b.totalCost ? ` · ${formatPrice(b.totalCost, b.listing?.currency)}` : ''}
                  </p>
                  <AddressBlock address={b.deliveryAddress} />
                  {b.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleBookingStatus(b._id, 'approved')} className="px-3 py-1.5 rounded-full bg-sage-600 text-paper text-sm font-medium">Approve</button>
                      <button onClick={() => handleBookingStatus(b._id, 'declined')} className="px-3 py-1.5 rounded-full bg-clay text-paper text-sm font-medium">Decline</button>
                    </div>
                  )}
                  {b.status === 'approved' && (
                    <button onClick={() => handleBookingStatus(b._id, 'completed')} className="px-3 py-1.5 rounded-full bg-ink text-paper text-sm font-medium">
                      Mark as returned
                    </button>
                  )}
                  {['approved', 'completed'].includes(b.status) && (
                    <ReviewPrompt
                      transactionType="booking"
                      transactionId={b._id}
                      revieweeName={b.borrower?.name}
                      userId={b.borrower?._id}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'bookings' && (
            <div className="space-y-3">
              {myBookings.length === 0 && <p className="text-ink/50">You haven't requested to borrow anything yet.</p>}
              {myBookings.map((b) => (
                <div key={b._id} className="p-4 rounded-xl border border-sage-100 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <Link to={`/listings/${b.listing?._id}`} className="font-display font-semibold text-ink">
                      {b.listing?.title}
                    </Link>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-ink/60 mb-3">
                    {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    {b.totalCost ? ` · ${formatPrice(b.totalCost, b.listing?.currency)}` : ''}
                  </p>
                  {b.status === 'pending' && (
                    <button onClick={() => handleCancelBooking(b._id)} className="px-3 py-1.5 rounded-full border border-clay text-clay text-sm font-medium">
                      Cancel request
                    </button>
                  )}
                  {['approved', 'completed'].includes(b.status) && (
                    <ReviewPrompt
                      transactionType="booking"
                      transactionId={b._id}
                      revieweeName="the owner"
                      userId={b.listing?.owner}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
