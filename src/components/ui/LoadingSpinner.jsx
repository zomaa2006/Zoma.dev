import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullScreen = true }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      {/* Rotating rings */}
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#00D4FF' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#7C3AED' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#F59E0B' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <div
          className="absolute inset-7 rounded-full"
          style={{ background: 'radial-gradient(circle, #00D4FF33, transparent)' }}
        />
      </div>
      <motion.p
        className="font-orbitron text-xs tracking-widest text-primary uppercase"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: '#050505' }}>
      {content}
    </div>
  );
}
