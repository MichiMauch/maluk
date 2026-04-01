import { NextRequest, NextResponse } from "next/server";
import { getActiveRaceMessages, getActiveRace, getCurrentStatus, getTickerSponsor, initTickerTables } from "@/lib/ticker";
import { getCachedTickerResponse } from "@/lib/redis";
import { raceEvents2024, raceEvents2026 } from "@/data/calendar";
import { partners } from "@/data/partners";

const allEvents = [...raceEvents2024, ...raceEvents2026];

export async function GET(request: NextRequest) {
  try {
    await initTickerTables();

    const { searchParams } = request.nextUrl;
    const limit = Math.min(Math.max(1, Number(searchParams.get("limit") ?? 30)), 100);

    const data = await getCachedTickerResponse(async () => {
      const [messages, status, activeRaceId, tickerSponsorSlug] = await Promise.all([
        getActiveRaceMessages(limit),
        getCurrentStatus(),
        getActiveRace(),
        getTickerSponsor(),
      ]);

      const activeRaceName = activeRaceId
        ? allEvents.find((e) => e.slug.current === activeRaceId)?.name ?? activeRaceId
        : null;

      const tickerSponsor = tickerSponsorSlug
        ? partners.find((p) => p.slug.current === tickerSponsorSlug) ?? null
        : null;

      return {
        messages,
        status,
        activeRaceId,
        activeRaceName,
        tickerSponsor: tickerSponsor ? {
          name: tickerSponsor.name,
          logo: tickerSponsor.logo?.url ?? null,
          website: tickerSponsor.website ?? null,
          tier: tickerSponsor.tier,
        } : null,
      };
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
