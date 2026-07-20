import React from "react";
import { motion } from "motion/react";

export const ThemeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 bg-black overflow-hidden pointer-events-none select-none">
      {/* Subtle glowing radial gradient behind content */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber-500/5 via-transparent to-transparent blur-[160px]" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-yellow-500/3 via-transparent to-transparent blur-[140px]" />

      {/* Futuristic grid mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255, 255, 255) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255, 255, 255) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Floating Gold Dust Particles */}
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 2 + 1;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 15;
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-500/20 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.7, 0.1],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};
