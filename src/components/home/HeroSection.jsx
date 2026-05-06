import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { FiArrowDown, FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HeroScene from '../three/HeroScene';
import { PERSONAL, SOCIAL } from '../../utils/constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const TYPEWRITER_ROLES = [
  'Full Stack Developer',
  'React Specialist',
  'Firebase Expert',
  'UI/UX Enthusiast',
  'Open Source Builder',
];

function TypewriterText() {
  const el = useRef(null);
  const roleIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    let timeout;
    function tick() {
      const role = TYPEWRITER_ROLES[roleIndex.current];
      if (!el.current) return;

      if (!deleting.current) {
        el.current.textContent = role.slice(0, charIndex.current + 1);
        charIndex.current++;
        if (charIndex.current === role.length) {
          deleting.current = true;
          timeout = setTimeout(tick, 1800);
          return;
        }
      } else {
        el.current.textContent = role.slice(0, charIndex.current - 1);
        charIndex.current--;
        if (charIndex.current === 0) {
          deleting.current = false;
          roleIndex.current = (roleIndex.current + 1) % TYPEWRITER_ROLES.length;
          timeout = setTimeout(tick, 400);
          return;
        }
      }
      timeout = setTimeout(tick, deleting.current ? 50 : 80);
    }
    tick();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <span ref={el} className="gradient-text" />
  );
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const [tagline, setTagline] = useState(PERSONAL.tagline);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'profile')).then(d => {
      if (d.exists() && d.data().tagline) setTagline(d.data().tagline);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 80, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.3
      });
      gsap.from(subtitleRef.current, {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.7
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
      id="hero"
    >
      {/* 3D Scene — behind everything */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 hero-gradient pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 container-max px-6 text-center pointer-events-none"
      >
        {/* Interactive elements inside get pointer-events back */}
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-inter text-xs text-white/60 tracking-wider">Available for Freelance</span>
        </motion.div>

        {/* Name */}
        <div ref={titleRef}>
          <h1 className="font-orbitron font-black text-5xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight">
            MOHAMED{' '}
            <span className="gradient-text">HAZEM</span>
          </h1>
        </div>

        {/* Typewriter Role */}
        <div ref={subtitleRef} className="font-orbitron text-xl md:text-2xl text-white/40 mb-6 h-8 flex items-center justify-center gap-2">
          <TypewriterText />
          <span className="inline-block w-0.5 h-6 bg-primary animate-pulse ml-1" />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="font-inter text-white/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          {tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12 pointer-events-auto"
        >
          <Link to="/projects" className="btn-primary">
            View My Work
          </Link>
          <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline">
            Let's Talk
          </a>
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex items-center justify-center gap-5 pointer-events-auto"
        >
          {[
            { icon: FiGithub, href: SOCIAL.github, label: 'GitHub' },
            { icon: FiLinkedin, href: SOCIAL.linkedin, label: 'LinkedIn' },
            { icon: FaWhatsapp, href: SOCIAL.whatsapp, label: 'WhatsApp' },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ y: -4, scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/40 hover:text-primary transition-colors"
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex flex-wrap justify-center gap-12 mt-16"
        >
          {[
            { value: '6+', label: 'Projects Built' },
            { value: '19', label: 'Years Old' },
            { value: '1+', label: 'Years Experience' },
            { value: '∞', label: 'Coffee Consumed' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-orbitron font-black text-3xl gradient-text">{value}</div>
              <div className="font-inter text-white/30 text-xs tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-orbitron text-xs tracking-widest text-white/20 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FiArrowDown size={16} className="text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
