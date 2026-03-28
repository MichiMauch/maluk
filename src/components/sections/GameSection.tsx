"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, MaterialIcon } from "@/components/ui";
import { Modal } from "@/components/ui/Modal";
import { ReactionGame } from "@/components/game/ReactionGame";
import { useGameStore } from "@/store/gameStore";
import { trackEvent } from "@/lib/tracking";

interface LeaderboardEntry {
  rank: number;
  name: string;
  time: number;
}

export function GameSection() {
  const { showCTA, setShowCTA, addScore } = useGameStore();
  const [rankingOpen, setRankingOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gameToken, setGameToken] = useState<string | null>(null);

  async function handleShare() {
    if (!lastResult) return;
    const text = `Ich habe ${lastResult}ms bei der MALUK Racing Startampel-Challenge geschafft! Kannst du das schlagen? 🏁`;
    const url = "https://malukracing.ch#challenge";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(`${text}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard?limit=10");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch {
      // Silently fail – hardcoded fallback not needed
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleGameStart = async () => {
    trackEvent("Game", "Start");
    try {
      const res = await fetch("/api/game-token", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setGameToken(data.token);
      }
    } catch {
      // Token fetch failed — user can still play, just can't submit
    }
  };

  const handleResult = (time: number) => {
    trackEvent("Game", "Result", undefined, time);
    setLastResult(time);
    setSubmitted(false);
    setPlayerName("");
    addScore(time);
  };

  const handleSubmit = async () => {
    if (!lastResult || !playerName.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName.trim(), time: lastResult, gameToken }),
      });
      if (res.ok) {
        trackEvent("Game", "Leaderboard-Submit", playerName.trim(), lastResult);
        setSubmitted(true);
        setLastResult(null);
        setGameToken(null);
        await fetchLeaderboard();
      }
    } catch {
      // Silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    setLastResult(null);
    setPlayerName("");
  };

  const top5 = leaderboard.slice(0, 5);

  return (
    <section id="challenge" className="w-full max-w-[1280px] px-4 md:px-10 py-8 overflow-hidden">
      <motion.div
        className="relative rounded-2xl overflow-hidden border-2 border-primary/40 neon-glow bg-gradient-to-br from-[#1a0f0a] to-[#0f0506]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full" />

        <div className="grid lg:grid-cols-2 gap-10 p-4 sm:p-8 md:p-12 relative z-10">
          {/* Left Column - Title, Description & Game */}
          <div className="space-y-6">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <MaterialIcon name="sports_motorsports" className="text-sm" filled />
              Reaktionstest
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-black italic text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              STARTAMPEL-
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pr-1">
                CHALLENGE
              </span>
            </motion.h2>

            <motion.p
              className="text-gray-300 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Bist du schneller als Lukas? Teste deine Reaktionszeit
              und kämpfe um einen Platz in der Bestenliste.
            </motion.p>

            {/* Game */}
            <AnimatePresence mode="wait">
              {showCTA ? (
                <motion.div
                  key="cta"
                  className="relative min-h-[300px] rounded-xl overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20 p-4 sm:p-8 flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <MaterialIcon
                    name="emoji_events"
                    className="text-6xl text-primary mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Starke Reflexe!
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-xs">
                    Du hast die Reaktionen eines Bergrennen-Piloten.
                    Bereit, das echte Team zu unterstützen?
                  </p>
                  <Button variant="gradient" className="mb-4" onClick={() => {
                    setShowCTA(false);
                    document.dispatchEvent(new CustomEvent("open-club100-modal"));
                  }}>
                    Member werden
                  </Button>
                  <button
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                    onClick={() => setShowCTA(false)}
                  >
                    Nochmal spielen
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="game"
                  className="relative rounded-xl overflow-hidden border border-white/5 bg-[#1a0f0a] p-3 sm:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ReactionGame onResult={handleResult} onGameStart={handleGameStart} />

                  {/* Name Entry */}
                  <AnimatePresence>
                    {lastResult && !submitted && (
                      <motion.div
                        className="relative mt-4 p-3 sm:p-4 rounded-lg border border-primary/20 bg-primary/5"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
                          onClick={handleSkip}
                          aria-label="Schliessen"
                        >
                          <MaterialIcon name="close" className="text-lg" />
                        </button>
                        <p className="text-sm text-gray-300 mb-3 pr-6">
                          <span className="text-primary font-bold">{lastResult} ms</span> — Trag dich in die Bestenliste ein!
                        </p>
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSubmit();
                              e.stopPropagation();
                            }}
                            onKeyUp={(e) => e.stopPropagation()}
                            placeholder="Dein Name"
                            maxLength={30}
                            className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50"
                          />
                          <Button
                            variant="primary"
                            size="md"
                            className="w-full"
                            onClick={handleSubmit}
                          >
                            {submitting ? "..." : "Eintragen"}
                          </Button>
                        </div>
                        <button
                          className="w-full mt-2 text-gray-400 text-sm hover:text-primary transition-colors flex items-center justify-center gap-2 py-2"
                          onClick={handleShare}
                        >
                          <MaterialIcon name="share" className="text-base" />
                          {copied ? "Kopiert!" : "Ergebnis teilen"}
                        </button>
                      </motion.div>
                    )}
                    {lastResult && submitted && (
                      <motion.div
                        className="mt-4 p-3 sm:p-4 rounded-lg border border-green-500/20 bg-green-500/5 flex items-center justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p className="text-sm text-gray-300">
                          <span className="text-green-400 font-bold">{lastResult}ms</span> eingetragen!
                        </p>
                        <button
                          className="text-gray-400 text-xs hover:text-primary transition-colors flex items-center gap-1"
                          onClick={handleShare}
                        >
                          <MaterialIcon name="share" className="text-sm" />
                          {copied ? "Kopiert!" : "Ergebnis teilen"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Highscore */}
          <div className="relative">
            <motion.div
              className="h-full rounded-xl border border-white/5 bg-[#1a0f0a] overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="emoji_events" className="text-primary" filled />
                  <span className="text-sm font-bold uppercase tracking-widest text-white">
                    Top 5 Bestenliste
                  </span>
                </div>
                <MaterialIcon name="leaderboard" className="text-sm text-gray-500" />
              </div>

              <ul className="flex-1">
                {top5.length === 0 ? (
                  <li className="px-5 py-8 text-center text-gray-500 text-sm">
                    Noch keine Einträge — sei der Erste!
                  </li>
                ) : (
                  top5.map((entry, index) => (
                    <motion.li
                      key={`${entry.rank}-${entry.name}-${entry.time}`}
                      className={`flex items-center gap-4 px-5 py-4 ${
                        index < top5.length - 1 ? "border-b border-white/5" : ""
                      }`}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      {/* Rank */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          entry.rank === 1
                            ? "bg-yellow-500/20 text-yellow-400"
                            : entry.rank === 2
                              ? "bg-gray-400/20 text-gray-300"
                              : entry.rank === 3
                                ? "bg-amber-700/20 text-amber-500"
                                : "bg-white/5 text-gray-500"
                        }`}
                      >
                        {entry.rank}
                      </div>

                      {/* Name */}
                      <span className="text-white font-medium flex-1">
                        {entry.name}
                      </span>

                      {/* Time */}
                      <span
                        className={`font-mono font-bold text-lg ${
                          entry.rank === 1 ? "text-primary" : "text-gray-400"
                        }`}
                      >
                        {entry.time}
                        <span className="text-xs ml-0.5">ms</span>
                      </span>
                    </motion.li>
                  ))
                )}
              </ul>

              <div className="px-5 py-4 border-t border-white/5">
                <Button
                  variant="outline"
                  size="sm"
                  icon="leaderboard"
                  onClick={() => setRankingOpen(true)}
                  className="w-full"
                >
                  Rangliste
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Modal open={rankingOpen} onClose={() => setRankingOpen(false)}>
        <div className="flex items-center gap-2 mb-6">
          <MaterialIcon name="emoji_events" className="text-primary text-2xl" filled />
          <h3 className="text-white text-xl font-bold">Rangliste</h3>
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Noch keine Eintr&auml;ge &mdash; sei der Erste!
          </p>
        ) : (
          <>
            {/* Podium Top 3 */}
            {leaderboard.length >= 3 && (
              <div className="flex items-end justify-center gap-2 sm:gap-4 mb-6">
                {/* 2. Platz — links */}
                <div className="flex flex-col items-center flex-1">
                  <p className="text-white text-sm font-medium text-center truncate w-full">{leaderboard[1].name}</p>
                  <p className="text-gray-400 font-mono text-xs mb-2">{leaderboard[1].time}<span className="text-[10px] ml-0.5">ms</span></p>
                  <div className="relative w-full h-16 bg-gradient-to-t from-gray-400/10 to-gray-400/30 rounded-t-lg border border-gray-400/20 border-b-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gray-400/20 flex items-center justify-center text-gray-300 font-bold text-sm">2</div>
                  </div>
                </div>
                {/* 1. Platz — Mitte */}
                <div className="flex flex-col items-center flex-1">
                  <MaterialIcon name="emoji_events" className="text-primary text-2xl mb-1" filled />
                  <p className="text-white text-sm font-bold text-center truncate w-full">{leaderboard[0].name}</p>
                  <p className="text-primary font-mono text-sm font-bold mb-2">{leaderboard[0].time}<span className="text-xs ml-0.5">ms</span></p>
                  <div className="relative w-full h-24 bg-gradient-to-t from-yellow-500/10 to-yellow-500/30 rounded-t-lg border border-yellow-500/20 border-b-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">1</div>
                  </div>
                </div>
                {/* 3. Platz — rechts */}
                <div className="flex flex-col items-center flex-1">
                  <p className="text-white text-sm font-medium text-center truncate w-full">{leaderboard[2].name}</p>
                  <p className="text-gray-400 font-mono text-xs mb-2">{leaderboard[2].time}<span className="text-[10px] ml-0.5">ms</span></p>
                  <div className="relative w-full h-12 bg-gradient-to-t from-amber-700/10 to-amber-700/30 rounded-t-lg border border-amber-700/20 border-b-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-amber-700/20 flex items-center justify-center text-amber-500 font-bold text-sm">3</div>
                  </div>
                </div>
              </div>
            )}

            {/* Rest ab Platz 4 */}
            {leaderboard.length > 3 && (
              <ul className="border-t border-white/10">
                {leaderboard.slice(3).map((entry, index) => (
                  <li
                    key={`${entry.rank}-${entry.name}-${entry.time}`}
                    className={`flex items-center gap-4 px-4 py-3 ${
                      index < leaderboard.length - 4 ? "border-b border-white/5" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                      {entry.rank}
                    </div>
                    <span className="text-white font-medium flex-1">{entry.name}</span>
                    <span className="font-mono font-bold text-lg text-gray-400">
                      {entry.time}
                      <span className="text-xs ml-0.5">ms</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Modal>
    </section>
  );
}
