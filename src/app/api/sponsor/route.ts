import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { Resend } from "resend";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "sponsor-inquiries.json");

interface Inquiry {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  date: string;
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

    await mkdir(DATA_DIR, { recursive: true });

    let inquiries: Inquiry[] = [];
    try {
      const data = await readFile(DATA_FILE, "utf-8");
      inquiries = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    const now = new Date();
    inquiries.push({
      name: name.trim(),
      company: typeof company === "string" ? company.trim() : "",
      phone: typeof phone === "string" ? phone.trim() : "",
      email: email.trim(),
      message: typeof message === "string" ? message.trim() : "",
      date: now.toISOString(),
    });
    await writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2), "utf-8");

    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
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
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Firma:</strong> ${company || "–"}</p>
          <p><strong>Telefon:</strong> ${phone || "–"}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Nachricht:</strong> ${message || "–"}</p>
          <p><strong>Datum:</strong> ${formatted}</p>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
