import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SectionTitle from '../ui/SectionTitle';
import ProjectCard from '../projects/ProjectCard';
import { useProjects } from '../../context/ProjectsContext';

export default function ProjectsSection() {
  const { projects } = useProjects();
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="section-padding relative overflow-hidden" id="projects">
      <div className="container-max">
        <SectionTitle
          subtitle="What I've built"
          title="Featured"
          highlight="Projects"
          description="A selection of my most impactful work — from e-commerce platforms to complex management systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/projects" className="inline-flex items-center gap-3 btn-outline">
              View All Projects
              <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
