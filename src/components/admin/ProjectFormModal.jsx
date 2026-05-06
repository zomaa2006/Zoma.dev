import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload } from 'react-icons/fi';
import { uploadToCloudinary } from '../../services/cloudinary';
import toast from 'react-hot-toast';

const CATEGORIES = ['E-Commerce', 'Educational', 'System', 'Portfolio', 'Other'];
const STATUSES = ['Completed', 'In Progress', 'Archived'];

export default function ProjectFormModal({ project, onSave, onClose }) {
  const isEdit = !!project;
  const [form, setForm] = useState({
    title: project?.title || '',
    shortDescription: project?.shortDescription || '',
    longDescription: project?.longDescription || '',
    category: project?.category || 'E-Commerce',
    techStack: project?.techStack?.join(', ') || '',
    features: project?.features?.join('\n') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    status: project?.status || 'Completed',
    featured: project?.featured || false,
    thumbnail: project?.thumbnail || '',
    screenshots: project?.screenshots || [],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, { folder: 'projects/thumbnails' });
      setForm(f => ({ ...f, thumbnail: url }));
      toast.success('Thumbnail uploaded! ✅');
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleScreenshotsUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);
    try {
      const urls = await Promise.all(
        files.map(file => uploadToCloudinary(file, { folder: 'projects/screenshots' }))
      );
      setForm(f => ({ ...f, screenshots: [...f.screenshots, ...urls] }));
      toast.success(`${files.length} screenshot(s) uploaded! ✅`, { id: toastId });
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const removeScreenshot = (indexToRemove) => {
    setForm(f => ({
      ...f,
      screenshots: f.screenshots.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.shortDescription) {
      toast.error('Title and short description are required.');
      return;
    }
    setSaving(true);
    const projectData = {
      ...form,
      techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      slug: form.title.toLowerCase().replace(/\s+/g, '-'),
    };
    onSave(projectData);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="glass-strong rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 glass-strong rounded-t-2xl">
          <h2 className="font-orbitron font-bold text-white text-lg">
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white">
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Thumbnail */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-2 block">Thumbnail</label>
            <div className="flex gap-4 items-start">
              {form.thumbnail && (
                <img src={form.thumbnail} alt="thumb" className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="input-field flex items-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
                  <FiUpload size={14} className="text-primary" />
                  <span className="text-white/40 text-sm">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              </label>
            </div>
            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="Or paste image URL..."
              className="input-field mt-2 text-xs"
            />
          </div>

          {/* Screenshots Array */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-2 block">Screenshots (Multiple)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-3">
              {form.screenshots.map((url, i) => (
                <div key={i} className="relative aspect-video group">
                  <img src={url} alt={`Screenshot ${i+1}`} className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              
              {/* Add New Screenshot Button */}
              <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <FiUpload size={18} className="text-white/40 mb-1" />
                <span className="text-[10px] text-white/40">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleScreenshotsUpload} className="hidden" />
              </label>
            </div>
            <div className="text-xs font-inter text-white/30">Paste URLs below if not uploading:</div>
            <textarea
              value={form.screenshots.join('\n')}
              onChange={(e) => setForm(f => ({ ...f, screenshots: e.target.value.split('\n').filter(Boolean) }))}
              rows={2}
              className="input-field resize-none mt-1"
              placeholder="https://... (one per line)"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Project Name" required />
            </div>
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-1.5 block">Short Description *</label>
            <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="input-field" placeholder="One-line summary..." required />
          </div>

          {/* Long Description */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-1.5 block">Full Description</label>
            <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Detailed project description..." />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-1.5 block">Tech Stack (comma-separated)</label>
            <input name="techStack" value={form.techStack} onChange={handleChange} className="input-field" placeholder="React, Node.js, Firebase..." />
          </div>

          {/* Features */}
          <div>
            <label className="font-inter text-xs text-white/40 mb-1.5 block">Features (one per line)</label>
            <textarea name="features" value={form.features} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="User authentication&#10;Real-time sync&#10;Admin dashboard" />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Live URL</label>
              <input name="liveUrl" value={form.liveUrl} onChange={handleChange} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">GitHub URL</label>
              <input name="githubUrl" value={form.githubUrl} onChange={handleChange} className="input-field" placeholder="https://github.com/..." />
            </div>
          </div>

          {/* Status + Featured */}
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="font-inter text-xs text-white/40 mb-1.5 block">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="hidden" />
              <div className={`w-10 h-5 rounded-full transition-all ${form.featured ? 'bg-primary' : 'bg-white/10'} relative`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.featured ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="font-inter text-white/60 text-sm">Featured Project</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Project' : 'Add Project'}
            </motion.button>
            <button type="button" onClick={onClose} className="btn-ghost glass rounded-xl px-6">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
