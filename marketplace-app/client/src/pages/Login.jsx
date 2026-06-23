import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-sage-100 shadow-sm p-8">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">Welcome back</h1>
        <p className="text-ink/50 text-sm mb-6">Log in to buy, borrow, or list an item.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="text-sm text-ink/60 mt-5 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-sage-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
