import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency.js';

const TagIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24L4 3a1 1 0 00-1 1l.24 5.59a2 2 0 00.58 1.41l9.58 9.58a2 2 0 002.83 0l4.36-4.36a2 2 0 000-2.81z" />
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LoopIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 0115-6.7M21 12a9 9 0 01-15 6.7" strokeLinecap="round" />
    <path d="M17 4v4h-4M7 20v-4h4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TypeTag = ({ type }) => {
  if (type === 'sale') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wide px-2 py-1 rounded-full bg-clay/10 text-clay border border-clay/30">
        <TagIcon /> For sale
      </span>
    );
  }
  if (type === 'rent') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wide px-2 py-1 rounded-full bg-sage-100 text-sage-700 border border-sage-400/40">
        <LoopIcon /> For rent
      </span>
    );
  }
  return (
    <div className="flex gap-1.5">
      <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wide px-2 py-1 rounded-full bg-clay/10 text-clay border border-clay/30">
        <TagIcon /> Sale
      </span>
      <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wide px-2 py-1 rounded-full bg-sage-100 text-sage-700 border border-sage-400/40">
        <LoopIcon /> Rent
      </span>
    </div>
  );
};

const ListingCard = ({ listing }) => {
  const image = listing.images?.[0] || 'https://placehold.co/600x400/EEF2EE/3B5641?text=No+Image';

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="group block rounded-2xl border border-sage-100 bg-white overflow-hidden hover:shadow-lg hover:shadow-ink/5 hover:-translate-y-1 transition-all duration-200"
    >
      <div className="aspect-[4/3] overflow-hidden bg-sage-50 relative">
        <img
          src={image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
            <span className="text-paper font-mono text-xs uppercase tracking-widest border border-paper/50 px-3 py-1 rounded-full">
              Sold
            </span>
          </div>
        )}
        {listing.images?.length > 1 && (
          <span className="absolute bottom-2 right-2 text-[11px] font-mono bg-ink/70 text-paper px-2 py-0.5 rounded-full">
            +{listing.images.length} photos
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <TypeTag type={listing.listingType} />
        <h3 className="font-display text-lg font-semibold text-ink leading-snug group-hover:text-sage-700 transition-colors">
          {listing.title}
        </h3>
        <p className="text-sm text-ink/50">{listing.location}</p>
        <div className="flex items-baseline gap-3 font-mono text-sm pt-1">
          {(listing.listingType === 'sale' || listing.listingType === 'both') && listing.salePrice && (
            <span className="text-ink font-semibold">{formatPrice(listing.salePrice, listing.currency)}</span>
          )}
          {(listing.listingType === 'rent' || listing.listingType === 'both') && listing.rentalRate && (
            <span className="text-sage-700">
              {formatPrice(listing.rentalRate, listing.currency)}/{listing.rentalUnit}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
