"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "./MaterialIcon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function ModalContent({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay — fixed so it always covers the viewport */}
          <motion.div
            className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Scroll container */}
          <div className="fixed inset-0 overflow-y-auto flex items-start justify-center p-4 pt-8 pb-8">
            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-lg my-auto rounded-2xl border border-primary/20 bg-[#1a0f11] p-6 md:p-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer z-10"
              >
                <MaterialIcon name="close" className="text-2xl" />
              </button>
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Modal(props: ModalProps) {
  if (typeof window === "undefined") return null;
  return createPortal(<ModalContent {...props} />, document.body);
}
