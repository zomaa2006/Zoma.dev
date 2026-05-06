import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { HiLink } from 'react-icons/hi';

export default function ProjectCard({ project, index }) {
  const navigate = useNavigate();
  const [imgHovered, setImgHovered] = useState(false);
  const [tapping, setTapping] = useState(false);

  const handleImageClick = (e) => {
    e.preventDefault();
    setTapping(true);
    setTimeout(() => {
      setTapping(false);
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="card group relative flex flex-col"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(124,58,237,0.05))', boxShadow: '0 0 40px rgba(0,212,255,0.08) inset' }} />

      {/* ─── IMAGE ─── */}
      <div
        className="project-img-wrapper h-52 cursor-pointer relative"
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
        onClick={handleImageClick}
      >
        <motion.img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ scale: tapping ? 0.97 : imgHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          loading="lazy"
        />

        {/* Overlay */}
        <motion.div
          className="project-img-overlay absolute inset-0 flex flex-col items-center justify-center"
          animate={{ opacity: imgHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ y: imgHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full text-white font-orbitron text-xs font-semibold tracking-widest">
              <HiLink size={14} />
              Visit Site
            </div>
            <p className="text-white/80 font-inter text-sm">{project.title}</p>
          </motion.div>
        </motion.div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md font-orbitron text-xs font-bold tracking-wider"
               style={{ background: 'rgba(245,158,11,0.9)', color: '#000' }}>
            ⭐ Featured
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 right-3 category-badge">
          {project.category}
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-orbitron font-bold text-white text-lg mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="font-inter text-white/50 text-sm leading-relaxed mb-4 flex-1">
          {project.shortDescription}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="tech-tag text-xs">{tech}</span>
          ))}
          {project.techStack.length > 4 && (
            <span className="tech-tag text-xs">+{project.techStack.length - 4}</span>
          )}
        </div>

        {/* ─── BUTTONS ─── */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-inter text-xs font-semibold transition-all duration-200 hover:shadow-neon-blue"
            style={{ background: 'linear-gradient(135deg, #00D4FF22, #7C3AED22)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}
          >
            <FiExternalLink size={13} />
            Live Demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-inter text-xs font-semibold transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
          >
            <FiGithub size={13} />
            GitHub
          </a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}
            title="View Details"
          >
            <FiArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
