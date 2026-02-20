"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { partners } from "@/data/partners";

export function Sponsors() {
  return (
    <section className="w-full border-t border-white/5 bg-[#14080a] py-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 text-center">
        <motion.p
          className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Unsere Partner
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner._id}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.05 }}
            >
              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  title={partner.name}
                >
                  <SponsorContent partner={partner} />
                </a>
              ) : (
                <div title={partner.name}>
                  <SponsorContent partner={partner} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorContent({ partner }: { partner: (typeof partners)[0] }) {
  if (partner.logo) {
    return (
      <div
        className="relative h-12 w-36 md:h-14 md:w-44 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,214,0,0.4)]"
        style={{
          filter: "brightness(0) invert(1) opacity(0.7)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.filter = "brightness(0) invert(1) opacity(1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.filter = "brightness(0) invert(1) opacity(0.7)";
        }}
      >
        <Image
          src={partner.logo.url}
          alt={partner.logo.alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 144px, 176px"
        />
      </div>
    );
  }

  return (
    <span className="text-xl font-black text-gray-500 group-hover:text-primary transition-all duration-300">
      {partner.name}
    </span>
  );
}
