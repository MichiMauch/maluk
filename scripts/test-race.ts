import { createClient } from "@libsql/client";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const RACE_ID = "r-2026";
const RACE_NAME = "Testrennen";

async function initTables() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS ticker_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      image_url TEXT,
      type TEXT NOT NULL DEFAULT 'text',
      race_status TEXT,
      race_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS race_summaries (
      race_id TEXT PRIMARY KEY,
      summary TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  try {
    await turso.execute("ALTER TABLE ticker_messages ADD COLUMN race_id TEXT");
  } catch {
    // already exists
  }
}

async function addMessage(text: string, type: string, raceStatus?: string) {
  await turso.execute({
    sql: "INSERT INTO ticker_messages (text, type, race_status, race_id) VALUES (?, ?, ?, ?)",
    args: [text, type, raceStatus ?? null, RACE_ID],
  });
  console.log(`  ✅ ${type}: ${text}`);
}

async function run() {
  console.log("\n🏁 Test-Rennen Simulation\n");
  console.log("--- Tabellen initialisieren ---");
  await initTables();

  // Clean up previous test data
  await turso.execute({ sql: "DELETE FROM ticker_messages WHERE race_id = ?", args: [RACE_ID] });
  await turso.execute({ sql: "DELETE FROM race_summaries WHERE race_id = ?", args: [RACE_ID] });
  console.log("  Alte Testdaten gelöscht\n");

  console.log("--- Rennen starten ---");
  await addMessage(`🏎 ${RACE_NAME} — Ticker gestartet`, "status", "live");

  console.log("\n--- Nachrichten simulieren ---");
  await addMessage("Aufwärmen abgeschlossen, das Auto läuft perfekt heute!", "text");
  await addMessage("🟢 Rennen läuft!", "status", "live");
  await addMessage("Erster Lauf, Lukas gibt alles! Die Strecke ist trocken.", "text");
  await addMessage("🏆 Ergebnis: P2 1:48.32 Kategorie E1", "result");
  await addMessage("Kurze Pause, Reifen werden gewechselt.", "text");
  await addMessage("🟡 Rennpause", "status", "pause");
  await addMessage("🟢 Rennen läuft!", "status", "live");
  await addMessage("Zweiter Lauf! Lukas verbessert seine Zeit deutlich.", "text");
  await addMessage("🏆 Ergebnis: P1 1:43.87 Kategorie E1 — Bestzeit!", "result");
  await addMessage("Unglaublich! Tagesbestzeit in der Kategorie!", "text");
  await addMessage("🏁 Renntag beendet", "status", "ende");

  console.log("\n--- Nachrichten abrufen ---");
  const result = await turso.execute({
    sql: "SELECT id, text, type, race_status, created_at FROM ticker_messages WHERE race_id = ? ORDER BY created_at ASC",
    args: [RACE_ID],
  });
  console.log(`  ${result.rows.length} Nachrichten für ${RACE_NAME}\n`);

  console.log("--- AI-Zusammenfassung generieren ---");
  const messages = result.rows.map((row) => ({
    text: row.text as string,
    type: row.type as string,
    created_at: row.created_at as string,
  }));

  const transcript = messages
    .map((msg) => {
      const prefix =
        msg.type === "result" ? "[ERGEBNIS]" :
        msg.type === "status" ? "[STATUS]" :
        "";
      return `${prefix} ${msg.text}`.trim();
    })
    .join("\n");

  console.log("\nTranscript:\n" + transcript + "\n");

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Du bist der Texter für MALUK Racing, das Bergrennen-Team von Lukas Maurer mit seinem Opel Kadett C GT/E in der Schweiz.

Erstelle aus dem folgenden Live-Ticker-Verlauf einen packenden, kurzen Rennbericht (3-5 Absätze) auf Deutsch. Schreibe in der dritten Person über Lukas/MALUK Racing. Der Bericht soll die Highlights, Ergebnisse und die Atmosphäre einfangen.

Rennen: ${RACE_NAME}

Live-Ticker-Verlauf:
${transcript}

Schreibe nur den Rennbericht, keine Einleitung oder Meta-Kommentare.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const summary = textBlock && textBlock.type === "text" ? textBlock.text : "Keine Zusammenfassung";

  console.log("--- RENNBERICHT ---\n");
  console.log(summary);
  console.log("\n--- Ende ---\n");

  // Save summary
  await turso.execute({
    sql: "INSERT OR REPLACE INTO race_summaries (race_id, summary) VALUES (?, ?)",
    args: [RACE_ID, summary],
  });
  console.log("✅ Zusammenfassung in DB gespeichert\n");
}

run().catch(console.error);
