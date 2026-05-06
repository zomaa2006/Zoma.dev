import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid, FiFolder, FiMail, FiSettings, FiLogOut,
  FiExternalLink, FiChevronLeft, FiChevronRight, FiAward
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/admin/dashboard',    icon: FiGrid,    label: 'Dashboard' },
  { to: '/admin/projects',     icon: FiFolder,  label: 'Projects' },
  { to: '/admin/certificates', icon: FiAward,   label: 'Certificates' },
  { to: '/admin/messages',     icon: FiMail,    label: 'Messages' },
  { to: '/admin/settings',     icon: FiSettings,label: 'Settings' },
];

function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col glass-strong border-r border-white/5"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 mb-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-orbitron font-black text-sm flex-shrink-0"
             style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', boxShadow: '0 0 16px rgba(0,212,255,0.4)' }}>
          M
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-orbitron font-bold text-white text-sm whitespace-nowrap">HAZEM</div>
            <div className="font-inter text-white/30 text-xs whitespace-nowrap">Admin</div>
          </div>
        )}
      </div>

      {/* Links */}
      <nav className="flex-1 px-2 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? label : ''}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/5 space-y-1">
        <a
          href="/"
          target="_blank"
          className={`sidebar-link ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'View Site' : ''}
        >
          <FiExternalLink size={18} className="flex-shrink-0" />
          {!collapsed && <span>View Site</span>}
        </a>
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-400 hover:bg-red-500/10 ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <FiLogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass-strong border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
      >
        {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
      </button>
    </motion.div>
  );
}

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {children}
      </motion.main>
    </div>
  );
}
