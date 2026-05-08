import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiGithub, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../services/firebase';
import { useProjects } from '../../context/ProjectsContext';
import ProjectFormModal from '../../components/admin/ProjectFormModal';

export default function AdminProjects() {
  const { projects } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filter, setFilter] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'projects', deleteConfirm));
      toast.success('Project deleted.');
    } catch {
      toast.error('Failed to delete project.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSave = async (projectData) => {
    try {
      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
        toast.success('Project updated!');
      } else {
        await addDoc(collection(db, 'projects'), { ...projectData, order: projects.length + 1 });
        toast.success('Project added!');
      }
      setShowForm(false);
      setEditingProject(null);
    } catch {
      toast.error('Failed to save project.');
    }
  };

  const handleImport = async () => {
    const starterProjects = [
      {
        title: 'Gym Shop', slug: 'gym-shop', category: 'E-Commerce', order: 1, featured: true, status: 'Completed',
        shortDescription: 'Full-featured e-commerce platform for gym equipment with cart, checkout, and admin panel.',
        longDescription: 'A production-ready gym equipment e-commerce store built with React, Node.js, and MongoDB. Features include product catalog with filtering, shopping cart, secure checkout, order management, user authentication, and a full admin dashboard.',
        techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Stripe'],
        features: ['Product catalog with search & filter', 'Shopping cart & wishlist', 'Secure JWT authentication', 'Admin dashboard', 'Order management system'],
        liveUrl: 'https://yourlink.com', githubUrl: 'https://github.com/zomaa2006',
        timeline: { start: '2024-01', end: '2024-03' },
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        screenshots: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80'],
      },
      {
        title: 'Flower Shop', slug: 'flower-shop', category: 'E-Commerce', order: 2, featured: true, status: 'Completed',
        shortDescription: 'Beautiful flower e-commerce with real-time Firebase backend and custom bouquet builder.',
        longDescription: 'An elegant flower shop e-commerce platform powered by React and Firebase. Users can browse seasonal collections, build custom bouquets, and schedule deliveries. Uses Firestore for real-time data and Firebase Storage for images.',
        techStack: ['React', 'Firebase', 'Firestore', 'Firebase Auth', 'Firebase Storage'],
        features: ['Custom bouquet builder', 'Real-time order tracking', 'Seasonal collections', 'Delivery scheduling', 'Firebase real-time sync'],
        liveUrl: 'https://lovely-flower-mj1n85zvi-zomas-projects-72709388.vercel.app', githubUrl: 'https://github.com/zomaa2006',
        timeline: { start: '2024-04', end: '2024-06' },
        thumbnail: 'https://images.unsplash.com/photo-1487530811015-780a7ae27e49?w=800&q=80',
        screenshots: ['https://images.unsplash.com/photo-1487530811015-780a7ae27e49?w=1200&q=80','https://images.unsplash.com/photo-1490750967868-88df5691cc21?w=1200&q=80'],
      },
      {
        title: 'College Enrollment System', slug: 'college-enrollment', category: 'Educational', order: 3, featured: true, status: 'Completed',
        shortDescription: 'Full educational platform for managing student enrollment, courses, and grades.',
        longDescription: 'A comprehensive college enrollment management system with student registration, course enrollment, grade management, attendance tracking, and role-based access control for students, faculty, and administrators.',
        techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Socket.io'],
        features: ['Student registration & enrollment', 'Course management', 'Grade tracking system', 'Attendance management', 'Role-based access (Admin/Faculty/Student)'],
        liveUrl: 'https://yourlink.com', githubUrl: 'https://github.com/zomaa2006',
        timeline: { start: '2024-07', end: '2024-10' },
        thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
        screenshots: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80','https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80'],
      },
      {
        title: 'Airline Management System', slug: 'airline-management', category: 'System', order: 4, featured: false, status: 'Completed',
        shortDescription: 'Enterprise-grade airline booking and management system with real-time seat maps.',
        longDescription: 'A sophisticated airline management platform handling flight scheduling, ticket booking, seat selection, and passenger management. Features an interactive seat map, dynamic pricing engine, and a comprehensive admin panel.',
        techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Chart.js'],
        features: ['Interactive seat map', 'Dynamic pricing engine', 'Flight scheduling system', 'Ticket booking & management', 'Revenue analytics dashboard'],
        liveUrl: 'https://yourlink.com', githubUrl: 'https://github.com/zomaa2006',
        timeline: { start: '2024-11', end: '2025-01' },
        thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
        screenshots: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80','https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80'],
      },
      {
        title: 'Portfolio Website v1', slug: 'portfolio-v1', category: 'Portfolio', order: 5, featured: false, status: 'Completed',
        shortDescription: 'First-generation portfolio website built with React and smooth scroll animations.',
        longDescription: 'My first portfolio website built with React featuring smooth scroll animations, a responsive design, and a clean minimalist aesthetic. Includes project showcases, skill visualizations, and a contact form.',
        techStack: ['React', 'CSS3', 'GSAP'],
        features: ['Smooth scroll animations', 'Responsive design', 'Project showcase', 'Skills visualization', 'Dark mode'],
        liveUrl: 'https://yourlink.com', githubUrl: 'https://github.com/zomaa2006',
        timeline: { start: '2023-09', end: '2023-11' },
        thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
        screenshots: ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80'],
      },
      {
        title: 'Portfolio Website v2', slug: 'portfolio-v2', category: 'Portfolio', order: 6, featured: false, status: 'Completed',
        shortDescription: 'Second-gen portfolio with Firebase CMS, 3D elements, and admin dashboard.',
        longDescription: 'An upgraded portfolio with Firebase as the backend CMS, enabling dynamic content management. This version features 3D visual elements with Three.js, sophisticated animations with Framer Motion, and a full admin dashboard.',
        techStack: ['React', 'Firebase', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
        features: ['3D visual elements', 'Dynamic content management', 'Admin dashboard', 'Enhanced animations', 'SEO optimization'],
        liveUrl: 'https://yourlink.com', githubUrl: 'https://github.com/zomaa2006',
        timeline: { start: '2025-01', end: '2025-05' },
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        screenshots: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'],
      },
    ];

    const toastId = toast.loading('Importing 6 projects...');
    try {
      for (const project of starterProjects) {
        await addDoc(collection(db, 'projects'), project);
      }
      toast.success('All 6 projects imported! 🚀', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Import failed. Check Firestore rules.', { id: toastId });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-orbitron font-black text-2xl text-white mb-1">
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="font-inter text-white/30 text-sm">{projects.length} projects total</p>
          </div>
          <div className="flex gap-3">
            {projects.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImport}
                className="btn-outline flex items-center gap-2 text-xs"
              >
                Import Starter Data
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditingProject(null); setShowForm(true); }}
              className="btn-primary flex items-center gap-2 text-xs"
            >
              <FiPlus size={16} />
              Add Project
            </motion.button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full font-orbitron text-xs font-semibold tracking-wider transition-all duration-200 ${
                filter === cat ? 'text-bg' : 'glass text-white/40 hover:text-white'
              }`}
              style={filter === cat ? { background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {project.featured && (
                  <div className="absolute top-2 left-2 bg-accent text-black text-xs font-bold px-2 py-0.5 rounded font-orbitron">
                    ⭐ Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 category-badge">{project.category}</div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-orbitron font-bold text-white text-sm mb-1">{project.title}</h3>
                <p className="font-inter text-white/40 text-xs leading-relaxed mb-3 line-clamp-2">{project.shortDescription}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack.slice(0, 3).map(t => (
                    <span key={t} className="tech-tag text-xs">{t}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    onClick={() => handleEdit(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-inter text-xs font-medium transition-all"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}
                  >
                    <FiEdit2 size={12} /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-inter text-xs font-medium transition-all"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}
                  >
                    <FiTrash2 size={12} /> Delete
                  </motion.button>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                     className="w-8 h-8 flex items-center justify-center rounded-lg glass text-white/40 hover:text-primary transition-colors">
                    <FiExternalLink size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProjectFormModal
            project={editingProject}
            onSave={handleFormSave}
            onClose={() => { setShowForm(false); setEditingProject(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-strong rounded-2xl p-8 max-w-sm w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-orbitron font-bold text-white text-lg mb-2">Delete Project?</h3>
              <p className="font-inter text-white/50 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl font-inter text-sm font-semibold"
                        style={{ background: '#EF4444', color: 'white' }}>
                  Delete
                </button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl glass font-inter text-sm text-white/60">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
