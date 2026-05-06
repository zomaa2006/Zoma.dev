import { motion } from 'framer-motion';
import { FiExternalLink, FiAward } from 'react-icons/fi';
import SectionTitle from '../ui/SectionTitle';
import { useCertificates } from '../../context/CertificatesContext';
import { ISSUERS } from '../../pages/admin/AdminCertificates';

export default function CertificatesSection() {
  const { certificates, loading } = useCertificates();

  return (
    <section className="section-padding" id="certificates">
      <div className="container-max">
        <SectionTitle
          subtitle="Credentials"
          title="Certifications &"
          highlight="Achievements"
          description="Continuous learning through recognized certifications from top platforms."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : certificates.length === 0 ? (
          <p className="text-center font-inter text-white/30 text-sm py-12">
            No certificates yet. Add them from the admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((cert, i) => {
              const issuerData = ISSUERS.find(is => is.name === cert.issuerName) || ISSUERS[8];
              const isClickable = !!cert.fileUrl;

              const CardWrapper = isClickable ? motion.a : motion.div;
              const wrapperProps = isClickable
                ? { href: cert.fileUrl, target: '_blank', rel: 'noopener noreferrer' }
                : {};

              return (
                <CardWrapper
                  key={cert.id}
                  {...wrapperProps}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`card p-6 relative overflow-hidden group block ${isClickable ? 'cursor-pointer' : ''}`}
                >
                  {/* Background glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top, ${issuerData.color}08, transparent 70%)` }}
                  />

                  {/* Open indicator */}
                  {isClickable && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiExternalLink size={14} className="text-white/40" />
                    </div>
                  )}

                  {/* Icon — emoji centered, issuer color ring */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl relative"
                    style={{ background: issuerData.bg, border: `2px solid ${issuerData.color}40`,
                             boxShadow: `0 0 20px ${issuerData.color}20` }}
                  >
                    {cert.icon || '🏆'}
                  </div>

                  {/* Content */}
                  <h3 className="font-orbitron font-bold text-white text-sm mb-1 leading-snug">{cert.title}</h3>
                  <p className="font-inter text-white/40 text-xs mb-3">{cert.issuerName} · {cert.date}</p>

                  {/* Skills */}
                  {cert.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-xs font-inter"
                          style={{ background: issuerData.color + '15', color: issuerData.color, border: `1px solid ${issuerData.color}25` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Click hint */}
                  {isClickable && (
                    <p className="font-inter text-white/20 text-xs mt-3">
                      {cert.fileType === 'pdf' ? '📄 Click to open PDF' : '🖼️ Click to view certificate'}
                    </p>
                  )}

                  {/* Bottom bar */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, ${issuerData.color}, transparent)` }}
                  />
                </CardWrapper>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
