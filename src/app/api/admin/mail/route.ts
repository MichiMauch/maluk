import { NextResponse } from "next/server";
import {
  getMailingList,
  addMailingListEntry,
  removeMailingListEntry,
} from "@/lib/mailing-list";

export async function GET() {
  const entries = await getMailingList();
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const { email, name } = await request.json();

  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail" }, { status: 400 });
  }

  await addMailingListEntry(email, name);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "E-Mail erforderlich" }, { status: 400 });
  }

  const removed = await removeMailingListEntry(email);
  if (!removed) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
