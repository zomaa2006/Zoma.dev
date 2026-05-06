import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FiUpload, FiDownload, FiTrash2, FiCheck, FiFileText, FiEdit3, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { uploadToCloudinary } from '../../services/cloudinary';
import { PERSONAL, SOCIAL } from '../../utils/constants';

// ── Reusable Upload with Progress ────────────────────────────────────────────
function UploadZone({ accept, folder, label, hint, onSuccess, currentUrl, onClear }) {
  const [progress, setProgress] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      // All files (PDFs + images) → Cloudinary
      // PDFs use 'raw' resource type, images use 'image'
      const url = await uploadToCloudinary(file, { folder, onProgress: (pct) => setProgress(pct) });
      onSuccess(url);
      toast.success('Uploaded successfully! ✅');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Current file */}
      {currentUrl && (
        <div className="flex items-center gap-3 p-3 rounded-xl glass border border-white/10">
          <FiCheck size={14} className="text-green-400 flex-shrink-0" />
          <span className="font-inter text-xs text-white/60 flex-1 truncate">File uploaded</span>
          <a href={currentUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary text-xs hover:underline">
            <FiDownload size={12} /> Open
          </a>
          <button onClick={onClear}
            className="text-red-400 hover:text-red-300 transition-colors">
            <FiTrash2 size={13} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <label className={`flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
        uploading
          ? 'border-primary/60 bg-primary/5'
          : 'border-white/15 hover:border-primary/40 hover:bg-white/5'
      }`}>
        <FiUpload size={24} className="text-white/40" />
        <div className="text-center">
          <p className="font-inter text-sm text-white/60">{label}</p>
          <p className="font-inter text-xs text-white/25 mt-1">{hint}</p>
        </div>
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={e => handleFile(e.target.files[0])}
        />
      </label>

      {/* Progress bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="font-inter text-xs text-white/40">Uploading...</span>
            <span className="font-inter text-xs text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00D4FF, #7C3AED)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSettings() {
  const { user } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.displayName || PERSONAL.name);

  // CV / Resume state
  const [cvUrl, setCvUrl] = useState('');
  const [savingCv, setSavingCv] = useState(false);

  // ── Editable Descriptions ──────────────────────────────────────────────────
  const [descriptions, setDescriptions] = useState({
    bio: PERSONAL.bio,
    tagline: PERSONAL.tagline,
    role: PERSONAL.role,
    name: PERSONAL.name,
    age: String(PERSONAL.age),
    location: PERSONAL.location,
    email: PERSONAL.email,
    whatsapp: PERSONAL.whatsapp,
  });
  const [savingDesc, setSavingDesc] = useState(false);

  // Load saved data from Firestore on mount
  useEffect(() => {
    getDoc(doc(db, 'settings', 'cv')).then(d => {
      if (d.exists()) setCvUrl(d.data().url || '');
    });
    getDoc(doc(db, 'settings', 'profile')).then(d => {
      if (d.exists()) {
        const data = d.data();
        setDescriptions(prev => ({
          ...prev,
          ...data,
        }));
      }
    });
  }, []);

  const handleCvUploaded = async (url) => {
    setCvUrl(url);
    setSavingCv(true);
    try {
      await setDoc(doc(db, 'settings', 'cv'), { url, updatedAt: new Date() });
      toast.success('CV saved to database! It now appears on your portfolio.');
    } catch {
      toast.error('Could not save CV URL to database.');
    } finally {
      setSavingCv(false);
    }
  };

  const handleCvClear = async () => {
    setCvUrl('');
    await setDoc(doc(db, 'settings', 'cv'), { url: '', updatedAt: new Date() });
    toast.success('CV removed.');
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(user, { displayName: profileName });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDescChange = (key, value) => {
    setDescriptions(prev => ({ ...prev, [key]: value }));
  };

  const handleDescSave = async () => {
    setSavingDesc(true);
    try {
      await setDoc(doc(db, 'settings', 'profile'), {
        ...descriptions,
        updatedAt: new Date(),
      });
      toast.success('Portfolio descriptions updated! Changes are live now. 🚀');
    } catch {
      toast.error('Failed to save descriptions.');
    } finally {
      setSavingDesc(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-orbitron font-black text-2xl text-white mb-1">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="font-inter text-white/30 text-sm">Manage your portfolio & admin account</p>
        </motion.div>

        {/* ── Portfolio Descriptions (Editable) ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6 mb-6 border border-secondary/20"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <FiEdit3 size={16} className="text-secondary" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-white text-base">Portfolio Content</h2>
              <p className="font-inter text-white/30 text-xs">Edit texts & descriptions that appear on your portfolio</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Full Name</label>
              <input value={descriptions.name} onChange={e => handleDescChange('name', e.target.value)}
                className="input-field" placeholder="Mohamed Hazem Naguib" />
            </div>

            {/* Role */}
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Role / Title</label>
              <input value={descriptions.role} onChange={e => handleDescChange('role', e.target.value)}
                className="input-field" placeholder="Full Stack Developer" />
            </div>

            {/* Tagline */}
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Tagline (shown on homepage)</label>
              <input value={descriptions.tagline} onChange={e => handleDescChange('tagline', e.target.value)}
                className="input-field" placeholder="Crafting Digital Experiences From Egypt to the World" />
            </div>

            {/* Bio */}
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Bio / About Me Description</label>
              <textarea
                value={descriptions.bio}
                onChange={e => handleDescChange('bio', e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="Write your bio here..."
              />
              <p className="font-inter text-white/20 text-xs mt-1">{descriptions.bio.length} characters</p>
            </div>

            {/* Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-inter text-xs text-white/40 mb-1.5 block">Age</label>
                <input value={descriptions.age} onChange={e => handleDescChange('age', e.target.value)}
                  className="input-field" placeholder="19" />
              </div>
              <div>
                <label className="font-inter text-xs text-white/40 mb-1.5 block">Location</label>
                <input value={descriptions.location} onChange={e => handleDescChange('location', e.target.value)}
                  className="input-field" placeholder="Egypt 🇪🇬" />
              </div>
            </div>

            {/* Email & WhatsApp */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-inter text-xs text-white/40 mb-1.5 block">Contact Email</label>
                <input value={descriptions.email} onChange={e => handleDescChange('email', e.target.value)}
                  className="input-field" placeholder="your@email.com" />
              </div>
              <div>
                <label className="font-inter text-xs text-white/40 mb-1.5 block">WhatsApp Number</label>
                <input value={descriptions.whatsapp} onChange={e => handleDescChange('whatsapp', e.target.value)}
                  className="input-field" placeholder="+201023690364" />
              </div>
            </div>

            <motion.button
              onClick={handleDescSave}
              disabled={savingDesc}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2 disabled:opacity-60 w-full justify-center"
            >
              <FiSave size={14} />
              {savingDesc ? 'Saving...' : 'Save Portfolio Content'}
            </motion.button>
          </div>
        </motion.div>

        {/* ── CV / Resume Upload ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
              <FiFileText size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-white text-base">CV / Resume</h2>
              <p className="font-inter text-white/30 text-xs">Upload your latest CV (PDF). It appears as a download button on your portfolio.</p>
            </div>
          </div>

          <UploadZone
            accept=".pdf,application/pdf"
            folder="cv"
            label="Click to upload your CV (PDF)"
            hint="Max 20MB • PDF only"
            currentUrl={cvUrl}
            onSuccess={handleCvUploaded}
            onClear={handleCvClear}
          />

          {cvUrl && (
            <p className="font-inter text-xs text-white/20 mt-2">
              Public link: <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{cvUrl.slice(0, 60)}...</a>
            </p>
          )}
        </motion.div>

        {/* ── Profile Info ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h2 className="font-orbitron font-bold text-white text-base mb-5">Profile Information</h2>

          <div className="flex items-center gap-4 mb-6">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-orbitron font-black text-2xl"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' }}>M</div>
            )}
            <div>
              <p className="font-inter text-white font-medium">{user?.displayName || PERSONAL.name}</p>
              <p className="font-inter text-white/40 text-sm">{user?.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-inter text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Admin
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Display Name</label>
              <input value={profileName} onChange={e => setProfileName(e.target.value)}
                className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Email (read-only)</label>
              <input value={user?.email || ''} className="input-field opacity-50 cursor-not-allowed" disabled />
            </div>
            <motion.button type="submit" disabled={savingProfile}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary text-xs px-6 py-2.5 disabled:opacity-60">
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
