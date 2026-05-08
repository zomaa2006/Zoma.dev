import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FiFolder, FiMail, FiEye, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../context/ProjectsContext';

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 pointer-events-none"
           style={{ background: color, transform: 'translate(30%, -30%)' }} />
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
             style={{ background: color + '15', border: `1px solid ${color}30` }}>
          <Icon size={20} color={color} />
        </div>
        <span className="font-orbitron font-black text-4xl" style={{ color }}>{value}</span>
      </div>
      <p className="font-inter text-white/40 text-sm">{label}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [msgCount, setMsgCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const msgSnap = await getDocs(collection(db, 'messages'));
        setMsgCount(msgSnap.size);
        const unread = msgSnap.docs.filter(d => !d.data().read).length;
        setUnreadCount(unread);
      } catch {}
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: FiFolder, label: 'Total Projects', value: projects.length, color: '#00D4FF', delay: 0 },
    { icon: FiStar, label: 'Featured Projects', value: projects.filter(p => p.featured).length, color: '#F59E0B', delay: 0.1 },
    { icon: FiMail, label: 'Messages', value: msgCount, color: '#7C3AED', delay: 0.2 },
    { icon: FiEye, label: 'Unread Messages', value: unreadCount, color: '#10B981', delay: 0.3 },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="font-inter text-white/30 text-sm mb-1">{greeting}, 👋</p>
          <h1 className="font-orbitron font-black text-2xl md:text-3xl text-white">
            {user?.displayName?.split(' ')[0] || 'Hazem'}{' '}
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="font-inter text-white/30 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="font-orbitron font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/projects" className="btn-primary text-xs px-5 py-2.5">
              + Add Project
            </Link>
            <Link to="/admin/messages" className="btn-outline text-xs px-5 py-2.5">
              View Messages {unreadCount > 0 && `(${unreadCount} unread)`}
            </Link>
            <a href="/" target="_blank" className="btn-ghost text-xs px-5 py-2.5 glass rounded-lg">
              Preview Site ↗
            </a>
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-orbitron font-bold text-white">Recent Projects</h2>
            <Link to="/admin/projects" className="font-inter text-xs text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                <img src={p.thumbnail} alt={p.title} className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-white text-sm font-medium truncate">{p.title}</p>
                  <p className="font-inter text-white/30 text-xs">{p.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {p.featured && <span className="text-accent text-xs">⭐</span>}
                  <span className="font-orbitron text-xs px-2 py-0.5 rounded" 
                        style={{ background: '#10B98115', color: '#10B981', border: '1px solid #10B98125' }}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
