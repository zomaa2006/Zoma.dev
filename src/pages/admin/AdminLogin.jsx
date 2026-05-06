import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = await signInWithEmail(form.email, form.password);
    setLoading(false);
    if (user) navigate('/admin/dashboard');
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const user = await signInWithGoogle();
    setGoogleLoading(false);
    if (user) navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grid-bg"
         style={{ background: '#050505' }}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? '#00D4FF' : '#7C3AED',
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 md:p-10"
             style={{ boxShadow: '0 30px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 rounded-full flex items-center justify-center font-orbitron font-black text-2xl mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}
            >
              M
            </motion.div>
            <h1 className="font-orbitron font-bold text-white text-2xl mb-1">Admin Portal</h1>
            <p className="font-inter text-white/30 text-sm">Mohamed Hazem Portfolio</p>
          </div>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-inter font-semibold text-sm mb-6 transition-all duration-200 disabled:opacity-60"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
          >
            {googleLoading ? (
              <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
            ) : (
              <><FcGoogle size={20} /> Continue with Google</>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="font-inter text-white/20 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@email.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              ) : 'Sign In to Dashboard'}
            </motion.button>
          </form>

          <p className="font-inter text-white/20 text-xs text-center mt-6">
            Access restricted to authorized administrators only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
