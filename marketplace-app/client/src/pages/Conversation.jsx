import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const Conversation = () => {
  const { listingId, otherUserId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const listingTitle = location.state?.listingTitle;
  const otherUserName = location.state?.otherUserName;

  const fetchThread = async () => {
    try {
      const { data } = await api.get(`/messages/${listingId}/${otherUserId}`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
    const interval = setInterval(fetchThread, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', { listingId, recipientId: otherUserId, content });
      setContent('');
      fetchThread();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const derivedName =
    otherUserName ||
    messages.find((m) => m.sender._id !== user._id)?.sender?.name ||
    'Conversation';

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col h-[80vh]">
      <div className="mb-4">
        <Link to="/messages" className="text-sm text-sage-600 font-medium">
          &larr; All messages
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink mt-1">{derivedName}</h1>
        {listingTitle && <p className="text-sm text-ink/50">About: {listingTitle}</p>}
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-sage-100 bg-white p-4 space-y-3">
        {loading ? (
          <p className="text-ink/40 text-sm">Loading conversation...</p>
        ) : messages.length === 0 ? (
          <p className="text-ink/40 text-sm">No messages yet. Say hello.</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender._id === user._id;
            return (
              <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isMine ? 'bg-sage-600 text-paper' : 'bg-sage-50 text-ink'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? 'text-paper/70' : 'text-ink/40'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-full border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="px-5 py-2.5 rounded-full bg-ink text-paper font-medium text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Conversation;