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
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-obsidian/95 backdrop-blur-sm border-t border-white/10"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="grid grid-cols-2">
            <button
              onClick={() => document.dispatchEvent(new CustomEvent("open-sponsor-modal"))}
              className="h-14 bg-primary hover:bg-accent hover:text-white text-black font-bold text-sm uppercase tracking-wider"
            >
              Sponsor werden
            </button>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent("open-club100-modal"))}
              className="h-14 bg-gradient-to-r from-accent to-primary text-black font-bold text-sm uppercase tracking-wider"
            >
              Club 100
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
