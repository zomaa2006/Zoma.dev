import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import SkillCubes from '../three/SkillCubes';
import { SKILLS } from '../../utils/constants';

export default function SkillsSection() {
  const categories = Object.keys(SKILLS);
  const [activeTab, setActiveTab] = useState(categories[0]);

  return (
    <section className="section-padding relative overflow-hidden" id="skills">
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', transform: 'translate(-30%, -50%)' }} />

      <div className="container-max">
        <SectionTitle
          subtitle="What I work with"
          title="Skills &"
          highlight="Technologies"
          description="A curated stack of modern tools and frameworks I use to build production-ready applications."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Skill Cubes */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SkillCubes />
            <p className="font-inter text-white/25 text-xs text-center mt-2 tracking-wider">
              Hover cubes to spin them faster
            </p>
          </motion.div>

          {/* Right: Bars */}
          <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider transition-all duration-200 ${
                    activeTab === cat
                      ? 'text-bg'
                      : 'glass text-white/40 hover:text-white'
                  }`}
                  style={activeTab === cat ? { background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {SKILLS[activeTab].map(({ name, level, icon }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{icon}</span>
                        <span className="font-inter text-white text-sm font-medium">{name}</span>
                      </div>
                      <span className="font-orbitron text-xs text-primary">{level}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
