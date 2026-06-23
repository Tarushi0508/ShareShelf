import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-sage-100 shadow-sm p-8">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">Create your account</h1>
        <p className="text-ink/50 text-sm mb-6">Start listing, buying, or borrowing in a minute.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink/60 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-shadow"
            />
          </div>
          {error && <p className="text-sm text-clay bg-clay/5 border border-clay/20 rounded-lg px-3 py-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-ink text-paper font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="text-sm text-ink/60 mt-5 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-600 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
