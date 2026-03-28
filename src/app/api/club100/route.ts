import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";
import { turso } from "@/lib/turso";

async function initTable() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS club100_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    await initTable();

    // Check for duplicate
    const existing = await turso.execute({
      sql: "SELECT id FROM club100_members WHERE email = ? COLLATE NOCASE",
      args: [email],
    });
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: true });
    }

    await turso.execute({
      sql: "INSERT INTO club100_members (email) VALUES (?)",
      args: [email],
    });

    // Fire-and-forget: Benachrichtigung per E-Mail
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      const now = new Date();
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
        html: `<p>Neues Club 100 Mitglied: <strong>${escapeHtml(email)}</strong></p><p>Datum: ${formatted}</p>`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
