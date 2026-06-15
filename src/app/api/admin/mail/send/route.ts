import { NextResponse } from "next/server";
import { getMailingList } from "@/lib/mailing-list";
import { getSummary } from "@/lib/ticker";
import { sendRaceReport } from "@/lib/mail";
import { raceEvents2024, raceEvents2026 } from "@/data/calendar";

const allEvents = [...raceEvents2024, ...raceEvents2026];

export async function POST(request: Request) {
  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: "Slug erforderlich" }, { status: 400 });
  }

  const event = allEvents.find((e) => e.slug.current === slug);
  if (!event) {
    return NextResponse.json({ error: "Rennen nicht gefunden" }, { status: 404 });
  }

  const summary = await getSummary(slug);
  if (!summary) {
    return NextResponse.json(
      { error: "Kein Rennbericht vorhanden" },
      { status: 404 }
    );
  }

  const recipients = await getMailingList();
  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "Mailingliste ist leer" },
      { status: 400 }
    );
  }

  const result = await sendRaceReport(recipients, event.name, summary.summary);
  return NextResponse.json(result);
}
