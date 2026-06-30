"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionTitle, MaterialIcon } from "@/components/ui";
import { raceEvents, getEventTypeLabel, type RaceEvent } from "@/data/calendar";
import { RaceRecapModal } from "./RaceRecapModal";
import { StartgeldModal } from "./StartgeldModal";

function RaceCard({
  race,
  align,
  onRecapClick,
  onStartgeldClick,
  hasRecap,
}: {
  race: RaceEvent;
  align: "left" | "right";
  onRecapClick: () => void;
  onStartgeldClick: () => void;
  hasRecap: boolean;
}) {
  const isCancelled = race.status === "cancelled";
  const isRight = align === "right";

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 mb-1 ${isRight ? "" : "justify-end"}`}>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
          race.eventType === "hillclimb" ? "bg-accent/20 text-accent" :
          race.eventType === "slalom" ? "bg-primary/20 text-primary" :
          "bg-white/15 text-gray-300"
        }`}>
          {getEventTypeLabel(race.eventType)}
        </span>
      </div>
      <h3 className={`text-2xl font-bold mb-1 transition-colors ${
        isCancelled ? "text-gray-400" : "text-white group-hover:text-primary"
      }`}>
        {race.name}
      </h3>
      <p className={`text-sm mb-2 font-mono ${isCancelled ? "text-gray-500" : "text-gray-300"}`}>
        {formatDateRange(race.dateStart, race.dateEnd)}
      </p>
      <p className={`text-sm ${isCancelled ? "text-gray-500" : "text-gray-400"}`}>
        {race.description}
      </p>
      {race.result && (
        <div className={`mt-2 flex items-center gap-2 ${isRight ? "" : "justify-end"}`}>
          {race.result.isRecord && (
            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">REKORD</span>
          )}
          <span className="text-primary font-mono font-bold">
            P{race.result.position} - {race.result.time}
          </span>
        </div>
      )}
      {race.image?.url ? (
        <div className="relative w-full h-24 mt-3 rounded-lg overflow-hidden border border-white/10">
          <Image
            src={race.image.url}
            alt={race.image.alt}
            fill
            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      ) : !isCancelled ? (
        hasRecap ? (
          <button
            onClick={onRecapClick}
            className="w-full h-16 mt-3 border border-primary/30 bg-primary/5 rounded-lg flex items-center justify-center gap-2 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <MaterialIcon name="article" className="text-base" />
            Rennbericht
          </button>
        ) : (
          <div className="w-full h-16 mt-3 border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 text-xs uppercase tracking-widest">
            Bevorstehend
          </div>
        )
      ) : null}
      {!isCancelled && !hasRecap && (
        <button
          onClick={onStartgeldClick}
          className="w-full h-12 mt-2 border border-accent/30 bg-accent/5 rounded-lg flex items-center justify-center gap-2 text-accent text-xs font-bold uppercase tracking-widest hover:bg-accent/10 transition-colors cursor-pointer"
        >
          <MaterialIcon name="volunteer_activism" className="text-base" />
          Startgeldsponsor
        </button>
      )}
      {isCancelled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="bg-red-600/80 text-white text-sm font-bold uppercase tracking-[0.2em] px-8 py-1.5 -rotate-12"
            style={{ boxShadow: "0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3)" }}
          >
            Abgesagt
          </span>
        </div>
      )}
    </div>
  );
}

interface TrackAnchor {
  y: number; // vertical centre of the race node, relative to the container
  eventType: RaceEvent["eventType"];
  status: RaceEvent["status"];
  side: "left" | "right"; // which column the card sits in
}

interface TrackGeometry {
  width: number;
  height: number;
  centerX: number;
  anchors: TrackAnchor[];
}

// Colour a pit marker by event type / status so it matches the card's tag.
function anchorColor(a: TrackAnchor): string {
  if (a.status === "cancelled") return "#6b7280";
  if (a.eventType === "hillclimb") return "#DC2626";
  if (a.eventType === "slalom") return "#FFD600";
  return "#9ca3af";
}

// Build a winding "race track" path that runs top to bottom, swinging gently
// left/right between the race nodes but always returning to centerX at each
// node so the pit markers sit dead-centre on the road. On a narrow (mobile)
// rail the road only bulges to the right so it never leaves the viewport.
function buildTrackPath(geom: TrackGeometry): string {
  const { width, height, centerX, anchors } = geom;
  const isNarrow = centerX < width * 0.25;
  // On the narrow mobile rail there isn't room to swing the road without the
  // bright centre line visibly drifting off the thin asphalt, so keep it dead
  // straight there; the gentle curves are a desktop treatment.
  const amplitude = isNarrow ? 0 : Math.min(72, width * 0.07);

  // Points the road must pass through (top edge → each node → bottom edge).
  const ys = [0, ...anchors.map((a) => a.y), height];

  let d = `M ${centerX.toFixed(1)} 0`;
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i];
    const y1 = ys[i + 1];
    const dy = y1 - y0;
    // Alternate the bulge side; force right-only when the rail is narrow.
    const dir = isNarrow ? 1 : i % 2 === 0 ? 1 : -1;
    const cx = centerX + dir * amplitude;
    d += ` C ${cx.toFixed(1)} ${(y0 + dy * 0.4).toFixed(1)} ${cx.toFixed(1)} ${(
      y1 -
      dy * 0.4
    ).toFixed(1)} ${centerX.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

// A pit-stop marker (tyre + wheel) sitting on the track, with a short connector
// spur reaching toward the card it belongs to.
function PitMarker({
  x,
  y,
  color,
  dim,
  live,
  spurDir,
}: {
  x: number;
  y: number;
  color: string;
  dim: boolean;
  live: boolean;
  spurDir: number;
}) {
  const r = 10;
  const spurLen = 26;
  return (
    <g opacity={dim ? 0.55 : 1}>
      {/* Connector spur toward the card (the "pit lane") */}
      <line
        x1={x + spurDir * (r - 1)}
        y1={y}
        x2={x + spurDir * (r + spurLen)}
        y2={y}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={2}
      />
      <circle cx={x + spurDir * (r + spurLen)} cy={y} r={2.5} fill={color} />

      {/* Live pulse ring */}
      {live && (
        <circle cx={x} cy={y} r={r + 5} fill="none" stroke={color} strokeWidth={2} className="race-track-pulse" />
      )}

      {/* Tyre */}
      <circle cx={x} cy={y} r={r} fill="#0f0506" stroke="#3a2a2e" strokeWidth={3} />
      {/* Rim */}
      <circle cx={x} cy={y} r={6} fill="#191013" stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
      {/* Hub */}
      <circle cx={x} cy={y} r={3} fill={color} />
    </g>
  );
}

// A checkered start / finish band across the road.
function CheckeredBand({
  x,
  y,
  roadWidth,
  label,
  labelDir,
}: {
  x: number;
  y: number;
  roadWidth: number;
  label: string;
  labelDir: number;
}) {
  const w = roadWidth + 10;
  const h = 12;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={2}
        fill="url(#trackChecker)"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={1}
      />
      <text
        x={x + labelDir * (w / 2 + 8)}
        y={y}
        textAnchor={labelDir < 0 ? "end" : "start"}
        dominantBaseline="middle"
        fill="#9ca3af"
        fontSize={10}
        fontWeight="700"
        letterSpacing="2"
      >
        {label}
      </text>
    </g>
  );
}

function RaceTrack({ geom }: { geom: TrackGeometry }) {
  const path = buildTrackPath(geom);
  const isNarrow = geom.centerX < geom.width * 0.25;
  const roadWidth = isNarrow ? 11 : 18;
  const startY = 8;
  const finishY = geom.height - 8;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={geom.width}
      height={geom.height}
      viewBox={`0 0 ${geom.width} ${geom.height}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="trackFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.04" stopColor="white" stopOpacity="1" />
          <stop offset="0.96" stopColor="white" stopOpacity="1" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="trackFadeMask">
          <rect width={geom.width} height={geom.height} fill="url(#trackFade)" />
        </mask>
        <pattern id="trackChecker" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#f5f5f5" />
          <rect width="3" height="3" fill="#111" />
          <rect x="3" y="3" width="3" height="3" fill="#111" />
        </pattern>
      </defs>

      {/* Road (faded at the very ends) */}
      <g mask="url(#trackFadeMask)">
        {/* Soft neon glow under the road */}
        <path d={path} stroke="rgba(255,214,0,0.08)" strokeWidth={roadWidth + 12} strokeLinecap="round" />
        {/* Light kerb edge */}
        <path d={path} stroke="rgba(255,255,255,0.10)" strokeWidth={roadWidth + 3} strokeLinecap="round" />
        {/* Asphalt */}
        <path d={path} stroke="#2b1a1f" strokeWidth={roadWidth} strokeLinecap="round" />
        {/* Dashed centre line (road marking) */}
        <path
          className="race-track-dash"
          d={path}
          stroke="#FFD600"
          strokeWidth={2}
          strokeDasharray="12 16"
          strokeOpacity={0.9}
        />
      </g>

      {/* Start / finish checkered bands (crisp, on top of the road) */}
      <CheckeredBand x={geom.centerX} y={startY} roadWidth={roadWidth} label="START" labelDir={isNarrow ? 1 : -1} />
      <CheckeredBand x={geom.centerX} y={finishY} roadWidth={roadWidth} label="ZIEL" labelDir={isNarrow ? 1 : -1} />

      {/* Pit-stop markers, one per race */}
      {geom.anchors.map((a, i) => (
        <PitMarker
          key={i}
          x={geom.centerX}
          y={a.y}
          color={anchorColor(a)}
          dim={a.status === "cancelled"}
          live={a.status === "live"}
          spurDir={isNarrow ? 1 : a.side === "left" ? -1 : 1}
        />
      ))}
    </svg>
  );
}

export function RaceCalendar() {
  const [recapModal, setRecapModal] = useState<{ slug: string; name: string } | null>(null);
  const [startgeldModal, setStartgeldModal] = useState<string | null>(null);
  const [recapSlugs, setRecapSlugs] = useState<Set<string>>(new Set());
  const [trackGeom, setTrackGeom] = useState<TrackGeometry | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);

  const measureTrack = useCallback(() => {
    const container = trackRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    // Skip while the section is collapsed (e.g. offscreen content-visibility) —
    // keep the straight-line fallback until we get a real layout.
    if (box.width < 50 || box.height < 50) return;
    const anchors: TrackAnchor[] = [];
    let sumX = 0;
    let count = 0;
    raceEvents.forEach((race, i) => {
      const dot = dotRefs.current[i];
      if (!dot) return;
      const r = dot.getBoundingClientRect();
      anchors.push({
        y: r.top - box.top + r.height / 2,
        eventType: race.eventType,
        status: race.status,
        side: i % 2 === 0 ? "left" : "right",
      });
      sumX += r.left - box.left + r.width / 2;
      count++;
    });
    if (count === 0) return;
    setTrackGeom({
      width: box.width,
      height: box.height,
      centerX: sumX / count,
      anchors,
    });
  }, []);

  useEffect(() => {
    measureTrack();
    const container = trackRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measureTrack());
    ro.observe(container);
    window.addEventListener("resize", measureTrack);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureTrack);
    };
  }, [measureTrack, recapSlugs]);

  const checkRecaps = useCallback(async () => {
    try {
      const res = await fetch("/api/race-recaps");
      if (!res.ok) return;
      const data = await res.json();
      setRecapSlugs(new Set(data.slugs as string[]));
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    checkRecaps();
  }, [checkRecaps]);

  return (
    <section id="calendar" className="w-full max-w-[1000px] px-4 md:px-10 py-8">
      <SectionTitle centered highlight="2026">Rennkalender 2026</SectionTitle>

      <div className="relative" ref={trackRef}>
        {/* Race track (winding road) — falls back to a straight line until measured */}
        {trackGeom ? (
          <RaceTrack geom={trackGeom} />
        ) : (
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent md:-translate-x-1/2" />
        )}

        {raceEvents.map((race, index) => {
          const isLive = race.status === "live";
          const isEven = index % 2 === 0;
          const hasRecap = recapSlugs.has(race.slug.current);

          return (
            <motion.div
              key={race._id}
              className="relative flex flex-col md:flex-row items-center mb-16 md:justify-between group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              {/* Content Left */}
              <div className="md:w-[45%] w-full order-2 md:order-1 pl-12 md:pl-0 md:pr-12 md:text-right">
                {isEven && (
                  <RaceCard
                    race={race}
                    align="left"
                    hasRecap={hasRecap}
                    onRecapClick={() => setRecapModal({ slug: race.slug.current, name: race.name })}
                    onStartgeldClick={() => setStartgeldModal(race.name)}
                  />
                )}
              </div>

              {/* Track node anchor (the visible pit marker is drawn in the SVG track) */}
              <div
                ref={(el) => {
                  dotRefs.current[index] = el;
                }}
                aria-hidden
                className="absolute left-4 -translate-x-1/2 md:left-1/2 w-px h-px order-1 md:order-2"
              >
                {isLive && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 text-[10px] text-accent font-bold uppercase animate-pulse whitespace-nowrap">
                    LIVE
                  </span>
                )}
              </div>

              {/* Content Right */}
              <div className="md:w-[45%] w-full order-3 md:order-3 pl-12 md:pl-12">
                {!isEven && (
                  <RaceCard
                    race={race}
                    align="right"
                    hasRecap={hasRecap}
                    onRecapClick={() => setRecapModal({ slug: race.slug.current, name: race.name })}
                    onStartgeldClick={() => setStartgeldModal(race.name)}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recap Modal */}
      {recapModal && (
        <RaceRecapModal
          open={true}
          onClose={() => setRecapModal(null)}
          raceSlug={recapModal.slug}
          raceName={recapModal.name}
        />
      )}

      {/* Startgeld Modal */}
      {startgeldModal && (
        <StartgeldModal
          open={true}
          onClose={() => setStartgeldModal(null)}
          raceName={startgeldModal}
        />
      )}
    </section>
  );
}

function formatDateRange(start: string, end?: string): string {
  const startDate = new Date(start);

  if (end) {
    const endDate = new Date(end);
    return `${startDate.getDate()}.–${endDate.getDate()}. ${startDate.toLocaleDateString("de-CH", { month: "long" }).toUpperCase()} ${startDate.getFullYear()}`;
  }

  return `${startDate.getDate()}. ${startDate.toLocaleDateString("de-CH", { month: "long" }).toUpperCase()} ${startDate.getFullYear()}`;
}
