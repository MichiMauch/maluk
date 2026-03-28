"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { MaterialIcon } from "@/components/ui";
import { trackEvent } from "@/lib/tracking";
import type { TickerMessage } from "@/lib/ticker";

interface RaceRecapModalProps {
  open: boolean;
  onClose: () => void;
  raceSlug: string;
  raceName: string;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr + "Z");
  return date.toLocaleTimeString("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Zurich",
  });
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "Z");
  return date.toLocaleDateString("de-CH", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Zurich",
  });
}

function MessageIcon({ type }: { type: string }) {
  switch (type) {
    case "photo":
      return <MaterialIcon name="photo_camera" className="text-primary text-sm" filled />;
    case "result":
      return <MaterialIcon name="emoji_events" className="text-primary text-sm" filled />;
    case "status":
      return <MaterialIcon name="flag" className="text-accent text-sm" filled />;
    default:
      return <MaterialIcon name="chat" className="text-primary text-sm" filled />;
  }
}

export function RaceRecapModal({ open, onClose, raceSlug, raceName }: RaceRecapModalProps) {
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    trackEvent("RaceRecap", "View", raceName);

    fetch(`/api/race-recap?race=${encodeURIComponent(raceSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages ?? []);
        setSummary(data.summary ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, raceSlug, raceName]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <MaterialIcon name="sports_motorsports" className="text-sm" filled />
            Rennbericht
          </div>
          <h3 className="text-2xl font-black italic text-white pt-1">{raceName}</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* AI Summary */}
            {summary && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-primary text-sm font-bold mb-3">
                  <MaterialIcon name="auto_awesome" className="text-base" filled />
                  Zusammenfassung
                </div>
                <div
                  className="text-gray-200 text-sm leading-relaxed whitespace-pre-line [&>strong]:text-white [&>strong]:font-bold [&>strong]:text-base [&>strong]:block [&>strong]:mb-2"
                  dangerouslySetInnerHTML={{
                    __html: summary
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            )}

            {/* Timeline */}
            {messages.length > 0 && (
              <div>
                <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-3">
                  Live-Ticker Verlauf
                </h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                      // Show date header for first message or when date changes
                      const prevDate = index > 0 ? formatDate(messages[index - 1].created_at) : null;
                      const currentDate = formatDate(msg.created_at);
                      const showDate = currentDate !== prevDate;

                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest text-center py-2">
                              {currentDate}
                            </p>
                          )}
                          <motion.div
                            className={`flex gap-3 p-3 rounded-lg border ${
                              msg.type === "result"
                                ? "bg-primary/10 border-primary/20"
                                : msg.type === "status"
                                  ? "bg-accent/10 border-accent/20"
                                  : "bg-white/5 border-white/5"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.02 }}
                          >
                            <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                              <MessageIcon type={msg.type} />
                              <span className="text-[10px] text-gray-500 font-mono">
                                {formatTime(msg.created_at)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm leading-relaxed ${
                                  msg.type === "result"
                                    ? "text-primary font-bold"
                                    : msg.type === "status"
                                      ? "text-accent font-bold"
                                      : "text-gray-200"
                                }`}
                              >
                                {msg.text}
                              </p>
                              {msg.image_url && (
                                <div className="mt-2 rounded-lg overflow-hidden max-w-xs">
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
                        </div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {messages.length === 0 && !summary && (
              <p className="text-gray-500 text-sm text-center py-8">
                Noch kein Rennbericht vorhanden.
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
