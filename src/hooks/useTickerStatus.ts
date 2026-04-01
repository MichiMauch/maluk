"use client";

import { useState, useEffect, useCallback } from "react";
import type { RaceStatus } from "@/lib/ticker";

interface TickerStatus {
  isLive: boolean;
  status: RaceStatus | null;
  activeRaceName: string | null;
  refresh: () => void;
}

export function useTickerStatus(): TickerStatus {
  const [status, setStatus] = useState<RaceStatus | null>(null);
  const [activeRaceName, setActiveRaceName] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/ticker?limit=1");
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        setActiveRaceName(data.activeRaceName);
      }
    } catch {
      // Silently fail
    } finally {
      setChecked(true);
    }
  }, []);

  // Single check on mount — no polling
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    isLive: checked && (status === "live" || status === "pause"),
    status,
    activeRaceName,
    refresh,
  };
}
