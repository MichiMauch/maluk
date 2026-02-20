"use client";

import { motion } from "framer-motion";
import { Logo, Button } from "@/components/ui";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Pilot", href: "#pilot" },
  { label: "Rennkalender", href: "#calendar" },
  { label: "Club 100", href: "#club100" },
  { label: "Challenge", href: "#challenge" },
];

export function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[#492229]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex h-full grow flex-col max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between whitespace-nowrap px-6 py-2 lg:px-10">
          {/* Logo */}
          <a href="#" className="flex items-center gap-4 text-white">
            <div className="text-primary">
              <Logo className="h-14 w-auto" />
            </div>
            <h2 className="text-white text-xl font-black italic tracking-tighter">
              MALUK<span className="text-primary">RACING</span>
            </h2>
          </a>

          {/* Navigation */}
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

          {/* CTA */}
          <div className="flex justify-end gap-4">
            <Button size="sm">Sponsorship</Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
