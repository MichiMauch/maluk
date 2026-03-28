"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-obsidian">
      <div className="text-center max-w-md">
        <div className="text-6xl font-black text-primary mb-4">BOXENSTOPP</div>
        <p className="text-gray-300 text-lg mb-8">
          Da ist etwas schiefgelaufen. Unser Team arbeitet daran.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Nochmal versuchen
        </button>
      </div>
    </div>
  );
}
