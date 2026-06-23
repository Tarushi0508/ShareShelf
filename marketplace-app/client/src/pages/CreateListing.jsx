import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import ImageUploader from '../components/ImageUploader.jsx';
import { currencySymbol } from '../utils/currency.js';

const CreateListing = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    listingType: 'sale',
    currency: 'USD',
    salePrice: '',
    rentalRate: '',
    rentalUnit: 'day',
    images: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        rentalRate: form.rentalRate ? Number(form.rentalRate) : undefined,
      };
      const { data } = await api.post('/listings', payload);
      navigate(`/listings/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">List an item</h1>
      <p className="text-ink/60 mb-8">
        Decide whether buyers can purchase it outright, borrow it for a while, or both.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Title</label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm"
            placeholder="e.g. Canon EOS R6 Camera"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Category</label>
            <input
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm"
              placeholder="Electronics, Tools, etc."
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Location</label>
            <input
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm"
              placeholder="City"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-ink/60 mb-2">Currency</label>
          <div className="flex gap-2">
            {[
              { code: 'USD', label: 'USD ($)' },
              { code: 'INR', label: 'INR (₹)' },
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setForm({ ...form, currency: c.code })}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  form.currency === c.code
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-white text-ink/70 border-sage-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-ink/60 mb-2">
            Listing type
          </label>
          <div className="flex gap-2">
            {['sale', 'rent', 'both'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, listingType: type })}
                className={`px-4 py-2 rounded-full text-sm font-medium border capitalize transition-colors ${
                  form.listingType === type
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-white text-ink/70 border-sage-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {(form.listingType === 'sale' || form.listingType === 'both') && (
          <div>
            <label className="block text-xs font-mono uppercase text-ink/60 mb-1">
              Sale price ({currencySymbol(form.currency)})
            </label>
            <input
              name="salePrice"
              type="number"
              min="0"
              value={form.salePrice}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm"
            />
          </div>
        )}

        {(form.listingType === 'rent' || form.listingType === 'both') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-ink/60 mb-1">
                Rental rate ({currencySymbol(form.currency)})
              </label>
              <input
                name="rentalRate"
                type="number"
                min="0"
                value={form.rentalRate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Per</label>
              <select
                name="rentalUnit"
                value={form.rentalUnit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
              </select>
            </div>
          </div>
        )}

        <ImageUploader images={form.images} onChange={(images) => setForm({ ...form, images })} />

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-full bg-sage-600 text-paper font-medium hover:bg-sage-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
