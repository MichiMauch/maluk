"use client";

import Image from "next/image";
import { partners } from "@/data/partners";
import { trackEvent } from "@/lib/tracking";

interface PartnerScrollBarProps {
  size?: "sm" | "md";
}

export function PartnerScrollBar({ size = "md" }: PartnerScrollBarProps) {
  const logoHeight = size === "sm" ? "h-6" : "h-7";
  const logoWidth = size === "sm" ? "w-16" : "w-20";
  const logoSizes = size === "sm" ? "64px" : "80px";
  const opacity = size === "sm" ? 0.5 : 0.6;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />
      <div className="flex gap-8 animate-[hero-scroll_20s_linear_infinite] w-max">
        {[...partners, ...partners].map((partner, i) => {
          if (!partner.logo) return null;
          const logo = (
            <div
              className={`relative ${logoHeight} ${logoWidth} flex-shrink-0`}
              style={{ filter: `brightness(0) invert(1) opacity(${opacity})` }}
            >
              <Image
                src={partner.logo.url}
                alt={partner.logo.alt}
                fill
                className="object-contain"
                sizes={logoSizes}
              />
            </div>
          );
          return partner.website ? (
            <a
              key={`${partner._id}-${i}`}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
              onClick={() => trackEvent("Sponsor", "Click", partner.name)}
            >
              {logo}
            </a>
          ) : (
            <div key={`${partner._id}-${i}`} className="flex-shrink-0">
              {logo}
            </div>
          );
        })}
      </div>
    </div>
  );
}
