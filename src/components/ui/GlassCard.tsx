"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  animated?: boolean;
}

export function GlassCard({ children, className = "", hover = true, delay = 0, animated = true }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card rounded-xl ${hover ? "hover:border-primary/30" : ""} transition-colors ${className}`}
      {...(animated && {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: {
          duration: 0.6,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      })}
    >
      {children}
    </motion.div>
  );
}
