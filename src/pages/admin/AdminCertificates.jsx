import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiUpload, FiX, FiAward } from 'react-icons/fi';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../services/firebase';
import { uploadToCloudinary } from '../../services/cloudinary';
import { useCertificates } from '../../context/CertificatesContext';

// ── Issuer logos / colors ────────────────────────────────────────────────────
export const ISSUERS = [
  { name: 'LinkedIn Learning', color: '#0A66C2', bg: '#0A66C215',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/200px-LinkedIn_Logo.svg.png' },
  { name: 'Google',            color: '#4285F4', bg: '#4285F415',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png' },
  { name: 'Coursera',          color: '#0056D2', bg: '#0056D215',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/200px-Coursera-Logo_600x600.svg.png' },
  { name: 'Udemy',             color: '#A435F0', bg: '#A435F015',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/200px-Udemy_logo.svg.png' },
  { name: 'Microsoft',         color: '#00A4EF', bg: '#00A4EF15',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png' },
  { name: 'Meta',              color: '#0081FB', bg: '#0081FB15',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png' },
  { name: 'AWS',               color: '#FF9900', bg: '#FF990015',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/200px-Amazon_Web_Services_Logo.svg.png' },
  { name: 'FreeCodeCamp',      color: '#0A0A23', bg: '#0A0A2315',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/FreeCodeCamp_logo.png' },
  { name: 'Other',             color: '#7C3AED', bg: '#7C3AED15', logo: null },
];

const CERT_ICONS = [
  { emoji: '🏆', label: 'Trophy' },
  { emoji: '🎓', label: 'Degree' },
  { emoji: '📜', label: 'Certificate' },
  { emoji: '🔐', label: 'Security' },
  { emoji: '🐳', label: 'Docker' },
  { emoji: '⚙️', label: 'DevOps' },
  { emoji: '⚛️', label: 'React' },
  { emoji: '🟩', label: 'Node.js' },
  { emoji: '🟨', label: 'JavaScript' },
  { emoji: '🔷', label: 'TypeScript' },
  { emoji: '🔬', label: 'Science' },
  { emoji: '🧠', label: 'AI/ML' },
  { emoji: '☁️', label: 'Cloud' },
  { emoji: '🌐', label: 'Web' },
  { emoji: '🛡️', label: 'Cyber' },
];

const EMPTY = {
  title: '', issuerName: 'LinkedIn Learning', date: '', skills: '',
  fileUrl: '', fileType: 'image', icon: '🏆',
};

function CertFormModal({ cert, onSave, onClose }) {
  const [form, setForm] = useState(cert ? {
    ...cert, skills: (cert.skills || []).join(', '),
  } : { ...EMPTY });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const issuer = ISSUERS.find(i => i.name === form.issuerName) || ISSUERS[8];

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    const isPdf = file.type === 'application/pdf';
    try {
      // All files → Cloudinary (PDFs as 'raw', images as 'image')
      const url = await uploadToCloudinary(file, { folder: 'certificates', onProgress: (pct) => setUploadProgress(pct) });
      setForm(f => ({ ...f, fileUrl: url, fileType: isPdf ? 'pdf' : 'image' }));
      toast.success(`${isPdf ? 'PDF' : 'Image'} uploaded! ✅`);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.issuerName || !form.date) {
      toast.error('Title, Issuer, and Date are required.');
      return;
    }
    await onSave({
      ...form,
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        className="glass-strong rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron font-bold text-white text-lg">
            {cert ? 'Edit' : 'Add'} <span className="gradient-text">Certificate</span>
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-1.5 block">Certificate Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Learning Docker" className="input-field" required />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-2 block">
              Icon &nbsp;<span className="text-white/60 text-lg">{form.icon}</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CERT_ICONS.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  type="button"
                  title={label}
                  onClick={() => setForm(f => ({ ...f, icon: emoji }))}
                  className={`p-2.5 rounded-xl border text-2xl transition-all flex flex-col items-center gap-1 ${
                    form.icon === emoji
                      ? 'border-primary bg-primary/10 scale-110'
                      : 'border-white/10 glass hover:border-white/30 hover:scale-105'
                  }`}
                >
                  {emoji}
                  <span className="font-inter text-[8px] text-white/30 leading-none">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Issuer Logo Picker */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-2 block">Issuer / Platform *</label>
            <div className="grid grid-cols-3 gap-2">
              {ISSUERS.map(issuerOpt => (
                <button
                  key={issuerOpt.name}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, issuerName: issuerOpt.name }))}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${
                    form.issuerName === issuerOpt.name
                      ? 'border-primary bg-primary/10'
                      : 'border-white/10 glass hover:border-white/20'
                  }`}
                >
                  {issuerOpt.logo ? (
                    <img src={issuerOpt.logo} alt={issuerOpt.name}
                      className="h-5 object-contain"
                      onError={e => { e.target.style.display='none'; }}
                    />
                  ) : (
                    <FiAward size={18} color={issuerOpt.color} />
                  )}
                  <span className="font-inter text-[9px] text-white/50 text-center leading-tight">{issuerOpt.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-1.5 block">Date Issued *</label>
            <input name="date" value={form.date} onChange={handleChange}
              placeholder="e.g. May 2026" className="input-field" required />
          </div>

          {/* Skills */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-1.5 block">Skills (comma-separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange}
              placeholder="e.g. Docker, DevOps, Containers" className="input-field" />
          </div>

          {/* Upload Certificate (PDF or Image) */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-2 block">Certificate File (PDF or Screenshot)</label>
            {form.fileUrl && (
              <div className="mb-3 p-3 rounded-xl glass flex items-center gap-3">
                <span className="text-xs font-inter text-white/60 flex-1 truncate">
                  {form.fileType === 'pdf' ? '📄 PDF uploaded' : '🖼️ Image uploaded'}
                </span>
                <a href={form.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="text-primary text-xs hover:underline">Preview</a>
                <button type="button" onClick={() => setForm(f => ({ ...f, fileUrl: '' }))}
                  className="text-red-400 hover:text-red-300">
                  <FiX size={14} />
                </button>
              </div>
            )}
            <label className={`flex items-center gap-3 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              uploading ? 'border-primary/40 bg-primary/5' : 'border-white/20 hover:border-primary/50'
            }`}>
              <FiUpload size={16} className="text-white/40" />
              <span className="font-inter text-xs text-white/40 flex-1">
                {uploading ? `Uploading... ${uploadProgress}%` : 'Click to upload PDF or screenshot'}
              </span>
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            {/* Progress bar */}
            {uploading && (
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #00D4FF, #7C3AED)' }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            )}
            <p className="font-inter text-white/20 text-xs mt-1">Or paste a URL directly:</p>
            <input name="fileUrl" value={form.fileUrl} onChange={handleChange}
              placeholder="https://..." className="input-field mt-1" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl glass font-inter text-sm text-white/50 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl font-orbitron text-sm font-bold text-black"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' }}>
              {cert ? 'Update' : 'Add'} Certificate
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCertificates() {
  const { certificates } = useCertificates();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateDoc(doc(db, 'certificates', editing.id), data);
        toast.success('Certificate updated!');
      } else {
        await addDoc(collection(db, 'certificates'), { ...data, createdAt: serverTimestamp() });
        toast.success('Certificate added!');
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      toast.error('Failed to save.');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'certificates', deleteConfirm));
      toast.success('Deleted.');
    } catch {
      toast.error('Failed to delete.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleImportStarter = async () => {
    const starters = [
      { title: 'Learning Docker', issuerName: 'LinkedIn Learning', date: 'May 2026', icon: '🐳',
        skills: ['Docker', 'Containers', 'DevOps'], fileUrl: '', fileType: 'image' },
      { title: 'Practical GitHub Actions', issuerName: 'LinkedIn Learning', date: 'Apr 2026', icon: '⚙️',
        skills: ['CI/CD', 'GitHub Actions', 'Automation'], fileUrl: '', fileType: 'image' },
      { title: 'Microsoft Security Essentials', issuerName: 'Microsoft', date: 'Apr 2026', icon: '🛡️',
        skills: ['Cybersecurity', 'Microsoft', 'Security'], fileUrl: '', fileType: 'image' },
    ];
    setImporting(true);
    try {
      for (const c of starters) {
        await addDoc(collection(db, 'certificates'), { ...c, createdAt: serverTimestamp() });
      }
      toast.success('Starter certificates imported!');
    } catch {
      toast.error('Import failed.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-orbitron font-black text-2xl text-white mb-1">
              My <span className="gradient-text">Certificates</span>
            </h1>
            <p className="font-inter text-white/30 text-sm">{certificates.length} certificates total</p>
          </div>
          <div className="flex gap-3">
            {certificates.length === 0 && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleImportStarter} disabled={importing}
                className="btn-outline text-xs flex items-center gap-2">
                {importing ? 'Importing...' : 'Import Starter Data'}
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="btn-primary text-xs flex items-center gap-2">
              <FiPlus size={16} /> Add Certificate
            </motion.button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {certificates.map((cert, i) => {
            const issuerData = ISSUERS.find(is => is.name === cert.issuerName) || ISSUERS[8];
            return (
              <motion.div key={cert.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 flex flex-col gap-3">
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{ background: issuerData.bg, border: `2px solid ${issuerData.color}40`,
                             boxShadow: `0 0 12px ${issuerData.color}15` }}>
                    {cert.icon || '🏆'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-orbitron font-bold text-white text-sm leading-tight mb-0.5 line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="font-inter text-white/40 text-xs">{cert.issuerName} · {cert.date}</p>
                  </div>
                </div>

                {/* Skills */}
                {cert.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map(s => (
                      <span key={s} className="tech-tag text-xs">{s}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto">
                  {cert.fileUrl && (
                    <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-inter text-xs font-medium transition-all"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }}>
                      <FiExternalLink size={12} />
                      {cert.fileType === 'pdf' ? 'Open PDF' : 'View'}
                    </a>
                  )}
                  <motion.button whileHover={{ scale: 1.08 }}
                    onClick={() => { setEditing(cert); setShowForm(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-inter text-xs font-medium"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}>
                    <FiEdit2 size={12} /> Edit
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.08 }}
                    onClick={() => setDeleteConfirm(cert.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                    <FiTrash2 size={12} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CertFormModal
            cert={editing}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-strong rounded-2xl p-8 max-w-sm w-full mx-4"
              onClick={e => e.stopPropagation()}>
              <h3 className="font-orbitron font-bold text-white text-lg mb-2">Delete Certificate?</h3>
              <p className="font-inter text-white/50 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl font-inter text-sm font-semibold"
                  style={{ background: '#EF4444', color: 'white' }}>Delete</button>
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl glass font-inter text-sm text-white/60">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
