import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const RACE_ID = "slalom-frauenfeld-2026";

async function main() {
  const msgs = await turso.execute({
    sql: "SELECT COUNT(*) as c FROM ticker_messages WHERE race_id = ?",
    args: [RACE_ID],
  });
  const sum = await turso.execute({
    sql: "SELECT COUNT(*) as c FROM race_summaries WHERE race_id = ?",
    args: [RACE_ID],
  });
  console.log(`Found ${msgs.rows[0].c} ticker_messages and ${sum.rows[0].c} race_summaries for ${RACE_ID}`);

  const delMsgs = await turso.execute({
    sql: "DELETE FROM ticker_messages WHERE race_id = ?",
    args: [RACE_ID],
  });
  const delSum = await turso.execute({
    sql: "DELETE FROM race_summaries WHERE race_id = ?",
    args: [RACE_ID],
  });
  console.log(`Deleted ${delMsgs.rowsAffected} ticker_messages and ${delSum.rowsAffected} race_summaries`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
