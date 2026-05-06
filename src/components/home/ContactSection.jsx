import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import SectionTitle from '../ui/SectionTitle';
import GlobeScene from '../three/GlobeScene';
import { db } from '../../services/firebase';
import { PERSONAL, SOCIAL } from '../../utils/constants';

// ─── Web3Forms — 100% FREE, no credit card, unlimited emails ─────────────────
// 1. Go to https://web3forms.com
// 2. Enter your email (kliyg00000@gmail.com) → click "Create Access Key"
// 3. Check your email → copy the access key
// 4. Paste it below replacing YOUR_ACCESS_KEY
const WEB3FORMS_KEY = 'b086dff6-3947-44bf-8116-cd981436e810';
// ─────────────────────────────────────────────────────────────────────────────

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState({
    email: PERSONAL.email,
    whatsapp: PERSONAL.whatsapp,
    location: PERSONAL.location,
  });

  useEffect(() => {
    getDoc(doc(db, 'settings', 'profile')).then(d => {
      if (d.exists()) {
        const data = d.data();
        setProfile(prev => ({ ...prev, ...data }));
      }
    }).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSending(true);

    try {
      // ① Save to Firestore → visible in Admin Dashboard → Messages
      await addDoc(collection(db, 'messages'), {
        ...form,
        read: false,
        createdAt: serverTimestamp(),
      });

      // ② Send real email via Web3Forms (completely free)
      if (WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY') {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name: form.name,
            email: form.email,
            subject: form.subject || `Portfolio contact from ${form.name}`,
            message: form.message,
            from_name: 'Portfolio Contact Form',
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
      }

      toast.success("Message sent! I'll reply within 24 hours 🚀");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      // Still saved to Firestore, so don't show hard error
      toast.success('Message saved! Check your admin dashboard.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section-padding relative overflow-hidden" id="contact">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent)' }}
      />

      <div className="container-max">
        <SectionTitle
          subtitle="Let's build together"
          title="Get In"
          highlight="Touch"
          description="Available for freelance projects and full-time opportunities. Let's create something amazing."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlobeScene />
            <div className="mt-6 space-y-3">
              {[
                { icon: FiMail,     label: profile.email,    href: `mailto:${profile.email}`, color: '#00D4FF', newTab: false },
                { icon: FaWhatsapp, label: profile.whatsapp, href: `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`, color: '#25D366', newTab: true  },
                { icon: FiMapPin,   label: profile.location, href: '#',             color: '#F59E0B', newTab: false },
              ].map(({ icon: Icon, label, href, color, newTab }) => (
                <a
                  key={label}
                  href={href}
                  target={newTab ? '_blank' : '_self'}
                  rel={newTab ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 glass rounded-xl p-3 hover:scale-[1.02] transition-transform group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: color + '15', border: `1px solid ${color}30` }}
                  >
                    <Icon size={16} color={color} />
                  </div>
                  <span className="font-inter text-white/50 text-sm group-hover:text-white transition-colors">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-xs text-white/40 mb-1.5 block">Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="font-inter text-xs text-white/40 mb-1.5 block">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-inter text-xs text-white/40 mb-1.5 block">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project Inquiry"
                  className="input-field"
                />
              </div>

              <div>
                <label className="font-inter text-xs text-white/40 mb-1.5 block">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="input-field resize-none"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full flex items-center justify-center gap-3 py-3.5 disabled:opacity-60"
              >
                {sending ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <><FiSend size={16} /> Send Message</>
                )}
              </motion.button>


            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
