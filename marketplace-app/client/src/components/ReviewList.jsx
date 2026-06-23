import StarRating from './StarRating.jsx';

const ReviewList = ({ reviews, avgRating, count }) => {
  if (count === 0) return <p className="text-ink/40 text-sm">No reviews yet.</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <StarRating value={Math.round(avgRating)} readonly size="sm" />
        <span className="font-display font-semibold text-ink">{avgRating}</span>
        <span className="text-ink/50 text-sm">({count} review{count !== 1 ? 's' : ''})</span>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r._id} className="p-4 rounded-xl border border-sage-100 bg-white">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-ink text-sm">{r.reviewer?.name}</p>
              <StarRating value={r.rating} readonly size="sm" />
            </div>
            {r.listing && <p className="text-xs text-ink/40 mb-1">About: {r.listing.title}</p>}
            <p className="text-sm text-ink/70">{r.comment}</p>
            <p className="text-xs text-ink/30 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;