import { useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyAddress = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
};

const AddressForm = ({ onSubmit, submitLabel, submitting }) => {
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.savedAddress || emptyAddress);
  const [saveAsDefault, setSaveAsDefault] = useState(!user?.savedAddress);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const required = ['fullName', 'line1', 'city', 'postalCode', 'country', 'phone'];
    for (const field of required) {
      if (!address[field]?.trim()) {
        setError('Please fill in all required address fields.');
        return;
      }
    }

    if (saveAsDefault) {
      try {
        await api.put('/auth/profile', { savedAddress: address });
      } catch (err) {
        console.error('Could not save default address', err);
      }
    }

    onSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-sage-50 border border-sage-100">
      <h4 className="font-display font-semibold text-ink">Delivery address</h4>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="fullName"
          placeholder="Full name"
          value={address.fullName}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-sage-100 text-sm col-span-2"
        />
        <input
          name="line1"
          placeholder="Address line 1"
          value={address.line1}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-sage-100 text-sm col-span-2"
        />
        <input
          name="line2"
          placeholder="Address line 2 (optional)"
          value={address.line2}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-sage-100 text-sm col-span-2"
        />
        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-sage-100 text-sm"
        />
        <input
          name="state"
          placeholder="State (optional)"
          value={address.state}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-sage-100 text-sm"
        />
        <input
          name="postalCode"
          placeholder="Postal code"
          value={address.postalCode}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-sage-100 text-sm"
        />
        <input
          name="country"
          placeholder="Country"
          value={address.country}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-sage-100 text-sm"
        />
        <input
          name="phone"
          placeholder="Phone number"
          value={address.phone}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-sage-100 text-sm col-span-2"
        />
      </div>

      <label className="flex items-center gap-2 text-xs text-ink/60">
        <input
          type="checkbox"
          checked={saveAsDefault}
          onChange={(e) => setSaveAsDefault(e.target.checked)}
          className="rounded border-sage-100"
        />
        Save this as my default address
      </label>

      {error && <p className="text-sm text-clay">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 rounded-full bg-ink text-paper font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Processing...' : submitLabel}
      </button>
    </form>
  );
};

export default AddressForm;