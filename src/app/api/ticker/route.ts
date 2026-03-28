import { NextRequest, NextResponse } from "next/server";
import { getTickerMessages, getCurrentStatus, initTickerTables } from "@/lib/ticker";

export async function GET(request: NextRequest) {
  try {
    await initTickerTables();

    const { searchParams } = request.nextUrl;
    const limit = Math.min(Math.max(1, Number(searchParams.get("limit") ?? 30)), 100);

    const [messages, status] = await Promise.all([
      getTickerMessages(limit),
      getCurrentStatus(),
    ]);

    return NextResponse.json(
      { messages, status },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
