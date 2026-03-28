import { NextResponse } from "next/server";
import { createGameToken } from "@/lib/game-token";

export async function POST() {
  const { token } = createGameToken();
  return NextResponse.json({ token });
}
