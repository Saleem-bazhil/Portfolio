import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const GlowingStarsBackground = ({ className }) => {
  const stars = new Array(60).fill(0);

  return (
    <div className={cn("absolute inset-0 overflow-hidden -z-10", className)}>
      {stars.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.4, 1.2, 0.4],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
          className="absolute w-1 h-1 rounded-full bg-white/80 blur-[2px]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Provide the previous/alternate name used elsewhere (`GlowingStarsBackgroundCard`)
// so imports that expect that name continue to work.
export { GlowingStarsBackground as GlowingStarsBackgroundCard };
