import { NextRequest, NextResponse } from "next/server";
import { getMessagesByRace, getSummary, initTickerTables } from "@/lib/ticker";

export async function GET(request: NextRequest) {
  try {
    await initTickerTables();

    const raceId = request.nextUrl.searchParams.get("race");
    if (!raceId) {
      return NextResponse.json({ error: "race parameter required" }, { status: 400 });
    }

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
