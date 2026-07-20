import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 800); // Allow fade-out animation to complete
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          {/* Central Logo Symbol */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Gold Halo */}
            <motion.div
              className="absolute h-32 w-32 rounded-full border border-amber-500/10"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Spinning Technical Circle */}
            <motion.div
              className="absolute h-24 w-24 rounded-full border-t-2 border-r border-[#D4AF37]/40 border-b border-l-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Glowing Center */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-black shadow-[0_0_30px_rgba(212,175,55,0.15)]"
            >
              <span className="font-serif text-2xl font-bold tracking-widest text-[#D4AF37]">
                R
              </span>
            </motion.div>
          </div>

          {/* Luxury Text Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 text-center"
          >
            <h1 className="font-sans text-sm font-medium tracking-[0.4em] text-white uppercase">
              ROBANI
            </h1>
            <p className="mt-2 font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
              Second Brain Engine v3.1
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="absolute bottom-16 h-[1px] w-32 bg-zinc-900 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
              initial={{ left: "-100%", width: "100%" }}
              animate={{ left: "100%" }}
              style={{ position: "relative" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
