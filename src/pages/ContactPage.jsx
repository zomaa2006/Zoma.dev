import ContactSection from '../components/home/ContactSection';
import SectionTitle from '../components/ui/SectionTitle';

export default function ContactPage() {
  return (
    <main className="pt-24 min-h-screen noise">
      <div className="container-max px-6 md:px-12 lg:px-20 py-4">
        <SectionTitle
          subtitle="Let's connect"
          title="Contact"
          highlight="Me"
          description="Have a project in mind or just want to say hello? I'd love to hear from you."
        />
      </div>
      <ContactSection />
    </main>
  );
}
