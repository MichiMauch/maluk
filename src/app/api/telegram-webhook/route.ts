import { NextRequest, NextResponse } from "next/server";
import {
  initTickerTables,
  isAdmin,
  addAdmin,
  removeAdmin,
  addTickerMessage,
  clearTicker,
  setActiveRace,
  getActiveRace,
  clearActiveRace,
  getMessagesByRace,
  saveSummary,
} from "@/lib/ticker";
import {
  sendTelegramMessage,
  getTelegramFileUrl,
  downloadTelegramFile,
} from "@/lib/telegram";
import { generateRaceSummary } from "@/lib/ai-summary";
import { raceEvents2024, raceEvents2026 } from "@/data/calendar";

const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

const allEvents = [...raceEvents2024, ...raceEvents2026];
const validSlugs = allEvents.map((e) => e.slug.current);

function findEventBySlug(slug: string) {
  return allEvents.find((e) => e.slug.current === slug);
}

interface TelegramUpdate {
  message?: {
    message_id: number;
    from: { id: number; first_name: string; username?: string };
    chat: { id: number };
    text?: string;
    photo?: Array<{ file_id: string; width: number; height: number }>;
    caption?: string;
  };
}

async function saveImageAsDataUrl(fileId: string): Promise<string | null> {
  const fileUrl = await getTelegramFileUrl(fileId);
  if (!fileUrl) return null;

  const buffer = await downloadTelegramFile(fileUrl);
  const base64 = buffer.toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

function parseCommand(text: string): { command: string; args: string } | null {
  const match = text.match(/^\/(\w+)\s*(.*)/);
  if (!match) return null;
  return { command: match[1], args: match[2].trim() };
}

export async function POST(request: NextRequest) {
  if (WEBHOOK_SECRET) {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = update.message;
  if (!message) {
    return NextResponse.json({ ok: true });
  }

  const chatId = String(message.chat.id);

  // /id works for everyone
  if (message.text?.trim() === "/id") {
    await sendTelegramMessage(chatId, `Deine Chat-ID: ${chatId}`);
    return NextResponse.json({ ok: true });
  }

  await initTickerTables();

  const authorized = await isAdmin(chatId);
  if (!authorized) {
    await sendTelegramMessage(
      chatId,
      `⛔ Du bist nicht berechtigt.\nDeine Chat-ID: ${chatId}\nSchick diese ID an den Admin, damit er dich mit /invite freischalten kann.`
    );
    return NextResponse.json({ ok: true });
  }

  const primaryAdmin = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const isPrimaryAdmin = chatId === primaryAdmin;
  const activeRaceId = await getActiveRace();

  if (message.text) {
    const parsed = parseCommand(message.text);

    if (parsed) {
      switch (parsed.command) {
        case "start":
          await sendTelegramMessage(
            chatId,
            "🏁 MALUK Racing Ticker Bot\n\nBefehle:\n" +
              "• Nachricht senden → Ticker-Meldung\n" +
              "• Foto senden → Bild im Ticker\n" +
              "• /rennen <slug> → Rennen starten\n" +
              "• /rennen ende → Rennen beenden + Zusammenfassung\n" +
              "• /rennen status → Aktives Rennen anzeigen\n" +
              "• /status live|pause|ende → Rennstatus\n" +
              "• /ergebnis P3 1:43.25 → Ergebnis\n" +
              (isPrimaryAdmin
                ? "• /invite <chat_id> <name> → Teammitglied\n" +
                  "• /remove <chat_id> → Entfernen\n"
                : "") +
              "• /clear → Ticker leeren\n\n" +
              "Verfügbare Rennen-Slugs:\n" +
              validSlugs.map((s) => `  ${s}`).join("\n")
          );
          return NextResponse.json({ ok: true });

        case "rennen": {
          const arg = parsed.args.toLowerCase().trim();

          if (!arg) {
            await sendTelegramMessage(
              chatId,
              "Verwendung:\n/rennen <slug> → Rennen starten\n/rennen ende → Rennen beenden\n/rennen status → Aktives Rennen\n\nVerfügbare Slugs:\n" +
                validSlugs.map((s) => `  ${s}`).join("\n")
            );
            return NextResponse.json({ ok: true });
          }

          if (arg === "status") {
            if (activeRaceId) {
              const event = findEventBySlug(activeRaceId);
              await sendTelegramMessage(
                chatId,
                `🏎 Aktives Rennen: ${event?.name ?? activeRaceId}`
              );
            } else {
              await sendTelegramMessage(chatId, "Kein aktives Rennen.");
            }
            return NextResponse.json({ ok: true });
          }

          if (arg === "ende") {
            if (!activeRaceId) {
              await sendTelegramMessage(chatId, "Kein aktives Rennen zum Beenden.");
              return NextResponse.json({ ok: true });
            }

            const event = findEventBySlug(activeRaceId);
            const raceName = event?.name ?? activeRaceId;

            await clearActiveRace();
            await sendTelegramMessage(chatId, `🏁 ${raceName} beendet. Erstelle Zusammenfassung...`);

            // Generate AI summary
            try {
              const messages = await getMessagesByRace(activeRaceId);
              if (messages.length > 0) {
                const summary = await generateRaceSummary(messages, raceName);
                await saveSummary(activeRaceId, summary);
                await sendTelegramMessage(chatId, `✅ Rennbericht erstellt:\n\n${summary.slice(0, 500)}${summary.length > 500 ? "..." : ""}`);
              } else {
                await sendTelegramMessage(chatId, "⚠️ Keine Nachrichten für dieses Rennen — kein Bericht erstellt.");
              }
            } catch (err) {
              await sendTelegramMessage(chatId, `❌ Fehler bei Zusammenfassung: ${err instanceof Error ? err.message : "Unbekannt"}`);
            }

            return NextResponse.json({ ok: true });
          }

          // Start a race
          if (!validSlugs.includes(arg)) {
            await sendTelegramMessage(
              chatId,
              `❌ Unbekannter Slug: ${arg}\n\nVerfügbare Slugs:\n` +
                validSlugs.map((s) => `  ${s}`).join("\n")
            );
            return NextResponse.json({ ok: true });
          }

          if (activeRaceId) {
            const currentEvent = findEventBySlug(activeRaceId);
            await sendTelegramMessage(
              chatId,
              `⚠️ Es läuft bereits: ${currentEvent?.name ?? activeRaceId}\nZuerst beenden mit /rennen ende`
            );
            return NextResponse.json({ ok: true });
          }

          await setActiveRace(arg);
          const event = findEventBySlug(arg);
          await addTickerMessage(
            `🏎 ${event?.name ?? arg} — Ticker gestartet`,
            "status",
            undefined,
            "live",
            arg
          );
          await sendTelegramMessage(chatId, `✅ Rennen gestartet: ${event?.name ?? arg}\nAlle Nachrichten werden diesem Rennen zugeordnet.`);
          return NextResponse.json({ ok: true });
        }

        case "status": {
          const status = parsed.args.toLowerCase();
          if (!["live", "pause", "ende"].includes(status)) {
            await sendTelegramMessage(chatId, "Verwendung: /status live|pause|ende");
            return NextResponse.json({ ok: true });
          }
          const statusText =
            status === "live"
              ? "🟢 Rennen läuft!"
              : status === "pause"
                ? "🟡 Rennpause"
                : "🏁 Renntag beendet";
          await addTickerMessage(statusText, "status", undefined, status as "live" | "pause" | "ende", activeRaceId ?? undefined);
          await sendTelegramMessage(chatId, `✅ Status: ${statusText}`);
          return NextResponse.json({ ok: true });
        }

        case "ergebnis": {
          if (!parsed.args) {
            await sendTelegramMessage(chatId, "Verwendung: /ergebnis P3 1:43.25");
            return NextResponse.json({ ok: true });
          }
          await addTickerMessage(`🏆 Ergebnis: ${parsed.args}`, "result", undefined, undefined, activeRaceId ?? undefined);
          await sendTelegramMessage(chatId, "✅ Ergebnis gepostet");
          return NextResponse.json({ ok: true });
        }

        case "invite": {
          if (!isPrimaryAdmin) {
            await sendTelegramMessage(chatId, "⛔ Nur der Hauptadmin kann Teammitglieder einladen.");
            return NextResponse.json({ ok: true });
          }
          const parts = parsed.args.split(/\s+/);
          const inviteChatId = parts[0];
          const inviteName = parts.slice(1).join(" ") || "Teammitglied";
          if (!inviteChatId) {
            await sendTelegramMessage(chatId, "Verwendung: /invite <chat_id> <name>");
            return NextResponse.json({ ok: true });
          }
          await addAdmin(inviteChatId, inviteName, chatId);
          await sendTelegramMessage(chatId, `✅ ${inviteName} (${inviteChatId}) hinzugefügt`);
          return NextResponse.json({ ok: true });
        }

        case "remove": {
          if (!isPrimaryAdmin) {
            await sendTelegramMessage(chatId, "⛔ Nur der Hauptadmin kann Teammitglieder entfernen.");
            return NextResponse.json({ ok: true });
          }
          const removeChatId = parsed.args.trim();
          if (!removeChatId) {
            await sendTelegramMessage(chatId, "Verwendung: /remove <chat_id>");
            return NextResponse.json({ ok: true });
          }
          await removeAdmin(removeChatId);
          await sendTelegramMessage(chatId, `✅ ${removeChatId} entfernt`);
          return NextResponse.json({ ok: true });
        }

        case "clear": {
          await clearTicker();
          await sendTelegramMessage(chatId, "✅ Ticker geleert");
          return NextResponse.json({ ok: true });
        }

        case "id": {
          await sendTelegramMessage(chatId, `Deine Chat-ID: ${chatId}`);
          return NextResponse.json({ ok: true });
        }

        default:
          await sendTelegramMessage(chatId, `Unbekannter Befehl: /${parsed.command}`);
          return NextResponse.json({ ok: true });
      }
    }

    // Regular text message
    await addTickerMessage(message.text, "text", undefined, undefined, activeRaceId ?? undefined);
    await sendTelegramMessage(chatId, activeRaceId ? `✅ Gepostet (${findEventBySlug(activeRaceId)?.name ?? activeRaceId})` : "✅ Im Ticker gepostet");
    return NextResponse.json({ ok: true });
  }

  // Photo message
  if (message.photo && message.photo.length > 0) {
    const largestPhoto = message.photo[message.photo.length - 1];
    const imageUrl = await saveImageAsDataUrl(largestPhoto.file_id);
    const caption = message.caption || "📸 Bild aus dem Fahrerlager";

    await addTickerMessage(caption, "photo", imageUrl ?? undefined, undefined, activeRaceId ?? undefined);
    await sendTelegramMessage(chatId, activeRaceId ? `✅ Bild gepostet (${findEventBySlug(activeRaceId)?.name ?? activeRaceId})` : "✅ Bild im Ticker gepostet");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
