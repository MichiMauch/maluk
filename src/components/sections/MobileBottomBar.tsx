"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileBottomBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-obsidian/95 backdrop-blur-sm border-t border-white/10 p-3"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => document.dispatchEvent(new CustomEvent("open-sponsor-modal"))}
              className="h-11 bg-gradient-to-r from-accent to-primary text-black font-bold text-sm uppercase tracking-wider rounded-none"
              style={{ transform: "skewX(-10deg)" }}
            >
              <span style={{ transform: "skewX(10deg)", display: "block" }}>
                Sponsor werden
              </span>
            </button>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent("open-club100-modal"))}
              className="h-11 border border-primary/50 bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider rounded-none"
              style={{ transform: "skewX(-10deg)" }}
            >
              <span style={{ transform: "skewX(10deg)", display: "block" }}>
                Club 100
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
