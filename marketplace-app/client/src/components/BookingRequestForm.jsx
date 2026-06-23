import { useState } from 'react';
import api from '../api/axios.js';
import AddressForm from './AddressForm.jsx';

const BookingRequestForm = ({ listing, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDatesSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!startDate || !endDate) {
      setError('Please choose both dates.');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date.');
      return;
    }
    setShowAddress(true);
  };

  const handleAddressSubmit = async (deliveryAddress) => {
    setError('');
    setLoading(true);
    try {
      await api.post('/bookings', { listingId: listing._id, startDate, endDate, deliveryAddress });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setShowAddress(false);
    } finally {
      setLoading(false);
    }
  };

  if (showAddress) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowAddress(false)}
          className="text-xs text-sage-600 font-medium"
        >
          &larr; Back to dates
        </button>
        <AddressForm onSubmit={handleAddressSubmit} submitLabel="Send borrow request" submitting={loading} />
        {error && <p className="text-sm text-clay">{error}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleDatesSubmit} className="space-y-3 p-4 rounded-xl bg-sage-50 border border-sage-100">
      <h4 className="font-display font-semibold text-ink">Request to borrow</h4>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-mono uppercase text-ink/60 mb-1">From</label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-sage-100 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Until</label>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-sage-100 text-sm"
          />
        </div>
      </div>
      {error && <p className="text-sm text-clay">{error}</p>}
      <button
        type="submit"
        className="w-full py-2.5 rounded-full bg-sage-600 text-paper font-medium hover:bg-sage-700 transition-colors"
      >
        Continue to delivery address
      </button>
    </form>
  );
};

export default BookingRequestForm;
