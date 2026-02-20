import { NextRequest, NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limitParam = Number(searchParams.get("limit") ?? 10);
  const limit = Math.min(Math.max(1, limitParam), 50);

  const result = await turso.execute({
    sql: "SELECT id, name, time, created_at FROM leaderboard ORDER BY time ASC, created_at ASC LIMIT ?",
    args: [limit],
  });

  const scores = result.rows.map((row, index) => ({
    rank: index + 1,
    name: row.name as string,
    time: row.time as number,
  }));

  return NextResponse.json(scores);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, time } = body as { name?: unknown; time?: unknown };

  if (typeof name !== "string") {
    return NextResponse.json({ error: "Name muss ein Text sein" }, { status: 400 });
  }

  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 30) {
    return NextResponse.json({ error: "Name muss 2-30 Zeichen lang sein" }, { status: 400 });
  }

  if (typeof time !== "number" || !Number.isInteger(time) || time < 50 || time > 2000) {
    return NextResponse.json({ error: "Zeit muss zwischen 50 und 2000ms liegen" }, { status: 400 });
  }

  await turso.execute({
    sql: "INSERT INTO leaderboard (name, time) VALUES (?, ?)",
    args: [trimmed, time],
  });

  return NextResponse.json({ success: true });
}
