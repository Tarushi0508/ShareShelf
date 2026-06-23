import { useState } from 'react';
import api from '../api/axios.js';
import StarRating from './StarRating.jsx';

const ReviewForm = ({ transactionType, transactionId, revieweeName, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/reviews', { transactionType, transactionId, rating, comment });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-amber-400/5 border border-amber-400/20">
      <h4 className="font-display font-semibold text-ink text-sm">Leave a review for {revieweeName}</h4>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={3}
        maxLength={500}
        className="w-full px-3 py-2 rounded-lg border border-sage-100 text-sm resize-none"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink/40">{comment.length}/500</p>
        {error && <p className="text-xs text-clay">{error}</p>}
        <button type="submit" disabled={loading} className="px-4 py-1.5 rounded-full bg-amber-500 text-paper text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;