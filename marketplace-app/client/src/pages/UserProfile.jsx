import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import ReviewList from '../components/ReviewList.jsx';
import StarRating from '../components/StarRating.jsx';

const UserProfile = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reviews/user/${userId}`)
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="max-w-3xl mx-auto px-6 py-12 text-ink/50">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center font-display text-2xl font-semibold text-sage-700">
          {data?.reviews?.[0]?.reviewee?.name?.[0] || '?'}
        </div>
        <div>
          {data?.avgRating && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(data.avgRating)} readonly size="sm" />
              <span className="font-mono text-sm text-ink/70">
                {data.avgRating} · {data.count} review{data.count !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
      <h2 className="font-display text-xl font-semibold text-ink mb-4">Reviews</h2>
      <ReviewList reviews={data?.reviews || []} avgRating={data?.avgRating} count={data?.count || 0} />
    </div>
  );
};

export default UserProfile;