// One-off: attach the Reitnau 2026 photos to the race recap.
//
// The Telegram live ticker was not used during this race, so no photo
// ticker_messages exist. The RaceRecapModal builds its gallery from
// ticker_messages with type "photo"/"video" and an image_url. Telegram photos
// are stored as base64 data URLs in image_url, so we do the same here: read the
// (already downsized) JPEGs, encode them as data URLs and insert one photo
// message per image with the race-day timestamp.
//
// Run AFTER resizing the originals into the scratchpad (see chat history).
//
// Usage:
//   npx tsx --env-file=.env.local scripts/save-reitnau-photos.ts

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const RACE_ID = "reitnau-2026";
const DIR =
  "/private/tmp/claude-501/-Users-michaelmauch-Documents-Development-maluk/d5fe051a-dea2-4155-9916-7b189515a608/scratchpad";

function dataUrl(file: string): string {
  const base64 = readFileSync(`${DIR}/${file}`).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

// created_at is stored naive-UTC and rendered in Europe/Zurich (+2 in summer).
const photos = [
  {
    file: "reitnau-fahrerlager.jpg",
    text: "Fahrerlageraufbau bei brütender Hitze — der Kadett steht unter dem Zeltdach bereit für den Tag.",
    createdAt: "2026-06-28 06:00:00",
  },
  {
    file: "reitnau-start.jpg",
    text: "Startaufstellung mit der Nummer 334 an der Bergstrasse — gleich geht es den Berg hoch.",
    createdAt: "2026-06-28 09:00:00",
  },
  {
    file: "reitnau-pokal.jpg",
    text: "Der Erinnerungspokal zum 57. Bergrennen Reitnau und die Laufkontrolle-Karte auf der Motorhaube.",
    createdAt: "2026-06-28 14:00:00",
  },
  {
    file: "reitnau-podest.jpg",
    text: "Rangverkündigung im Festzelt — Rang 6 in der Kategorie Interswiss bis 2 Liter.",
    createdAt: "2026-06-28 15:00:00",
  },
];

async function main() {
  const existing = await turso.execute({
    sql: "SELECT COUNT(*) as c FROM ticker_messages WHERE race_id = ? AND type = 'photo'",
    args: [RACE_ID],
  });
  if (Number(existing.rows[0].c) > 0) {
    console.error(
      `Es existieren bereits ${existing.rows[0].c} Foto-Nachrichten für ${RACE_ID} — Abbruch, um Duplikate zu vermeiden.`
    );
    process.exit(1);
  }

  for (const p of photos) {
    await turso.execute({
      sql: "INSERT INTO ticker_messages (text, image_url, type, race_id, created_at) VALUES (?, ?, 'photo', ?, ?)",
      args: [p.text, dataUrl(p.file), RACE_ID, p.createdAt],
    });
    console.log(`✅ ${p.file} → ${p.text}`);
  }

  console.log(`\n${photos.length} Fotos gespeichert für ${RACE_ID}.`);
}

main().catch((err) => {
  console.error("Fehler:", err);
  process.exit(1);
});
