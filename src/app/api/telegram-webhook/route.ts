import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  initTickerTables,
  isAdmin,
  addAdmin,
  removeAdmin,
  addTickerMessage,
  clearTicker,
} from "@/lib/ticker";
import {
  sendTelegramMessage,
  getTelegramFileUrl,
  downloadTelegramFile,
} from "@/lib/telegram";

const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "ticker");

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

async function saveImage(fileId: string): Promise<string | null> {
  const fileUrl = await getTelegramFileUrl(fileId);
  if (!fileUrl) return null;

  const buffer = await downloadTelegramFile(fileUrl);
  const filename = `${Date.now()}-${fileId.slice(-8)}.jpg`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/images/ticker/${filename}`;
}

function parseCommand(text: string): { command: string; args: string } | null {
  const match = text.match(/^\/(\w+)\s*(.*)/);
  if (!match) return null;
  return { command: match[1], args: match[2].trim() };
}

export async function POST(request: NextRequest) {
  // Verify webhook secret via query param
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
  const senderName =
    message.from.username ?? message.from.first_name ?? "Unbekannt";

  // /id works for everyone — before auth check
  if (message.text?.trim() === "/id") {
    await sendTelegramMessage(chatId, `Deine Chat-ID: ${chatId}`);
    return NextResponse.json({ ok: true });
  }

  // Initialize tables on first use
  await initTickerTables();

  // Check authorization
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

  // Handle commands
  if (message.text) {
    const parsed = parseCommand(message.text);

    if (parsed) {
      switch (parsed.command) {
        case "start":
          await sendTelegramMessage(
            chatId,
            "🏁 MALUK Racing Ticker Bot\n\nBefehle:\n" +
              "• Nachricht senden → wird als Ticker-Meldung angezeigt\n" +
              "• Foto senden → Bild im Ticker\n" +
              "• /status live|pause|ende → Rennstatus setzen\n" +
              "• /ergebnis P3 1:43.25 → Ergebnis posten\n" +
              (isPrimaryAdmin
                ? "• /invite <chat_id> <name> → Teammitglied hinzufügen\n" +
                  "• /remove <chat_id> → Teammitglied entfernen\n"
                : "") +
              "• /clear → Alle Ticker-Meldungen löschen"
          );
          return NextResponse.json({ ok: true });

        case "status": {
          const status = parsed.args.toLowerCase();
          if (!["live", "pause", "ende"].includes(status)) {
            await sendTelegramMessage(
              chatId,
              "Ungültiger Status. Verwende: /status live|pause|ende"
            );
            return NextResponse.json({ ok: true });
          }
          const statusText =
            status === "live"
              ? "🟢 Rennen läuft!"
              : status === "pause"
                ? "🟡 Rennpause"
                : "🏁 Renntag beendet";
          await addTickerMessage(
            statusText,
            "status",
            undefined,
            status as "live" | "pause" | "ende"
          );
          await sendTelegramMessage(chatId, `✅ Status gesetzt: ${statusText}`);
          return NextResponse.json({ ok: true });
        }

        case "ergebnis": {
          if (!parsed.args) {
            await sendTelegramMessage(
              chatId,
              "Verwendung: /ergebnis P3 1:43.25 Kategorie E1"
            );
            return NextResponse.json({ ok: true });
          }
          const resultText = `🏆 Ergebnis: ${parsed.args}`;
          await addTickerMessage(resultText, "result");
          await sendTelegramMessage(chatId, `✅ Ergebnis gepostet`);
          return NextResponse.json({ ok: true });
        }

        case "invite": {
          if (!isPrimaryAdmin) {
            await sendTelegramMessage(
              chatId,
              "⛔ Nur der Hauptadmin kann Teammitglieder einladen."
            );
            return NextResponse.json({ ok: true });
          }
          const parts = parsed.args.split(/\s+/);
          const inviteChatId = parts[0];
          const inviteName = parts.slice(1).join(" ") || "Teammitglied";
          if (!inviteChatId) {
            await sendTelegramMessage(
              chatId,
              "Verwendung: /invite <chat_id> <name>"
            );
            return NextResponse.json({ ok: true });
          }
          await addAdmin(inviteChatId, inviteName, chatId);
          await sendTelegramMessage(
            chatId,
            `✅ ${inviteName} (${inviteChatId}) als Ticker-Admin hinzugefügt`
          );
          return NextResponse.json({ ok: true });
        }

        case "remove": {
          if (!isPrimaryAdmin) {
            await sendTelegramMessage(
              chatId,
              "⛔ Nur der Hauptadmin kann Teammitglieder entfernen."
            );
            return NextResponse.json({ ok: true });
          }
          const removeChatId = parsed.args.trim();
          if (!removeChatId) {
            await sendTelegramMessage(
              chatId,
              "Verwendung: /remove <chat_id>"
            );
            return NextResponse.json({ ok: true });
          }
          await removeAdmin(removeChatId);
          await sendTelegramMessage(
            chatId,
            `✅ ${removeChatId} als Ticker-Admin entfernt`
          );
          return NextResponse.json({ ok: true });
        }

        case "clear": {
          await clearTicker();
          await sendTelegramMessage(chatId, "✅ Ticker geleert");
          return NextResponse.json({ ok: true });
        }

        case "id": {
          await sendTelegramMessage(
            chatId,
            `Deine Chat-ID: ${chatId}`
          );
          return NextResponse.json({ ok: true });
        }

        default:
          await sendTelegramMessage(
            chatId,
            `Unbekannter Befehl: /${parsed.command}`
          );
          return NextResponse.json({ ok: true });
      }
    }

    // Regular text message → ticker entry
    await addTickerMessage(message.text, "text");
    await sendTelegramMessage(chatId, "✅ Im Ticker gepostet");
    return NextResponse.json({ ok: true });
  }

  // Photo message
  if (message.photo && message.photo.length > 0) {
    // Get the largest photo
    const largestPhoto = message.photo[message.photo.length - 1];
    const imageUrl = await saveImage(largestPhoto.file_id);
    const caption = message.caption || "📸 Bild aus dem Fahrerlager";

    await addTickerMessage(caption, "photo", imageUrl ?? undefined);
    await sendTelegramMessage(chatId, "✅ Bild im Ticker gepostet");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
