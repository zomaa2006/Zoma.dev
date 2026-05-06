import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SOCIAL, PERSONAL } from '../../utils/constants';

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
  { label: 'Admin', to: '/admin/login' },
];

const socials = [
  { icon: FiGithub, href: SOCIAL.github, label: 'GitHub', color: '#fff' },
  { icon: FiLinkedin, href: SOCIAL.linkedin, label: 'LinkedIn', color: '#0A66C2' },
  { icon: FaWhatsapp, href: SOCIAL.whatsapp, label: 'WhatsApp', color: '#25D366' },
  { icon: FiMail, href: SOCIAL.email, label: 'Email', color: '#00D4FF' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/5">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="container-max section-padding py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-black text-base"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}
              >
                M
              </div>
              <span className="font-orbitron font-bold text-base tracking-widest gradient-text">HAZEM.DEV</span>
            </Link>
            <p className="font-inter text-white/40 text-sm leading-relaxed max-w-xs">
              Full Stack Developer from Egypt crafting cinematic digital experiences.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.background = color + '15'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={16} color={color} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-orbitron font-semibold text-white text-sm tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-inter text-white/40 text-sm hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-orbitron font-semibold text-white text-sm tracking-wider mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <a href={SOCIAL.email} className="flex items-center gap-3 group">
                <FiMail size={14} className="text-primary flex-shrink-0" />
                <span className="font-inter text-white/40 text-sm group-hover:text-primary transition-colors">
                  {PERSONAL.email}
                </span>
              </a>
              <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <FaWhatsapp size={14} className="text-success flex-shrink-0" />
                <span className="font-inter text-white/40 text-sm group-hover:text-success transition-colors">
                  {PERSONAL.whatsapp}
                </span>
              </a>
              <div className="flex items-center gap-3">
                <span className="text-accent text-sm">📍</span>
                <span className="font-inter text-white/40 text-sm">{PERSONAL.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5 mb-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-inter text-white/25 text-xs">
            © {year} {PERSONAL.name}. All rights reserved.
          </p>
          <p className="font-orbitron text-white/15 text-xs tracking-widest">
            FULL STACK DEVELOPER
          </p>
        </div>
      </div>
    </footer>
  );
}
