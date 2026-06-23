import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Logo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="2.5" fill="#B5694A" />
    <rect x="13" y="13" width="8" height="8" rx="2.5" fill="#4C6B53" />
    <path d="M11 13L13 11" stroke="#1F2521" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/messages/unread-count');
        setUnreadCount(data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-sage-100/80 bg-paper/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-ink tracking-tight">
          <Logo />
          Share<span className="text-sage-600">Shelf</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link to="/" className="px-3 py-2 rounded-full text-ink/70 hover:text-ink hover:bg-sage-50 transition-colors">
            Browse
          </Link>

          {user ? (
            <>
              <Link
                to="/create-listing"
                className="px-3 py-2 rounded-full text-ink/70 hover:text-ink hover:bg-sage-50 transition-colors"
              >
                List an item
              </Link>
              <Link
                to="/messages"
                className="relative px-3 py-2 rounded-full text-ink/70 hover:text-ink hover:bg-sage-50 transition-colors"
              >
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-mono bg-clay text-paper rounded-full px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-full text-ink/70 hover:text-ink hover:bg-sage-50 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-full bg-ink text-paper hover:bg-ink/90 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-full text-ink/70 hover:text-ink hover:bg-sage-50 transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="ml-2 px-4 py-2 rounded-full bg-sage-600 text-paper hover:bg-sage-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
