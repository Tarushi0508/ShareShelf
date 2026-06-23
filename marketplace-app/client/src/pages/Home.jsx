import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import ListingCard from '../components/ListingCard.jsx';

const SkeletonCard = () => (
  <div className="rounded-2xl border border-sage-100 bg-white overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-sage-50" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-20 rounded-full bg-sage-50" />
      <div className="h-5 w-3/4 rounded bg-sage-50" />
      <div className="h-3 w-1/2 rounded bg-sage-50" />
    </div>
  </div>
);

const HeroVisual = () => (
  <div className="relative w-full max-w-xs h-64 mx-auto select-none">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 260" fill="none">
      <path
        d="M68,190 Q150,250 232,110"
        stroke="#1F2521"
        strokeOpacity="0.15"
        strokeWidth="2"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />
    </svg>

    <div className="absolute top-2 left-0 w-44 -rotate-[9deg] bg-clay text-paper rounded-2xl px-5 py-4 shadow-xl shadow-clay/20">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-paper border-2 border-clay" />
      <p className="font-mono text-[11px] uppercase tracking-wide opacity-75">Buy it</p>
      <p className="font-display text-3xl font-semibold leading-tight">$120</p>
    </div>

    <div className="absolute bottom-2 right-0 w-44 rotate-[7deg] bg-sage-600 text-paper rounded-2xl px-5 py-4 shadow-xl shadow-sage-700/20">
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-paper border-2 border-sage-600" />
      <p className="font-mono text-[11px] uppercase tracking-wide opacity-75">Or borrow it</p>
      <p className="font-display text-3xl font-semibold leading-tight">$15/day</p>
    </div>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-paper border border-sage-100 shadow-md flex items-center justify-center">
      <span className="font-display text-sm font-semibold text-ink/50">or</span>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center text-center py-16 px-6 rounded-2xl border border-dashed border-sage-100">
    <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center mb-4">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C6B53" strokeWidth="1.8">
        <path d="M3 9l1.5-5h15L21 9M3 9v9a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 13h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <p className="font-display text-lg font-semibold text-ink mb-1">Nothing here yet</p>
    <p className="text-ink/50 text-sm max-w-xs">
      No listings match that search. Try a different filter, or be the first to list something.
    </p>
  </div>
);

const Home = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter !== 'all') params.listingType = filter;
      const { data } = await api.get('/listings', { params });
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block font-mono text-xs uppercase tracking-wide text-sage-600 bg-sage-50 px-3 py-1 rounded-full mb-4">
            One listing, two ways to get it
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4 leading-[1.1]">
            Buy it outright,
            <br />
            or borrow it for a while.
          </h1>
          <p className="text-ink/60 max-w-md text-[15px] leading-relaxed">
            Every listing here can be bought or rented — your choice. List what you're not
            using, find what you only need for now.
          </p>
        </div>
        <HeroVisual />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1F2521"
              strokeOpacity="0.4"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-sage-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-shadow"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'sale', 'rent', 'both'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors capitalize ${
                  filter === type
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-white text-ink/70 border-sage-100 hover:border-ink/30'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
