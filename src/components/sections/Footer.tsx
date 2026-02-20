"use client";

import { motion } from "framer-motion";

const navigationLinks = [
  { label: "Team Profile", href: "#" },
  { label: "Car Specs", href: "#" },
  { label: "Season 2024", href: "#calendar" },
  { label: "Press Kit", href: "#" },
];

const socialLinks = [
  { label: "IG", href: "https://instagram.com" },
  { label: "YT", href: "https://youtube.com" },
  { label: "X", href: "https://x.com" },
];

export function Footer() {
  return (
    <footer className="bg-obsidian border-t border-primary/20 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-white mb-6">
              <h2 className="text-2xl font-black italic">
                MALUK<span className="text-primary">RACING</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-sm mb-6">
              Professional Hillclimb Racing Team based in Switzerland. Dedicated
              to precision, speed, and the pursuit of the perfect run.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-bold">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">person</span>
                Lukas Maurer
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">location_on</span>
                Schiltwald 156, 5046 Walde
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">mail</span>
                <a href="mailto:lukas.maurer@gmail.com" className="hover:text-primary transition-colors">
                  lukas.maurer@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">account_balance</span>
                Bank Leerau — IBAN CH74 0658 8221 1334 7370 8
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">phone_iphone</span>
                Twint: 078 863 94 30
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} MALUK Racing. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-400">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
