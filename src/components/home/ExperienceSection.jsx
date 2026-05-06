import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTitle from '../ui/SectionTitle';
import { EXPERIENCE } from '../../utils/constants';

gsap.registerPlugin(ScrollTrigger);

function TimelineItem({ item, index }) {
  const itemRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(itemRef.current, {
        x: index % 2 === 0 ? -60 : 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={itemRef} className="flex gap-6 relative">
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.3 }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 glass"
          style={{ border: `2px solid ${item.color}`, boxShadow: `0 0 20px ${item.color}30` }}
        >
          {item.icon}
        </motion.div>
        {index < EXPERIENCE.length - 1 && (
          <div className="flex-1 w-px mt-2" style={{ background: `linear-gradient(to bottom, ${item.color}40, transparent)` }} />
        )}
      </div>

      {/* Content */}
      <motion.div
        whileHover={{ x: 6 }}
        className="glass rounded-2xl p-5 mb-8 flex-1 transition-all duration-300"
        style={{ borderLeft: `2px solid ${item.color}30` }}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-orbitron font-bold text-white text-base">{item.role}</h3>
            <p className="font-inter text-sm" style={{ color: item.color }}>{item.company}</p>
          </div>
          <span className="font-orbitron text-xs text-white/30 glass px-3 py-1 rounded-full whitespace-nowrap">
            {item.period}
          </span>
        </div>
        <p className="font-inter text-white/50 text-sm leading-relaxed mb-4">{item.description}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded text-xs font-inter font-medium"
                  style={{ background: item.color + '15', color: item.color, border: `1px solid ${item.color}30` }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section className="section-padding relative overflow-hidden" id="experience">
      <div className="container-max max-w-3xl">
        <SectionTitle
          subtitle="Where I've worked"
          title="Work"
          highlight="Experience"
          description="My professional journey from student leader to enterprise developer."
        />
        <div>
          {EXPERIENCE.map((item, i) => (
            <TimelineItem key={item.company + item.role} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
