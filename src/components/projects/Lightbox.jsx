import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Lightbox({ images, initialIndex = 0, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [prev, next, onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <FiX size={20} />
        </button>

        {/* Counter */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 font-orbitron text-xs tracking-widest text-white/50 glass px-4 py-2 rounded-full">
          {current + 1} / {images.length}
        </div>

        {/* Image */}
        <div className="relative w-full max-w-5xl max-h-[80vh] px-16 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={images[current]}
              alt={`Screenshot ${current + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              style={{ boxShadow: '0 30px 100px rgba(0,0,0,0.8)' }}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-2 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-primary/20 hover:text-primary transition-all"
            >
              <FiChevronLeft size={24} />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-2 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-primary/20 hover:text-primary transition-all"
            >
              <FiChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-12 h-8 rounded-md overflow-hidden transition-all duration-200 ${
                  i === current ? 'ring-2 ring-primary scale-110' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
