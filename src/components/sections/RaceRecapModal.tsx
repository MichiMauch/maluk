"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Modal } from "@/components/ui/Modal";
import { MaterialIcon, MessageIcon } from "@/components/ui";
import { trackEvent } from "@/lib/tracking";
import { escapeHtml } from "@/lib/sanitize";
import { formatTickerTime, formatTickerDate } from "@/lib/formatting";
import type { TickerMessage } from "@/lib/ticker";

interface MediaItem {
  id: number;
  url: string;
  type: "photo" | "video";
  caption: string;
}

interface RaceRecapModalProps {
  open: boolean;
  onClose: () => void;
  raceSlug: string;
  raceName: string;
}

function MediaLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: {
  items: MediaItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const touchStartX = useRef(0);
  const item = items[activeIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((activeIndex + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((activeIndex - 1 + items.length) % items.length);
    },
    [activeIndex, items.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!item) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] bg-black/95"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white z-20"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      {/* Prev/Next */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate((activeIndex - 1 + items.length) % items.length); }}
            className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white z-20"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate((activeIndex + 1) % items.length); }}
            className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white z-20"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
          </button>
        </>
      )}

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-16 py-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 50) onNavigate(delta > 0 ? (activeIndex + 1) % items.length : (activeIndex - 1 + items.length) % items.length);
        }}
      >
        <motion.div
          key={item.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {item.type === "video" ? (
            <video
              src={item.url}
              controls
              autoPlay
              playsInline
              className="max-h-[80vh] max-w-full rounded-lg"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.caption}
              className="max-h-[80vh] max-w-full rounded-lg"
            />
          )}
        </motion.div>
        <p className="text-center text-gray-400 text-sm mt-2">
          {item.caption}
          <span className="text-gray-600 ml-2">{activeIndex + 1} / {items.length}</span>
        </p>
      </div>
    </motion.div>,
    document.body
  );
}

export function RaceRecapModal({ open, onClose, raceSlug, raceName }: RaceRecapModalProps) {
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
                    __html: escapeHtml(summary)
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            )}

            {/* Media Gallery */}
            {(() => {
              const allMedia: MediaItem[] = messages
                .filter((m) => m.image_url && (m.type === "photo" || m.type === "video"))
                .map((m) => ({ id: m.id, url: m.image_url!, type: m.type as "photo" | "video", caption: m.text }));
              if (allMedia.length === 0) return null;

              const teamMedia = allMedia.filter((m) => {
                const msg = messages.find((msg) => msg.id === m.id);
                return msg && !msg.is_fan;
              });
              const fanMedia = allMedia.filter((m) => {
                const msg = messages.find((msg) => msg.id === m.id);
                return msg?.is_fan;
              });

              const renderGallery = (items: MediaItem[], indexOffset: number) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {items.map((m) => {
                    const globalIndex = allMedia.findIndex((am) => am.id === m.id);
                    return (
                      <button
                        key={m.id}
                        className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setLightboxIndex(globalIndex)}
                      >
                        {m.type === "video" ? (
                          <video
                            src={m.url}
                            playsInline
                            muted
                            className="w-full h-auto rounded-lg aspect-video object-cover pointer-events-none"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.url}
                            alt={m.caption}
                            className="w-full h-auto rounded-lg aspect-video object-cover"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              );

              return (
                <div className="space-y-6">
                  {teamMedia.length > 0 && (
                    <div>
                      <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-3">
                        Impressionen
                      </h4>
                      {renderGallery(teamMedia, 0)}
                    </div>
                  )}
                  {fanMedia.length > 0 && (
                    <div>
                      <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-3">
                        <MaterialIcon name="groups" className="text-base mr-1" filled />
                        Fan-Galerie
                      </h4>
                      {renderGallery(fanMedia, teamMedia.length)}
                    </div>
                  )}

                  {/* Lightbox */}
                  <AnimatePresence>
                    {lightboxIndex !== null && (
                      <MediaLightbox
                        items={allMedia}
                        activeIndex={lightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                        onNavigate={setLightboxIndex}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

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
                      const prevDate = index > 0 ? formatTickerDate(messages[index - 1].created_at) : null;
                      const currentDate = formatTickerDate(msg.created_at);
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
                              msg.is_fan
                                ? "bg-cyan-500/10 border-cyan-500/20"
                                : msg.type === "result"
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
                              <MessageIcon type={msg.type} isFan={msg.is_fan} />
                              <span className="text-[10px] text-gray-500 font-mono">
                                {formatTickerTime(msg.created_at)}
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
                              {msg.image_url && (msg.type === "video" || msg.type === "photo") ? (() => {
                                const allMedia: MediaItem[] = messages
                                  .filter((m) => m.image_url && (m.type === "photo" || m.type === "video"))
                                  .map((m) => ({ id: m.id, url: m.image_url!, type: m.type as "photo" | "video", caption: m.text }));
                                const mediaIdx = allMedia.findIndex((m) => m.id === msg.id);
                                return (
                                  <button
                                    className="mt-2 rounded-lg overflow-hidden max-w-xs cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setLightboxIndex(mediaIdx >= 0 ? mediaIdx : 0)}
                                  >
                                    {msg.type === "video" ? (
                                      <video src={msg.image_url!} playsInline muted className="w-full h-auto rounded-lg pointer-events-none" />
                                    ) : (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={msg.image_url!} alt={msg.text} className="w-full h-auto rounded-lg" />
                                    )}
                                  </button>
                                );
                              })() : null}
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
