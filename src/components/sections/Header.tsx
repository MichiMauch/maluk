"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo, Button, MaterialIcon } from "@/components/ui";
import { SponsorModal } from "./SponsorModal";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Pilot", href: "#pilot" },
  { label: "Rennkalender", href: "#calendar" },
  { label: "Club 100", href: "#club100" },
  { label: "Challenge", href: "#challenge" },
];

export function Header() {
  const [sponsorOpen, setSponsorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[#492229]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between px-4 py-2 md:px-6 lg:px-10">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 md:gap-4 text-white shrink-0">
              <div className="text-primary">
                <Logo className="h-10 md:h-14 w-auto" />
              </div>
              <span className="text-white text-lg md:text-xl font-black italic tracking-tighter">
                MALUK<span className="text-primary">RACING</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-primary text-sm font-medium transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex justify-end gap-4">
              <Button size="sm" onClick={() => setSponsorOpen(true)}>Sponsor werden</Button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <MaterialIcon name={menuOpen ? "close" : "menu"} className="text-2xl" />
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t border-white/10"
              >
                <nav className="flex flex-col px-4 py-4 gap-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-gray-300 hover:text-primary text-sm font-medium py-2 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => { setSponsorOpen(true); setMenuOpen(false); }}
                  >
                    Sponsor werden
                  </Button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <SponsorModal open={sponsorOpen} onClose={() => setSponsorOpen(false)} />
    </>
  );
}
