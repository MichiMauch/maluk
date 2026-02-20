"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { SectionTitle, GlassCard, Button, MaterialIcon } from "@/components/ui";
import { Modal } from "@/components/ui/Modal";
import { pilot, car } from "@/data/pilot";

const statIcons: Record<string, string> = {
  Saisons: "calendar_month",
  Starts: "flag",
  Podestplätze: "emoji_events",
  Siege: "military_tech",
};

export function PilotMaschine() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const leftX = useTransform(scrollYProgress, [0.0, 0.5], ["-100vw", "0vw"]);
  const rightX = useTransform(scrollYProgress, [0.0, 0.5], ["100vw", "0vw"]);
  const mobileY = useTransform(scrollYProgress, [0.0, 0.5], ["40vh", "0vh"]);
  const opacity = useTransform(scrollYProgress, [0.0, 0.3], [0, 1]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "150vh" }}>
      <div className="sticky top-0 h-screen">
        <section id="pilot" className="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16">
          <SectionTitle highlight="Maschine">Pilot &amp; Maschine</SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left — Pilot */}
            <motion.div className="h-full" style={{ x: isMobile ? 0 : leftX, y: isMobile ? mobileY : 0, opacity }}>
              <GlassCard animated={false} className="h-full p-6 md:p-8 flex flex-col items-center text-center" delay={0}>
                {/* Portrait */}
                <motion.div
                  className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-primary/40 neon-glow mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={pilot.image.url}
                    alt={pilot.image.alt}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                <h3 className="text-white text-2xl md:text-3xl font-bold mb-1">
                  {pilot.name}
                </h3>
                {pilot.nickname && (
                  <span className="text-primary text-sm font-mono uppercase tracking-widest mb-4">
                    &quot;{pilot.nickname}&quot;
                  </span>
                )}
                <p className="text-gray-300 mb-4 max-w-sm">{pilot.bio}</p>

                {/* Social Links */}
                <div className="flex items-center gap-3 mb-6">
                  <a
                    href="https://www.instagram.com/malukracing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@malukracing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon="arrow_forward"
                  onClick={() => setModalOpen(true)}
                >
                  Details
                </Button>
              </GlassCard>
            </motion.div>

            {/* Right — Car */}
            <motion.div className="h-full" style={{ x: isMobile ? 0 : rightX, y: isMobile ? mobileY : 0, opacity }}>
              <GlassCard animated={false} className="h-full p-6 md:p-8 overflow-hidden" delay={0.15}>
                {/* Car Image */}
                <motion.div
                  className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden border border-white/10 mb-6"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5 }}
                >
                  {car.video ? (
                    <video
                      src={car.video.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-[1.3]"
                    />
                  ) : (
                    <Image
                      src={car.image.url}
                      alt={car.image.alt}
                      fill
                      className="object-cover"
                    />
                  )}
                </motion.div>

                <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
                  {car.name}
                </h3>

                {/* Tech Specs */}
                <div className="space-y-3">
                  {car.techSpecs.map((spec) => (
                    <div key={spec.label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{spec.label}</span>
                      <span className="text-primary font-mono">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Pilot Detail Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden border-2 border-primary/40 neon-glow mb-4">
            <Image
              src="/images/lukas-maurer-detail.webp"
              alt={pilot.image.alt}
              fill
              className="object-cover"
            />
          </div>

          <h3 className="text-white text-2xl font-bold mb-1">{pilot.name}</h3>
          {pilot.nickname && (
            <span className="text-primary text-sm font-mono uppercase tracking-widest mb-4">
              &quot;{pilot.nickname}&quot;
            </span>
          )}

          <p className="text-gray-300 mb-6">{pilot.detailedBio}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {pilot.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <MaterialIcon
                  name={statIcons[stat.label] || "bar_chart"}
                  className="text-primary text-2xl mb-1"
                  filled
                />
                <span className="text-white text-2xl font-bold font-mono">
                  {stat.value}
                </span>
                <span className="text-gray-400 text-xs uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
