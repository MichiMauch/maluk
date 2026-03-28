import Anthropic from "@anthropic-ai/sdk";
import type { TickerMessage } from "./ticker";

export async function generateRaceSummary(
  messages: TickerMessage[],
  raceName: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }

  const client = new Anthropic({ apiKey });

  // Build a chronological transcript of the race
  const transcript = messages
    .map((msg) => {
      const time = new Date(msg.created_at + "Z").toLocaleTimeString("de-CH", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Zurich",
      });
      const prefix =
        msg.type === "result"
          ? "[ERGEBNIS]"
          : msg.type === "status"
            ? "[STATUS]"
            : msg.type === "photo"
              ? "[FOTO]"
              : "";
      return `${time} ${prefix} ${msg.text}`.trim();
    })
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Du bist der Texter für MALUK Racing, das Bergrennen-Team von Lukas Maurer mit seinem Opel Kadett C GT/E in der Schweiz.

Erstelle aus dem folgenden Live-Ticker-Verlauf einen packenden, kurzen Rennbericht (3-5 Absätze) auf Deutsch. Schreibe in der dritten Person über Lukas/MALUK Racing. Der Bericht soll die Highlights, Ergebnisse und die Atmosphäre einfangen.

Rennen: ${raceName}

Live-Ticker-Verlauf:
${transcript}

Schreibe nur den Rennbericht, keine Einleitung oder Meta-Kommentare.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}
