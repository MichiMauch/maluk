"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  children: React.ReactNode;
  highlight?: string;
  className?: string;
  centered?: boolean;
}

export function SectionTitle({ children, highlight, className = "", centered = false }: SectionTitleProps) {
  const renderChildren = () => {
    if (!highlight || typeof children !== "string") return children;

    const index = children.indexOf(highlight);
    if (index === -1) return children;

    const before = children.slice(0, index);
    const after = children.slice(index + highlight.length);

    return (
      <>
        {before}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pr-[0.15em]">
          {highlight}
        </span>
        {after}
      </>
    );
  };

  return (
    <motion.div
      className={`sticky top-[60px] z-30 py-3 ${centered ? "mb-12" : "mb-8"} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={`text-white text-4xl md:text-5xl font-black italic uppercase tracking-tight ${centered ? "text-center" : ""}`}>
        {renderChildren()}
      </h2>
      <div className="h-[1px] mt-3 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
    </motion.div>
  );
}
