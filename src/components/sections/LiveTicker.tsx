"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MaterialIcon } from "@/components/ui";
import { trackEvent } from "@/lib/tracking";
import type { TickerMessage, RaceStatus } from "@/lib/ticker";

const POLL_INTERVAL = 15_000; // 15 seconds

function formatTime(dateStr: string) {
  const date = new Date(dateStr + "Z"); // UTC from DB
  return date.toLocaleTimeString("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Zurich",
  });
}

function StatusBadge({ status }: { status: RaceStatus | null }) {
  if (!status || status === "ende") return null;

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            status === "live" ? "bg-green-400" : "bg-yellow-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${
            status === "live" ? "bg-green-500" : "bg-yellow-500"
          }`}
        />
      </span>
      <span
        className={`text-xs font-bold uppercase tracking-widest ${
          status === "live" ? "text-green-400" : "text-yellow-400"
        }`}
      >
        {status === "live" ? "Live" : "Pause"}
      </span>
    </div>
  );
}

function MessageIcon({ type }: { type: string }) {
  switch (type) {
    case "photo":
      return <MaterialIcon name="photo_camera" className="text-primary text-sm" filled />;
    case "result":
      return <MaterialIcon name="emoji_events" className="text-primary text-sm" filled />;
    case "status":
      return <MaterialIcon name="flag" className="text-primary text-sm" filled />;
    default:
      return <MaterialIcon name="chat" className="text-gray-500 text-sm" />;
  }
}

export function LiveTicker() {
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [status, setStatus] = useState<RaceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTracked, setHasTracked] = useState(false);

  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch("/api/ticker?limit=30");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setStatus(data.status);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchTicker]);

  // Track first view
  useEffect(() => {
    if (messages.length > 0 && !hasTracked) {
      trackEvent("Ticker", "View");
      setHasTracked(true);
    }
  }, [messages, hasTracked]);

  // Don't render section if no messages
  if (!loading && messages.length === 0) return null;

  return (
    <section className="w-full max-w-[1280px] px-4 md:px-10 py-8">
      <motion.div
        className="relative rounded-2xl overflow-hidden border border-green-500/20 bg-[#111]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Glow */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/10 blur-[80px] rounded-full" />

        <div className="relative z-10 p-4 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/50 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest">
                <MaterialIcon name="cell_tower" className="text-sm" filled />
                Live Ticker
              </div>
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Messages */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    className={`flex gap-3 p-3 rounded-lg border ${
                      msg.type === "result"
                        ? "bg-primary/10 border-primary/20"
                        : msg.type === "status"
                          ? "bg-green-500/10 border-green-500/20"
                          : index === 0
                            ? "bg-white/10 border-white/10"
                            : "bg-white/[0.07] border-white/5 hover:bg-white/10"
                    } transition-colors`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    {/* Time + Icon */}
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                      <MessageIcon type={msg.type} />
                      <span className="text-[10px] text-gray-500 font-mono">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-relaxed ${
                          msg.type === "result"
                            ? "text-primary font-bold"
                            : msg.type === "status"
                              ? "text-green-400 font-bold"
                              : "text-gray-200"
                        }`}
                      >
                        {msg.text}
                      </p>

                      {/* Photo */}
                      {msg.image_url && (
                        <div className="mt-2 rounded-lg overflow-hidden max-w-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={msg.image_url}
                            alt={msg.text}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
