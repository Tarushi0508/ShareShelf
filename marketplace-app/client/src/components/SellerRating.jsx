import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import StarRating from './StarRating.jsx';

const SellerRating = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!userId) return;
    api.get(`/reviews/user/${userId}`).then(({ data }) => setData(data)).catch(() => {});
  }, [userId]);

  if (!data) return null;

  return (
    <Link to={`/users/${userId}`} className="inline-flex items-center gap-2 mb-4 group">
      {data.count > 0 ? (
        <>
          <StarRating value={Math.round(data.avgRating)} readonly size="sm" />
          <span className="text-sm text-ink/60 group-hover:text-sage-600 transition-colors">
            {data.avgRating} ({data.count} review{data.count !== 1 ? 's' : ''})
          </span>
        </>
      ) : (
        <span className="text-sm text-ink/40 group-hover:text-sage-600 transition-colors">
          No reviews yet · View profile
        </span>
      )}
    </Link>
  );
};

export default SellerRating;