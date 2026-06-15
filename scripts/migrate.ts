import { createClient } from "@libsql/client";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("TURSO_DATABASE_URL is required");
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const migrationsDir = join(__dirname, "..", "drizzle");

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`Found ${files.length} migration(s)`);

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf-8");
    const statements = sql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    console.log(`Applying ${file} (${statements.length} statement(s))...`);

    for (const statement of statements) {
      try {
        await client.execute(statement);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("already exists")) {
          console.log(`  Skipped (already exists)`);
        } else {
          console.error(`  Error: ${msg}`);
          process.exit(1);
        }
      }
    }

    console.log(`  ✓ ${file} applied`);
  }

  console.log("All migrations applied.");
}

main();
