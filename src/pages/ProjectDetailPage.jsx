import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiGithub, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import Lightbox from '../components/projects/Lightbox';
import ProjectCard from '../components/projects/ProjectCard';
import { useProjects } from '../context/ProjectsContext';

export default function ProjectDetailPage() {
  const { projects } = useProjects();
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
        <div className="text-6xl">🚀</div>
        <h1 className="font-orbitron text-2xl text-white">Project Not Found</h1>
        <button onClick={() => navigate('/projects')} className="btn-outline">← Back to Projects</button>
      </div>
    );
  }

  const related = projects.filter((p) => p.id !== id && p.category === project.category).slice(0, 3);
  const allRelated = related.length > 0 ? related : projects.filter((p) => p.id !== id).slice(0, 3);

  return (
    <main className="pt-20 min-h-screen noise">
      {/* Hero Image */}
      <div className="relative h-80 md:h-[450px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0) 40%, rgba(5,5,5,1) 100%)' }} />
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 glass px-4 py-2 rounded-xl font-inter text-sm text-white/70 hover:text-white transition-colors"
        >
          <FiArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="container-max px-6 md:px-12 lg:px-20 pb-24">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 -mt-12 relative z-10 mb-10">
          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="category-badge">{project.category}</span>
              <span className="px-3 py-1 rounded-full text-xs font-orbitron font-semibold uppercase tracking-wider glass"
                    style={{ color: project.status === 'Completed' ? '#10B981' : '#F59E0B' }}>
                {project.status}
              </span>
            </div>
            <h1 className="font-orbitron font-black text-4xl md:text-5xl text-white">{project.title}</h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 text-xs px-5 py-2.5">
              <FiExternalLink size={14} /> Live Demo
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-2 text-xs px-5 py-2.5">
              <FiGithub size={14} /> GitHub
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="font-orbitron font-bold text-white text-lg mb-4">About This Project</h2>
              <p className="font-inter text-white/60 leading-relaxed">{project.longDescription}</p>
            </motion.div>

            {/* Screenshot Gallery */}
            {project.screenshots?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="font-orbitron font-bold text-white text-lg mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.screenshots.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setLightboxIndex(i)}
                      className="aspect-video rounded-xl overflow-hidden cursor-pointer relative group"
                    >
                      <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 font-orbitron text-xs text-white glass px-3 py-1 rounded-full transition-opacity">
                          View
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="font-orbitron font-bold text-white text-lg mb-4">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FiCheckCircle size={16} className="text-success flex-shrink-0" />
                    <span className="font-inter text-white/60 text-sm">{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-orbitron font-bold text-white text-sm mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="tech-tag"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-orbitron font-bold text-white text-sm mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiCalendar size={14} className="text-primary" />
                  <div>
                    <div className="font-inter text-white/30 text-xs">Started</div>
                    <div className="font-inter text-white text-sm">{project.timeline.start}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar size={14} className="text-success" />
                  <div>
                    <div className="font-inter text-white/30 text-xs">Completed</div>
                    <div className="font-inter text-white text-sm">{project.timeline.end}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass rounded-2xl p-6 space-y-3"
            >
              <h3 className="font-orbitron font-bold text-white text-sm mb-4">Links</h3>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                <FiExternalLink size={16} className="text-primary" />
                <span className="font-inter text-white/60 group-hover:text-white text-sm transition-colors">Live Website</span>
              </a>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <FiGithub size={16} className="text-white/40" />
                <span className="font-inter text-white/60 group-hover:text-white text-sm transition-colors">Source Code</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Related Projects */}
        {allRelated.length > 0 && (
          <div className="mt-20">
            <h2 className="font-orbitron font-bold text-white text-2xl mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allRelated.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={project.screenshots}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
}
