"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui";
import { raceEvents, getEventTypeLabel } from "@/data/calendar";

export function RaceCalendar() {
  return (
    <section id="calendar" className="w-full max-w-[1000px] px-4 md:px-10 py-16">
      <SectionTitle centered highlight="2026">Rennkalender 2026</SectionTitle>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent md:-translate-x-1/2" />

        {raceEvents.map((race, index) => {
          const isCompleted = race.status === "completed";
          const isLive = race.status === "live";
          const isCancelled = race.status === "cancelled";
          const isBevorstehend = race.status === "upcoming";
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={race._id}
              className={`relative flex flex-col md:flex-row items-center mb-16 md:justify-between group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Content Left (even index) */}
              <div
                className={`md:w-[45%] w-full order-2 md:order-1 pl-12 md:pl-0 md:pr-12 md:text-right`}
              >
                {isEven ? (
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1 justify-end">
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
                    <p className={`text-sm ${isCancelled ? "text-gray-500" : "text-gray-400"}`}>{race.description}</p>
                    {race.result && (
                      <div className="mt-2 flex items-center justify-end gap-2">
                        {race.result.isRecord && (
                          <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">
                            REKORD
                          </span>
                        )}
                        <span className="text-primary font-mono font-bold">
                          P{race.result.position} - {race.result.time}
                        </span>
                      </div>
                    )}
                    {race.image?.url ? (
                      <motion.div
                        className="w-full h-24 mt-3 rounded-lg bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 border border-white/10"
                        style={{ backgroundImage: `url("${race.image.url}")` }}
                        whileHover={{ scale: 1.02 }}
                      />
                    ) : !isCancelled ? (
                      <div className="w-full h-16 mt-3 border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 text-xs uppercase tracking-widest">
                        Bevorstehend
                      </div>
                    ) : null}
                    {isCancelled && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-x-1/4">
                        <span
                          className="bg-red-600/80 text-white text-sm font-bold uppercase tracking-[0.2em] px-8 py-1.5 -rotate-12"
                          style={{ boxShadow: "0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3)" }}
                        >
                          Abgesagt
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Timeline Dot */}
              <div
                className={`absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10 order-1 md:order-2 ${
                  isCancelled
                    ? "w-3 h-3 bg-gray-700 border border-gray-500 rounded-full"
                    : isBevorstehend
                      ? "w-3 h-3 bg-gray-600 border border-gray-400 rounded-full"
                      : "w-4 h-4 bg-accent border-2 border-primary rounded-full neon-glow"
                }`}
              >
                {isLive && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-accent font-bold uppercase animate-pulse">
                    LIVE
                  </span>
                )}
              </div>

              {/* Content Right (odd index) */}
              <div
                className={`md:w-[45%] w-full order-3 md:order-3 pl-12 md:pl-12`}
              >
                {!isEven ? (
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1">
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
                    <p className={`text-sm ${isCancelled ? "text-gray-500" : "text-gray-400"}`}>{race.description}</p>
                    {race.image?.url ? (
                      <motion.div
                        className="w-full h-24 mt-3 rounded-lg bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 border border-white/10"
                        style={{ backgroundImage: `url("${race.image.url}")` }}
                        whileHover={{ scale: 1.02 }}
                      />
                    ) : !isCancelled ? (
                      <div className="w-full h-16 mt-3 border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 text-xs uppercase tracking-widest">
                        Bevorstehend
                      </div>
                    ) : null}
                    {isCancelled && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-x-1/4">
                        <span
                          className="bg-red-600/80 text-white text-sm font-bold uppercase tracking-[0.2em] px-8 py-1.5 -rotate-12"
                          style={{ boxShadow: "0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3)" }}
                        >
                          Abgesagt
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
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
