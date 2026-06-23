import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/messages/conversations');
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-6">Messages</h1>

      {loading ? (
        <p className="text-ink/50">Loading...</p>
      ) : conversations.length === 0 ? (
        <p className="text-ink/50">No conversations yet. Message a listing owner to start one.</p>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => {
            const image = c.listing?.images?.[0] || 'https://placehold.co/100x100/EEF2EE/3B5641?text=%20';
            return (
              <Link
                key={`${c.listing._id}_${c.otherUser._id}`}
                to={`/messages/${c.listing._id}/${c.otherUser._id}`}
                state={{ listingTitle: c.listing.title, otherUserName: c.otherUser.name }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-sage-100 bg-white hover:border-sage-400/50 transition-colors"
              >
                <img
                  src={image}
                  alt={c.listing.title}
                  className="w-14 h-14 rounded-xl object-cover bg-sage-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display font-semibold text-ink truncate">{c.otherUser.name}</p>
                    {c.unreadCount > 0 && (
                      <span className="text-[11px] font-mono bg-sage-600 text-paper px-2 py-0.5 rounded-full flex-shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink/50 truncate">About: {c.listing.title}</p>
                  <p className="text-sm text-ink/70 truncate mt-0.5">{c.lastMessage.content}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;