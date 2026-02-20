"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type GamePhase = "idle" | "countdown" | "waiting" | "go" | "result" | "early";

interface ReactionGameProps {
  onResult?: (time: number) => void;
}

export function ReactionGame({ onResult }: ReactionGameProps) {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [activeLights, setActiveLights] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    setReactionTime(null);
    setActiveLights(0);
    setPhase("countdown");

    let lightCount = 0;

    // Lichter nacheinander einschalten (alle ~1.2 Sekunden)
    intervalRef.current = setInterval(() => {
      lightCount++;
      setActiveLights(lightCount);

      if (lightCount >= 5) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setPhase("waiting");

        // Random delay zwischen 2-4 Sekunden bevor Lichter ausgehen
        const delay = Math.random() * 2000 + 2000;

        timeoutRef.current = setTimeout(() => {
          startTimeRef.current = performance.now();
          setActiveLights(0);
          setPhase("go");
        }, delay);
      }
    }, 1200);
  }, [clearTimers]);

  const handleReaction = useCallback(() => {
    if (phase === "idle" || phase === "result" || phase === "early") {
      startGame();
      return;
    }

    if (phase === "countdown" || phase === "waiting") {
      // Zu früh gedrückt - Fehlstart!
      clearTimers();
      setPhase("early");
      return;
    }

    if (phase === "go") {
      const endTime = performance.now();
      const time = Math.round(endTime - startTimeRef.current);
      setReactionTime(time);
      setPhase("result");
      onResult?.(time);
      return;
    }
  }, [phase, startGame, clearTimers, onResult]);

  // Keyboard Event Listener für Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        handleReaction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleReaction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const getMessage = () => {
    switch (phase) {
      case "idle":
        return { title: "Startampel", subtitle: "Drücke SPACE zum Starten" };
      case "countdown":
      case "waiting":
        return { title: "Warte...", subtitle: "Nicht zu früh reagieren!" };
      case "go":
        return { title: "GO!", subtitle: "SPACE drücken!" };
      case "early":
        return { title: "Fehlstart!", subtitle: "Drücke SPACE für neuen Versuch" };
      case "result":
        return {
          title: `${reactionTime} ms`,
          subtitle: reactionTime
            ? reactionTime < 150
              ? "Unglaublich! Schneller als Lukas! 🏆"
              : reactionTime < 200
                ? "Weltklasse! Schaffst du unter 150ms?"
                : reactionTime < 250
                  ? "Ausgezeichnet! Knackst du die 200ms-Marke?"
                  : reactionTime < 300
                    ? "Gute Reaktion! Unter 250ms wäre Podium!"
                    : reactionTime < 400
                      ? "Solide! Da geht noch was – nochmal!"
                      : reactionTime < 500
                        ? "Nicht schlecht! Probiers nochmal, du wirst schneller!"
                        : "Aufwärmen ist vorbei – jetzt nochmal richtig!"
            : "Drücke SPACE für neuen Versuch",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const message = getMessage();

  return (
    <div className="space-y-6">
      {/* Startampel */}
      <motion.div
        className="relative bg-gray-900 rounded-2xl p-8 cursor-pointer border border-white/10 overflow-hidden"
        onClick={handleReaction}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background Image */}
        <Image
          src="/images/ampel.webp"
          alt=""
          fill
          className="object-cover opacity-15"
        />

        {/* Ampel-Gehäuse */}
        <div className="relative z-10 flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Licht-Gehäuse */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black border-4 border-gray-700 flex items-center justify-center">
                {/* Licht */}
                <motion.div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${
                    activeLights > index
                      ? "bg-red-600"
                      : "bg-gray-800"
                  }`}
                  animate={{
                    boxShadow: activeLights > index
                      ? "0 0 30px 10px rgba(220, 38, 38, 0.6), 0 0 60px 20px rgba(220, 38, 38, 0.3)"
                      : "none",
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 text-center"
          >
            {phase === "result" && reactionTime ? (
              <div className="text-5xl md:text-6xl font-black text-primary mb-2">
                {reactionTime}
                <span className="text-2xl md:text-3xl ml-1">ms</span>
              </div>
            ) : (
              <div className={`text-2xl md:text-3xl font-bold mb-2 ${
                phase === "go" ? "text-green-500" :
                phase === "early" ? "text-orange-500" :
                "text-white"
              }`}>
                {message.title}
              </div>
            )}
            <div className="text-gray-400 text-sm md:text-base">
              {message.subtitle}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Pro tip */}
      <p className="text-gray-500 text-xs text-center">
        Durchschnittliche Reaktionszeit: 200-250ms · Lukas: 180-195ms
      </p>
    </div>
  );
}
