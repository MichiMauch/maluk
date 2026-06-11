// One-off: rewrite existing race summaries from third person into first
// person (Lukas's perspective), matching the new prompt in src/lib/ai-summary.ts.
// Writes a backup of the originals to scripts/backups/ before updating.
//
// Run with: npx tsx --env-file=.env.local scripts/rewrite-recaps-first-person.ts

import { createClient } from "@libsql/client";
import Anthropic from "@anthropic-ai/sdk";
import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

async function rewriteToFirstPerson(summary: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Der folgende Rennbericht von MALUK Racing (Bergrennen-Team von Lukas Maurer mit seinem Opel Kadett C GT/E) ist in der dritten Person geschrieben. Schreibe ihn in die Ich-Form aus der Sicht von Lukas, dem Fahrer, um (z.B. "Ich bin am Morgen...", "mein Kadett..."). MALUK Racing oder das Team kannst du als "wir" erwähnen.

Wichtig:
- Alle Fakten, Zeiten, Ergebnisse und die Absatzstruktur exakt beibehalten.
- Formatierung (Titel, Markdown) beibehalten.
- Schweizer Hochdeutsch: NIEMALS das scharfe S (ß) — immer "ss" (z.B. "grosse", "Strasse").
- Gib nur den umgeschriebenen Bericht aus, keine Einleitung oder Meta-Kommentare.

Bericht:
${summary}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }
  return textBlock.text;
}

async function main() {
  const res = await turso.execute(
    "SELECT race_id, summary FROM race_summaries"
  );

  // Backup originals before touching anything
  const backupDir = resolve(__dirname, "backups");
  mkdirSync(backupDir, { recursive: true });
  const backupPath = resolve(backupDir, "race-summaries-third-person.json");
  writeFileSync(
    backupPath,
    JSON.stringify(
      res.rows.map((r) => ({ race_id: r.race_id, summary: r.summary })),
      null,
      2
    )
  );
  console.log(`Backup written to ${backupPath}\n`);

  for (const row of res.rows) {
    const raceId = row.race_id as string;
    const original = row.summary as string;
    console.log(`Rewriting ${raceId} ...`);

    const rewritten = await rewriteToFirstPerson(original);

    await turso.execute({
      sql: "UPDATE race_summaries SET summary = ? WHERE race_id = ?",
      args: [rewritten, raceId],
    });

    console.log(`--- ${raceId} (neu) ---`);
    console.log(rewritten);
    console.log();
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
