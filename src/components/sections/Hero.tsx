"use client";

import { useState } from "react";
import { Button, MaterialIcon, PartnerScrollBar } from "@/components/ui";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";

const stats = [
  { label: "Baujahr", value: "1979", unit: "" },
  { label: "Gewicht", value: "905", unit: "kg inkl. Fahrer" },
  { label: "Top Speed", value: "197", unit: "km/h" },
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
      <div
        className="absolute top-[28%] md:top-1/4 left-0 w-1/3 h-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-20 animate-[scaleInX_1.5s_0.5s_ease-out_both]"
      />
      <div
        className="absolute bottom-[55%] md:bottom-1/4 right-0 w-1/3 h-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-20 animate-[scaleInX_1.5s_0.7s_ease-out_both]"
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1440px] px-8 md:px-6 lg:px-10 flex flex-col justify-start pt-0 md:justify-center md:pt-0 h-full">
        <div className="max-w-[800px] space-y-6">
          {/* Badge */}
          <div className="flex items-center gap-2 text-primary uppercase tracking-[0.2em] text-xs font-bold">
            <MaterialIcon name="speed" className="text-sm animate-pulse" />
            Schweizer Bergrennen Meisterschaft
          </div>

          {/* Headline — no animation, this is the LCP element */}
          <h1 className="text-white text-6xl md:text-8xl font-black italic leading-[0.9] tracking-tighter drop-shadow-2xl">
            PRÄZISION <br />
            <span className="inline-block pr-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              AM LIMIT
            </span>
          </h1>

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
          <p
            className="text-gray-300 text-lg md:text-xl font-light max-w-xl border-l-2 border-primary pl-4 animate-[fadeInUp_0.6s_0.5s_ease-out_both]"
          >
            Tauche ein in die Welt des Rennsports mit Lukas Maurer und seinem legendären Opel Kadett C GT/E. Entdecke die Leidenschaft, die hinter jedem Rennen steckt.
          </p>

          {/* Mobile Sponsor Logo Bar */}
          <div
            className="md:hidden !mt-10 animate-[fadeIn_0.8s_0.6s_ease-out_both]"
          >
            <PartnerScrollBar size="sm" />
          </div>

          {/* Buttons */}
          <div
            className="flex flex-wrap gap-4 pt-4 pb-8 md:pb-0 animate-[fadeInUp_0.6s_0.7s_ease-out_both]"
          >
            <a href="#calendar">
              <Button variant="primary" skewed icon="arrow_forward">
                Aktuelle Saison
              </Button>
            </a>
            <Button variant="secondary" skewed onClick={() => setVideoOpen(true)}>
              Onboard ansehen
            </Button>
          </div>
        </div>

        {/* Sponsor Carousel */}
        <div
          className="absolute bottom-10 left-6 lg:left-10 hidden lg:block max-w-xs animate-[fadeInLeft_0.8s_0.9s_ease-out_both]"
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Unsere Partner</p>
          <PartnerScrollBar size="md" />
        </div>

        {/* Stats */}
        <div
          className="absolute bottom-10 right-10 hidden lg:flex gap-12 text-white animate-[fadeInRight_0.8s_0.9s_ease-out_both]"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="animate-[fadeInUp_0.6s_ease-out_both]"
              style={{ animationDelay: `${1 + index * 0.15}s` }}
            >
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                {stat.label}
              </div>
              <div className="text-3xl font-bold font-mono">
                {stat.value}{" "}
                <span className="text-sm text-primary">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>
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
