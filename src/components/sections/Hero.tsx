"use client";

import { motion } from "framer-motion";
import { Button, MaterialIcon } from "@/components/ui";

const stats = [
  { label: "Höchstgeschwindigkeit", value: "245", unit: "KM/H" },
  { label: "G-Kraft", value: "3.2", unit: "G" },
  { label: "Podestplätze", value: "14", unit: "Gesamt" },
];

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-16">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-obsidian z-0" />

      {/* Car Image - positioned right */}
      <img
        src="/images/hero-car.png"
        alt="Racing car"
        className="absolute right-[20%] bottom-[20%] h-[50%] w-auto object-contain z-5 pointer-events-none"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent z-10" />

      {/* Decorative Lines */}
      <motion.div
        className="absolute top-1/4 left-0 w-1/3 h-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-20"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-1/3 h-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-20"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.7 }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1440px] px-6 lg:px-10 flex flex-col justify-center h-full">
        <div className="max-w-[800px] space-y-6">
          {/* Badge */}
          <motion.div
            className="flex items-center gap-2 text-primary uppercase tracking-[0.2em] text-xs font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MaterialIcon name="speed" className="text-sm animate-pulse" />
            Schweizer Bergrennen Meisterschaft
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-white text-6xl md:text-8xl font-black italic leading-[0.9] tracking-tighter drop-shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            PRÄZISION <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              AM LIMIT
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-gray-300 text-lg md:text-xl font-light max-w-xl border-l-2 border-primary pl-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Tauche ein in die Welt des Rennsports mit Lukas Maurer und seinem legendären Opel Kadett C GT/E. Entdecke die Leidenschaft, die hinter jedem Rennen steckt.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button variant="primary" skewed icon="arrow_forward">
              Aktuelle Ergebnisse
            </Button>
            <Button variant="secondary" skewed>
              Onboard ansehen
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="absolute bottom-10 right-10 hidden lg:flex gap-12 text-white"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.15 }}
            >
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                {stat.label}
              </div>
              <div className="text-3xl font-bold font-mono">
                {stat.value}{" "}
                <span className="text-sm text-primary">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
