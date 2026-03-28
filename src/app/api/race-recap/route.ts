import { NextRequest, NextResponse } from "next/server";
import { getMessagesByRace, getSummary, initTickerTables } from "@/lib/ticker";
import { raceEvents2024, raceEvents2026 } from "@/data/calendar";

const validSlugs = new Set(
  [...raceEvents2024, ...raceEvents2026].map((e) => e.slug.current)
);

export async function GET(request: NextRequest) {
  try {
    const raceId = request.nextUrl.searchParams.get("race");
    if (!raceId) {
      return NextResponse.json({ error: "race parameter required" }, { status: 400 });
    }

    if (!validSlugs.has(raceId)) {
      return NextResponse.json({ error: "Unknown race" }, { status: 400 });
    }

    await initTickerTables();

    const [messages, summary] = await Promise.all([
      getMessagesByRace(raceId),
      getSummary(raceId),
    ]);

    return NextResponse.json(
      {
        messages,
        summary: summary?.summary ?? null,
        hasRecap: messages.length > 0 || summary !== null,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
