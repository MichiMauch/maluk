import { NextResponse } from "next/server";
import { initTickerTables } from "@/lib/ticker";
import { turso } from "@/lib/turso";

// Batch endpoint: returns all race slugs that have recaps (messages or summaries)
export async function GET() {
  try {
    await initTickerTables();

    const [messagesResult, summariesResult] = await Promise.all([
      turso.execute("SELECT DISTINCT race_id FROM ticker_messages WHERE race_id IS NOT NULL"),
      turso.execute("SELECT race_id FROM race_summaries"),
    ]);

    const slugs = new Set<string>();
    for (const row of messagesResult.rows) {
      slugs.add(row.race_id as string);
    }
    for (const row of summariesResult.rows) {
      slugs.add(row.race_id as string);
    }

    return NextResponse.json(
      { slugs: Array.from(slugs) },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15" } }
    );
  } catch {
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
