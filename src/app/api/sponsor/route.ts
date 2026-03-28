import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";
import { turso } from "@/lib/turso";

async function initTable() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS sponsor_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      email TEXT NOT NULL,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, phone, email, message } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    await initTable();

    await turso.execute({
      sql: "INSERT INTO sponsor_inquiries (name, company, phone, email, message) VALUES (?, ?, ?, ?, ?)",
      args: [
        name.trim(),
        typeof company === "string" ? company.trim() : "",
        typeof phone === "string" ? phone.trim() : "",
        email.trim(),
        typeof message === "string" ? message.trim() : "",
      ],
    });

    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      const now = new Date();
      const formatted = now.toLocaleString("de-CH", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
        timeZone: "Europe/Zurich",
      });
      const resend = new Resend(process.env.RESEND_API_KEY);
      resend.emails.send({
        from: "Sponsoring <onboarding@resend.dev>",
        to: process.env.NOTIFICATION_EMAIL,
        subject: "Neue Sponsor-Anfrage",
        html: `
          <h2>Neue Sponsor-Anfrage</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Firma:</strong> ${escapeHtml(company || "–")}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(phone || "–")}</p>
          <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
          <p><strong>Nachricht:</strong> ${escapeHtml(message || "–")}</p>
          <p><strong>Datum:</strong> ${formatted}</p>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
