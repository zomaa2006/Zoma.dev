import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import SkillsSection from '../components/home/SkillsSection';
import ProjectsSection from '../components/home/ProjectsSection';
import ExperienceSection from '../components/home/ExperienceSection';
import CertificatesSection from '../components/home/CertificatesSection';
import ContactSection from '../components/home/ContactSection';

export default function HomePage() {
  return (
    <main className="noise">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <CertificatesSection />
      <ContactSection />
    </main>
  );
}
