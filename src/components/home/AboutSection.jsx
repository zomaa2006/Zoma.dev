import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMapPin, FiCode, FiAward } from 'react-icons/fi';
import SectionTitle from '../ui/SectionTitle';
import DNAHelix from '../three/DNAHelix';
import { PERSONAL } from '../../utils/constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function AboutSection() {
  const [cvUrl, setCvUrl] = useState('');
  const [profile, setProfile] = useState({
    bio: PERSONAL.bio,
    tagline: PERSONAL.tagline,
    role: PERSONAL.role,
    name: PERSONAL.name,
    age: String(PERSONAL.age),
    location: PERSONAL.location,
    email: PERSONAL.email,
    whatsapp: PERSONAL.whatsapp,
  });

  // Load CV URL and profile data from Firestore
  useEffect(() => {
    getDoc(doc(db, 'settings', 'cv')).then(d => {
      if (d.exists()) setCvUrl(d.data().url || '');
    }).catch(() => {});

    getDoc(doc(db, 'settings', 'profile')).then(d => {
      if (d.exists()) {
        const data = d.data();
        setProfile(prev => ({ ...prev, ...data }));
      }
    }).catch(() => {});
  }, []);

  const traits = [
    { icon: FiUser, label: 'Age', value: `${profile.age} Years Old` },
    { icon: FiMapPin, label: 'Location', value: profile.location },
    { icon: FiCode, label: 'Role', value: profile.role },
    { icon: FiAward, label: 'Status', value: 'Open to Opportunities' },
  ];

  const handleDownload = () => {
    if (!cvUrl) {
      alert('CV not uploaded yet. Please check back soon!');
      return;
    }
    // Force download: open Cloudinary URL with fl_attachment flag
    const downloadUrl = cvUrl.includes('cloudinary.com')
      ? cvUrl.replace('/upload/', '/upload/fl_attachment/')
      : cvUrl;
    window.open(downloadUrl, '_blank');
  };

  return (
    <section className="section-padding relative overflow-hidden" id="about">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #7C3AED, transparent)', transform: 'translate(30%, -50%)' }} />

      <div className="container-max">
        <SectionTitle
          subtitle="Get to know me"
          title="About"
          highlight="Me"
          description="A passionate developer from Egypt, building the future one commit at a time."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* DNA Helix */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <DNAHelix />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="grid grid-cols-2 gap-3 mb-8">
              {traits.map(({ icon: Icon, label, value }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(0,212,255,0.3)' }}
                  className="glass rounded-xl p-4 transition-all duration-200"
                >
                  <Icon size={16} className="text-primary mb-2" />
                  <div className="font-inter text-white/30 text-xs mb-1">{label}</div>
                  <div className="font-inter text-white text-sm font-medium">{value}</div>
                </motion.div>
              ))}
            </div>

            <p className="font-inter text-white/50 text-base leading-relaxed mb-6">
              {profile.bio}
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleDownload}
                className="btn-primary text-xs px-6 py-2.5"
              >
                📄 Download CV
              </button>
              <a
                href="/contact"
                className="btn-outline text-xs px-6 py-2.5"
              >
                📧 Email Me
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
