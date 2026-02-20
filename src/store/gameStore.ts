import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameScore {
  time: number; // in milliseconds
  date: string;
}

interface GameState {
  highScores: GameScore[];
  bestTime: number | null;
  gamesPlayed: number;
  showCTA: boolean;
  addScore: (time: number) => void;
  resetScores: () => void;
  setShowCTA: (show: boolean) => void;
}

const MAX_SCORES = 10;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      highScores: [],
      bestTime: null,
      gamesPlayed: 0,
      showCTA: false,

      addScore: (time: number) => {
        const newScore: GameScore = {
          time,
          date: new Date().toISOString(),
        };

        const updatedScores = [...get().highScores, newScore]
          .sort((a, b) => a.time - b.time)
          .slice(0, MAX_SCORES);

        const newBestTime =
          updatedScores.length > 0 ? updatedScores[0].time : null;
        const newGamesPlayed = get().gamesPlayed + 1;

        // Show CTA after first game
        const shouldShowCTA = newGamesPlayed >= 1;

        set({
          highScores: updatedScores,
          bestTime: newBestTime,
          gamesPlayed: newGamesPlayed,
          showCTA: shouldShowCTA,
        });
      },

      resetScores: () => {
        set({
          highScores: [],
          bestTime: null,
          gamesPlayed: 0,
          showCTA: false,
        });
      },

      setShowCTA: (show: boolean) => {
        set({ showCTA: show });
      },
    }),
    {
      name: "maluk-game-storage",
    }
  )
);
