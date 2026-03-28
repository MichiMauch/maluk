"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, MaterialIcon } from "@/components/ui";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import { partners } from "@/data/partners";

const stats = [
  { label: "Baujahr", value: "1979", unit: "" },
  { label: "Gewicht", value: "905", unit: "kg inkl. Fahrer" },
  { label: "Motor", value: "2.0", unit: "16V BEWA-Technik" },
];

export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen md:h-screen w-full flex items-center justify-center pt-16">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-obsidian z-0" />

      {/* Car Image - Desktop: absolute positioned right */}
      <div className="hidden md:block absolute right-[20%] bottom-[20%] h-[50%] w-[50%] z-5 pointer-events-none">
        <Image
          src="/images/hero-car.webp"
          alt="Racing car"
          fill
          priority
          className="object-contain"
          sizes="50vw"
        />
      </div>

      {/* Gradient Overlays */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent z-10" />

      {/* Decorative Lines */}
      <motion.div
        className="absolute top-[31%] md:top-1/4 left-0 w-1/3 h-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-20"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[52%] md:bottom-1/4 right-0 w-1/3 h-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-20"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.7 }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1440px] px-8 md:px-6 lg:px-10 flex flex-col justify-start pt-4 md:justify-center md:pt-0 h-full">
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
            <span className="inline-block pr-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              AM LIMIT
            </span>
          </motion.h1>

          {/* Car Image - Mobile: in flow between title and text */}
          <div className="relative w-full h-[25vh] md:hidden">
            <Image
              src="/images/hero-car.webp"
              alt="Racing car"
              fill
              priority
              className="object-contain object-right"
              sizes="100vw"
            />
          </div>

          {/* Tagline */}
          <motion.p
            className="text-gray-300 text-lg md:text-xl font-light max-w-xl border-l-2 border-primary pl-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Tauche ein in die Welt des Rennsports mit Lukas Maurer und seinem legendären Opel Kadett C GT/E. Entdecke die Leidenschaft, die hinter jedem Rennen steckt.
          </motion.p>

          {/* Mobile Sponsor Logo Bar */}
          <motion.div
            className="md:hidden relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />
            <div className="flex gap-8 animate-[hero-scroll_20s_linear_infinite] w-max">
              {[...partners, ...partners].map((partner, i) => {
                if (!partner.logo) return null;
                return (
                  <div
                    key={`${partner._id}-mob-${i}`}
                    className="relative h-6 w-16 flex-shrink-0"
                    style={{ filter: "brightness(0) invert(1) opacity(0.5)" }}
                  >
                    <Image
                      src={partner.logo.url}
                      alt={partner.logo.alt}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 pt-4 pb-8 md:pb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <a href="#calendar">
              <Button variant="primary" skewed icon="arrow_forward">
                Aktuelle Saison
              </Button>
            </a>
            <Button
              variant="outline"
              skewed
              className="md:hidden"
              onClick={() => document.dispatchEvent(new CustomEvent("open-sponsor-modal"))}
            >
              Partner werden
            </Button>
            <Button variant="secondary" skewed onClick={() => setVideoOpen(true)}>
              Onboard ansehen
            </Button>
          </motion.div>
        </div>

        {/* Sponsor Carousel */}
        <motion.div
          className="absolute bottom-10 left-6 lg:left-10 hidden lg:block max-w-xs"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Unsere Partner</p>
          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />
            <div className="flex gap-8 animate-[hero-scroll_20s_linear_infinite] w-max">
              {[...partners, ...partners].map((partner, i) => {
                const content = partner.logo ? (
                  <div
                    className="relative h-7 w-20 flex-shrink-0 transition-opacity hover:opacity-100"
                    style={{ filter: "brightness(0) invert(1) opacity(0.6)" }}
                  >
                    <Image
                      src={partner.logo.url}
                      alt={partner.logo.alt}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                ) : null;
                if (!content) return null;
                return partner.website ? (
                  <a
                    key={`${partner._id}-${i}`}
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer flex-shrink-0"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={`${partner._id}-${i}`} className="flex-shrink-0">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

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

      {/* Onboard Video Lightbox */}
      <Modal open={videoOpen} onClose={() => setVideoOpen(false)}>
        <div className="aspect-video rounded-lg overflow-hidden bg-black -m-6 md:-m-8">
          {videoOpen && (
            <iframe
              src="https://www.youtube.com/embed/TPiVAVzI2Cs?autoplay=1"
              title="Onboard Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>
      </Modal>
    </section>
  );
}
