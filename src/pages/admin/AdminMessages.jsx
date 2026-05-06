import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../services/firebase';

function MessageCard({ msg, onMarkRead, onDelete }) {
  const [open, setOpen] = useState(false);
  const date = msg.createdAt?.toDate?.()?.toLocaleDateString?.('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) || 'Unknown date';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className={`glass rounded-2xl overflow-hidden transition-all ${!msg.read ? 'border-l-2 border-primary' : ''}`}
    >
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/3"
        onClick={() => setOpen(!open)}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-sm flex-shrink-0"
             style={{ background: !msg.read ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)', color: !msg.read ? '#00D4FF' : '#ffffff50' }}>
          {msg.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-inter font-semibold text-white text-sm truncate">{msg.name}</span>
            {!msg.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
          </div>
          <p className="font-inter text-white/40 text-xs truncate">{msg.subject || 'No subject'}</p>
        </div>
        <span className="font-inter text-white/25 text-xs flex-shrink-0 hidden sm:block">{date}</span>
        <div className="flex gap-2 flex-shrink-0">
          {!msg.read && (
            <button
              onClick={e => { e.stopPropagation(); onMarkRead(msg.id); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-success hover:bg-success/10 transition-colors"
              title="Mark as read"
            >
              <FiCheck size={13} />
            </button>
          )}
          <button
            onClick={e => { e.stopPropagation(); onDelete(msg.id); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/5 pt-4">
              <div className="flex gap-4 mb-3 text-xs font-inter text-white/30">
                <span>From: <span className="text-white/60">{msg.email}</span></span>
              </div>
              <p className="font-inter text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              <div className="flex gap-2 mt-4">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <FiMail size={12} /> Reply
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id) => {
    await updateDoc(doc(db, 'messages', id), { read: true });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    toast.success('Marked as read.');
  };

  const deleteMsg = async (id) => {
    await deleteDoc(doc(db, 'messages', id));
    setMessages(prev => prev.filter(m => m.id !== id));
    toast.success('Message deleted.');
  };

  const filtered = filter === 'unread' ? messages.filter(m => !m.read) :
                   filter === 'read' ? messages.filter(m => m.read) : messages;

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-orbitron font-black text-2xl text-white mb-1">
              <span className="gradient-text">Messages</span>
              {unreadCount > 0 && (
                <span className="ml-3 text-sm font-inter px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.3)' }}>
                  {unreadCount} unread
                </span>
              )}
            </h1>
            <p className="font-inter text-white/30 text-sm">{messages.length} total messages</p>
          </div>
          <button onClick={fetchMessages} className="btn-ghost glass rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-1.5 rounded-full font-orbitron text-xs font-semibold tracking-wider transition-all ${
                filter === val ? 'text-bg' : 'glass text-white/40 hover:text-white'
              }`}
              style={filter === val ? { background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Messages */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiMail size={40} className="text-white/10 mx-auto mb-4" />
            <p className="font-orbitron text-white/20">No messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map(msg => (
                <MessageCard key={msg.id} msg={msg} onMarkRead={markRead} onDelete={deleteMsg} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
