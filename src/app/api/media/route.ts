import { NextRequest, NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    const result = await turso.execute({
      sql: "SELECT image_url, type FROM ticker_messages WHERE id = ?",
      args: [Number(id)],
    });

    if (result.rows.length === 0 || !result.rows[0].image_url) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const dataUrl = result.rows[0].image_url as string;
    const type = result.rows[0].type as string;

    // Parse data URL: data:mime;base64,DATA
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "invalid data" }, { status: 500 });
    }

    const mimeType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(type === "video" ? { "Accept-Ranges": "bytes" } : {}),
      },
    });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
