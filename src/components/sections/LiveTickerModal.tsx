"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, MaterialIcon, MessageIcon } from "@/components/ui";
import { trackEvent } from "@/lib/tracking";
import { formatTickerTime } from "@/lib/formatting";
import type { TickerMessage, RaceStatus } from "@/lib/ticker";

const POLL_INTERVAL = 15_000;

function StatusBadge({ status }: { status: RaceStatus | null }) {
  if (!status || status === "ende") return null;

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            status === "live" ? "bg-red-500" : "bg-yellow-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${
            status === "live" ? "bg-red-500" : "bg-yellow-500"
          }`}
        />
      </span>
      <span
        className={`text-xs font-bold uppercase tracking-widest ${
          status === "live" ? "text-red-400" : "text-yellow-400"
        }`}
      >
        {status === "live" ? "Live" : "Pause"}
      </span>
    </div>
  );
}

interface LiveTickerModalProps {
  open: boolean;
  onClose: () => void;
}

export function LiveTickerModal({ open, onClose }: LiveTickerModalProps) {
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [status, setStatus] = useState<RaceStatus | null>(null);
  const [raceName, setRaceName] = useState<string | null>(null);
  const [tickerSponsor, setTickerSponsor] = useState<{ name: string; logo: string | null; website: string | null; tier: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTracked, setHasTracked] = useState(false);

  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch("/api/ticker?limit=30");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setStatus(data.status);
        setRaceName(data.activeRaceName);
        setTickerSponsor(data.tickerSponsor ?? null);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Only poll when modal is open
  useEffect(() => {
    if (!open) return;
    fetchTicker();
    const interval = setInterval(fetchTicker, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [open, fetchTicker]);

  useEffect(() => {
    if (open && messages.length > 0 && !hasTracked) {
      trackEvent("Ticker", "View");
      setHasTracked(true);
    }
  }, [open, messages, hasTracked]);

  return (
    <Modal open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pr-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
          <MaterialIcon name="cell_tower" className="text-sm" filled />
          Live Ticker
        </div>
        <StatusBadge status={status} />
      </div>

      {raceName && (
        <p className="text-white/60 text-sm mb-4">{raceName}</p>
      )}

      {/* Ticker Sponsor Banner - Top */}
      {tickerSponsor && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5 mb-4">
          {tickerSponsor.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tickerSponsor.logo} alt={tickerSponsor.name} className="h-8 w-auto object-contain shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs">
              Dieser Ticker wird präsentiert von{" "}
              {tickerSponsor.website ? (
                <a href={tickerSponsor.website} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                  {tickerSponsor.name}
                </a>
              ) : (
                <span className="text-primary font-bold">{tickerSponsor.name}</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <p className="text-white/40 text-sm text-center py-8">Keine Ticker-Meldungen vorhanden.</p>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className={`flex gap-3 p-3 rounded-xl border ${
                  msg.type === "sponsor"
                    ? "bg-[#0a2a1a] border-emerald-500/30"
                    : msg.is_fan
                      ? "bg-[#0a2a2a] border-cyan-500/30"
                      : msg.type === "result"
                        ? "bg-[#3a2d00] border-primary/40"
                        : msg.type === "status"
                          ? "bg-[#2a1010] border-accent/40"
                          : "bg-[#403520] border-primary/25"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                  <MessageIcon type={msg.type} size="text-base" isFan={msg.is_fan} />
                  <span className="text-[10px] text-primary/60 font-mono font-bold">
                    {formatTickerTime(msg.created_at)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  {(() => {
                    // Parse sponsor metadata from text
                    const sponsorMatch = msg.text.match(/^\{\{sponsor:(.*?)\}\}([\s\S]*)$/);
                    const sponsorUrl = sponsorMatch?.[1];
                    const displayText = sponsorMatch ? sponsorMatch[2] : msg.text;

                    return (
                      <p
                        className={`text-sm leading-relaxed ${
                          msg.type === "sponsor"
                            ? "text-emerald-300 font-bold"
                            : msg.type === "result"
                              ? "text-primary font-bold"
                              : msg.type === "status"
                                ? "text-accent font-bold"
                                : "text-white"
                        }`}
                      >
                        {displayText}
                        {msg.type === "sponsor" && msg.image_url && sponsorUrl && (
                          <a href={sponsorUrl} target="_blank" rel="noopener noreferrer" className="block mt-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={msg.image_url} alt={displayText} className="h-10 w-auto object-contain rounded opacity-90 hover:opacity-100 transition-opacity" />
                          </a>
                        )}
                      </p>
                    );
                  })()}

                  {msg.type !== "sponsor" && msg.image_url && msg.type === "video" ? (
                    <div className="mt-2 rounded-lg overflow-hidden max-w-sm">
                      <video
                        src={msg.image_url}
                        controls
                        playsInline
                        muted
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ) : msg.type !== "sponsor" && msg.image_url ? (
                    <div className="mt-2 rounded-lg overflow-hidden max-w-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={msg.image_url}
                        alt={msg.text}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Ticker Sponsor Banner - Bottom */}
      {tickerSponsor && !loading && messages.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5 mt-4">
          {tickerSponsor.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tickerSponsor.logo} alt={tickerSponsor.name} className="h-8 w-auto object-contain shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs">
              Dieser Ticker wird präsentiert von{" "}
              {tickerSponsor.website ? (
                <a href={tickerSponsor.website} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                  {tickerSponsor.name}
                </a>
              ) : (
                <span className="text-primary font-bold">{tickerSponsor.name}</span>
              )}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
