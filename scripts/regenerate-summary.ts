// Regenerate (or create) the AI race report for an already-finished race.
//
// The ticker messages stay in the DB keyed by race slug even after the race is
// ended, so a report can always be (re)built afterwards — e.g. when the live
// "/rennen ende" summary failed (model 404, network blip, etc.).
//
// Usage:
//   npx tsx --env-file=.env.local scripts/regenerate-summary.ts <race-slug>
//
// Example (the race from the failed run):
//   npx tsx --env-file=.env.local scripts/regenerate-summary.ts la-roche-la-berra-2026

import { generateRaceSummary } from "../src/lib/ai-summary";
import { getMessagesByRace, saveSummary } from "../src/lib/ticker";
import { raceEvents2024, raceEvents2026 } from "../src/data/calendar";

const allEvents = [...raceEvents2024, ...raceEvents2026];

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: regenerate-summary.ts <race-slug>");
    process.exit(1);
  }

  const event = allEvents.find((e) => e.slug.current === slug);
  const raceName = event?.name ?? slug;

  console.log(`Lade Nachrichten für ${raceName} (${slug})...`);
  const messages = await getMessagesByRace(slug);
  if (messages.length === 0) {
    console.error(`Keine Nachrichten für "${slug}" gefunden — nichts zu generieren.`);
    process.exit(1);
  }
  console.log(`${messages.length} Nachrichten gefunden. Erstelle Rennbericht...`);

  const summary = await generateRaceSummary(messages, raceName);
  await saveSummary(slug, summary);

  console.log(`\n✅ Rennbericht gespeichert für ${raceName}:\n`);
  console.log(summary);
}

main().catch((err) => {
  console.error("Fehler:", err);
  process.exit(1);
});
