import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import ProjectCard from '../components/projects/ProjectCard';
import { useProjects } from '../context/ProjectsContext';

const CATEGORIES = ['All', 'E-Commerce', 'Educational', 'System', 'Portfolio', 'Other'];

export default function ProjectsPage() {
  const { projects } = useProjects();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                         p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="pt-24 pb-20 px-6 md:px-12 lg:px-20 min-h-screen noise">
      <div className="container-max">
        <SectionTitle
          subtitle="All work"
          title="My"
          highlight="Projects"
          description="Everything I've built — from personal projects to enterprise applications."
        />

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tech stack..."
            className="input-field text-center"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full font-orbitron text-xs font-semibold tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'text-bg shadow-neon-blue'
                  : 'glass text-white/40 hover:text-white'
              }`}
              style={activeCategory === cat ? { background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' } : {}}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Count */}
        <p className="font-inter text-white/25 text-sm text-center mb-8">
          Showing <span className="text-primary font-semibold">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div key={project.id} layout>
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-orbitron text-white/20 text-lg">No projects found</p>
          </div>
        )}
      </div>
    </main>
  );
}
