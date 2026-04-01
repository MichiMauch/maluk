import { NextRequest, NextResponse } from "next/server";
import { getActiveRaceMessages, getActiveRace, getCurrentStatus, initTickerTables } from "@/lib/ticker";
import { getCachedTickerResponse } from "@/lib/redis";
import { raceEvents2024, raceEvents2026 } from "@/data/calendar";

const allEvents = [...raceEvents2024, ...raceEvents2026];

export async function GET(request: NextRequest) {
  try {
    await initTickerTables();

    const { searchParams } = request.nextUrl;
    const limit = Math.min(Math.max(1, Number(searchParams.get("limit") ?? 30)), 100);

    const data = await getCachedTickerResponse(async () => {
      const [messages, status, activeRaceId] = await Promise.all([
        getActiveRaceMessages(limit),
        getCurrentStatus(),
        getActiveRace(),
      ]);

      const activeRaceName = activeRaceId
        ? allEvents.find((e) => e.slug.current === activeRaceId)?.name ?? activeRaceId
        : null;

      return { messages, status, activeRaceId, activeRaceName };
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5",
      },
    });
  } catch {
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
