import AboutSection from '../components/home/AboutSection';
import ExperienceSection from '../components/home/ExperienceSection';
import CertificatesSection from '../components/home/CertificatesSection';
import SectionTitle from '../components/ui/SectionTitle';
import { motion } from 'framer-motion';
import { PERSONAL, SOCIAL } from '../utils/constants';

export default function AboutPage() {
  return (
    <main className="pt-24 min-h-screen noise">
      <div className="container-max px-6 md:px-12 lg:px-20 py-12">
        <SectionTitle
          subtitle="My story"
          title="About"
          highlight="Mohamed Hazem"
          description="19-year-old Full Stack Developer from Egypt on a mission to craft world-class web experiences."
        />
      </div>
      <AboutSection />
      <ExperienceSection />
      <CertificatesSection />
    </main>
  );
}
