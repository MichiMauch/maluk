import { NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function createToken(): string {
  if (!ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD not set");
  const timestamp = Date.now().toString();
  const hmac = crypto
    .createHmac("sha256", ADMIN_PASSWORD)
    .update(timestamp)
    .digest("hex");
  return `${timestamp}.${hmac}`;
}

export async function POST(request: Request) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD nicht konfiguriert" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { password } = body;

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
  }

  const token = createToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
