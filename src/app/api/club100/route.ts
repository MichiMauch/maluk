import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { Resend } from "resend";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "club100-members.json");

interface Member {
  email: string;
  date: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    await mkdir(DATA_DIR, { recursive: true });

    let members: Member[] = [];
    try {
      const data = await readFile(DATA_FILE, "utf-8");
      members = JSON.parse(data);
    } catch {
      // File doesn't exist yet — start with empty array
    }

    if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ success: true });
    }

    const now = new Date();
    members.push({ email, date: now.toISOString() });
    await writeFile(DATA_FILE, JSON.stringify(members, null, 2), "utf-8");

    // Fire-and-forget: Benachrichtigung per E-Mail
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      const formatted = now.toLocaleString("de-CH", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
        timeZone: "Europe/Zurich",
      });
      const resend = new Resend(process.env.RESEND_API_KEY);
      resend.emails.send({
        from: "Club 100 <onboarding@resend.dev>",
        to: process.env.NOTIFICATION_EMAIL,
        subject: "Neues Club 100 Mitglied",
        html: `<p>Neues Club 100 Mitglied: <strong>${email}</strong></p><p>Datum: ${formatted}</p>`,
      }).catch(() => {
        // Fehler beim Mailversand ignorieren — E-Mail ist bereits gespeichert
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
