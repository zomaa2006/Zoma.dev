import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiFolder, FiMail, FiSettings, FiLogOut,
  FiExternalLink, FiChevronLeft, FiChevronRight, FiAward, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/admin/dashboard',    icon: FiGrid,     label: 'Dashboard' },
  { to: '/admin/projects',     icon: FiFolder,   label: 'Projects' },
  { to: '/admin/certificates', icon: FiAward,    label: 'Certificates' },
  { to: '/admin/messages',     icon: FiMail,     label: 'Messages' },
  { to: '/admin/settings',     icon: FiSettings, label: 'Settings' },
];

/* ── Desktop Sidebar ─────────────────────────────────────────────────────── */
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
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-orbitron font-black text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', boxShadow: '0 0 16px rgba(0,212,255,0.4)' }}
        >
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

/* ── Mobile Top Bar ──────────────────────────────────────────────────────── */
function MobileTopBar({ onOpen }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-white/5"
      style={{ background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-orbitron font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' }}
        >
          M
        </div>
        <span className="font-orbitron font-bold text-white text-sm">HAZEM</span>
      </div>
      <button onClick={onOpen} className="w-9 h-9 flex items-center justify-center rounded-xl glass text-white/60 hover:text-white transition-colors">
        <FiMenu size={20} />
      </button>
    </div>
  );
}

/* ── Mobile Drawer ───────────────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-[70] flex flex-col glass-strong border-r border-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-black text-base"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}
                >
                  M
                </div>
                <div>
                  <div className="font-orbitron font-bold text-white text-sm">HAZEM</div>
                  <div className="font-inter text-white/30 text-xs">Admin Portal</div>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg glass text-white/40 hover:text-white transition-colors">
                <FiX size={16} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-3 space-y-1">
              {links.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/5 space-y-1">
              <a href="/" target="_blank" onClick={onClose} className="sidebar-link">
                <FiExternalLink size={18} />
                <span>View Site</span>
              </a>
              <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-500/10">
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Mobile Bottom Nav ───────────────────────────────────────────────────── */
function MobileBottomNav() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 h-16 border-t border-white/5"
      style={{ background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(20px)' }}
    >
      {links.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors"
            style={{ color: active ? '#00D4FF' : 'rgba(255,255,255,0.3)' }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-inter">{label}</span>
          </NavLink>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors"
        style={{ color: 'rgba(239,68,68,0.7)' }}
      >
        <FiLogOut size={20} />
        <span className="text-[10px] font-inter">Logout</span>
      </button>
    </div>
  );
}

/* ── Main Layout ─────────────────────────────────────────────────────────── */
export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile top bar — shown on mobile only */}
      <div className="lg:hidden">
        <MobileTopBar onOpen={() => setDrawerOpen(true)} />
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <MobileBottomNav />
      </div>

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: 0 }}
        className={`min-h-screen
          pt-14 pb-20 lg:pt-0 lg:pb-0
        `}
        style={{}}
      >
        {/* Desktop margin via inline style to react to collapsed state */}
        <DesktopMain collapsed={collapsed}>{children}</DesktopMain>
      </motion.main>
    </div>
  );
}

/* Helper to apply desktop left margin only on lg+ */
function DesktopMain({ collapsed, children }) {
  return (
    <>
      {/* Desktop wrapper with dynamic margin */}
      <div className="hidden lg:block" style={{ marginLeft: collapsed ? 72 : 240, transition: 'margin-left 0.3s' }}>
        {children}
      </div>
      {/* Mobile wrapper — no margin */}
      <div className="lg:hidden">
        {children}
      </div>
    </>
  );
}
