"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo, Button, MaterialIcon } from "@/components/ui";
import { SponsorModal } from "./SponsorModal";
import { LiveTickerModal } from "./LiveTickerModal";
import { useTickerStatus } from "@/hooks/useTickerStatus";

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
  const [tickerOpen, setTickerOpen] = useState(false);
  const { isLive, status, activeRaceName, refresh } = useTickerStatus();

  // Auto-open ticker modal on first visit when live
  useEffect(() => {
    if (isLive && !sessionStorage.getItem("ticker-auto-opened")) {
      setTickerOpen(true);
      sessionStorage.setItem("ticker-auto-opened", "1");
    }
  }, [isLive]);

  useEffect(() => {
    const handler = () => setSponsorOpen(true);
    document.addEventListener("open-sponsor-modal", handler);
    return () => document.removeEventListener("open-sponsor-modal", handler);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-obsidian/95 backdrop-blur-sm border-b border-[#492229]"
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
            <div className="hidden md:flex justify-end items-center gap-3">
              <AnimatePresence>
                {isLive && (
                  <motion.button
                    onClick={() => setTickerOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold cursor-pointer transition-colors"
                    style={{ boxShadow: "0 0 16px rgba(220, 38, 38, 0.5)" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      boxShadow: [
                        "0 0 8px rgba(220, 38, 38, 0.4)",
                        "0 0 20px rgba(220, 38, 38, 0.7)",
                        "0 0 8px rgba(220, 38, 38, 0.4)",
                      ],
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                    </span>
                    <span>{status === "pause" ? "PAUSE" : "LIVE"}</span>
                    {activeRaceName && (
                      <span className="hidden lg:inline font-normal opacity-80">
                        {activeRaceName}
                      </span>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
              <Button size="sm" onClick={() => setSponsorOpen(true)}>Sponsor werden</Button>
            </div>

            {/* Mobile: Live Icon + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <AnimatePresence>
                {isLive && (
                  <motion.button
                    onClick={() => setTickerOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold cursor-pointer"
                    style={{ boxShadow: "0 0 12px rgba(220, 38, 38, 0.5)" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      boxShadow: [
                        "0 0 6px rgba(220, 38, 38, 0.4)",
                        "0 0 16px rgba(220, 38, 38, 0.7)",
                        "0 0 6px rgba(220, 38, 38, 0.4)",
                      ],
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    {status === "pause" ? "PAUSE" : "LIVE"}
                  </motion.button>
                )}
              </AnimatePresence>
              <button
                className="text-white p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                <MaterialIcon name={menuOpen ? "close" : "menu"} className="text-2xl" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t border-white/10 bg-obsidian"
              >
                <nav className="px-4 py-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {navLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-gray-300 hover:text-primary text-sm font-medium py-2 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setMenuOpen(false);
                          const target = document.querySelector(link.href);
                          if (target) {
                            setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 150);
                          } else if (link.href === "#") {
                            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 150);
                          }
                        }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <a href="#club100" onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      const target = document.querySelector("#club100");
                      if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 150);
                    }}>
                      <Button size="sm" variant="outline" className="w-full">
                        Member werden
                      </Button>
                    </a>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => { setSponsorOpen(true); setMenuOpen(false); }}
                    >
                      Sponsor werden
                    </Button>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <SponsorModal open={sponsorOpen} onClose={() => setSponsorOpen(false)} />
      <LiveTickerModal
        open={tickerOpen}
        onClose={() => {
          setTickerOpen(false);
          refresh();
        }}
      />
    </>
  );
}
