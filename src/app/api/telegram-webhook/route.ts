import { NextRequest, NextResponse } from "next/server";
import {
  initTickerTables,
  isAdmin,
  addAdmin,
  removeAdmin,
  addTickerMessage,
  updateTickerMessageByTelegramId,
  deleteTickerMessageByTelegramId,
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
  forwardToChannel,
} from "@/lib/telegram";
import { generateRaceSummary } from "@/lib/ai-summary";
import { invalidateTickerCache } from "@/lib/redis";
import { raceEvents2024, raceEvents2026 } from "@/data/calendar";

const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

const allEvents = [...raceEvents2024, ...raceEvents2026];
const validSlugs = allEvents.map((e) => e.slug.current);

function findEventBySlug(slug: string) {
  return allEvents.find((e) => e.slug.current === slug);
}

interface TelegramMessage {
  message_id: number;
  from: { id: number; first_name: string; username?: string };
  chat: { id: number };
  text?: string;
  photo?: Array<{ file_id: string; width: number; height: number }>;
  video?: { file_id: string; file_size?: number; mime_type?: string };
  video_note?: { file_id: string; file_size?: number };
  caption?: string;
  reply_to_message?: TelegramMessage;
}

interface TelegramUpdate {
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
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

  // Handle edited messages
  if (update.edited_message) {
    const edited = update.edited_message;
    const chatId = String(edited.chat.id);

    await initTickerTables();
    const authorized = await isAdmin(chatId);
    if (!authorized) return NextResponse.json({ ok: true });

    const newText = edited.text || edited.caption;
    if (newText) {
      // Re-download photo if the edited message has one
      let newImageUrl: string | undefined;
      if (edited.photo && edited.photo.length > 0) {
        const largestPhoto = edited.photo[edited.photo.length - 1];
        const dataUrl = await saveImageAsDataUrl(largestPhoto.file_id);
        if (dataUrl) newImageUrl = dataUrl;
      }

      const updated = await updateTickerMessageByTelegramId(
        edited.message_id,
        newText,
        newImageUrl
      );
      if (updated) {
        await invalidateTickerCache();
        await sendTelegramMessage(chatId, "✅ Ticker-Eintrag aktualisiert");
      }
    }

    return NextResponse.json({ ok: true });
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
              "• /fan → Antwort auf Fan-Nachricht → ins Ticker übernehmen\n" +
              "• /fan Text → mit eigener Beschreibung\n" +
              "• /delete → Antwort auf Nachricht → Ticker-Eintrag löschen\n" +
              "• Nachricht editieren → Ticker wird aktualisiert\n" +
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
          await invalidateTickerCache();
          await forwardToChannel(`🏎 ${event?.name ?? arg} — Ticker gestartet`);
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
          await invalidateTickerCache();
          await forwardToChannel(statusText);
          await sendTelegramMessage(chatId, `✅ Status: ${statusText}`);
          return NextResponse.json({ ok: true });
        }

        case "ergebnis": {
          if (!parsed.args) {
            await sendTelegramMessage(chatId, "Verwendung: /ergebnis P3 1:43.25");
            return NextResponse.json({ ok: true });
          }
          await addTickerMessage(`🏆 Ergebnis: ${parsed.args}`, "result", undefined, undefined, activeRaceId ?? undefined, message.message_id);
          await invalidateTickerCache();
          await forwardToChannel(`🏆 Ergebnis: ${parsed.args}`);
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

        case "fan": {
          const fanMsg = message.reply_to_message;
          if (!fanMsg) {
            await sendTelegramMessage(chatId, "Verwendung: Auf ein Fan-Foto/Nachricht antworten mit /fan oder /fan Toller Schnappschuss!");
            return NextResponse.json({ ok: true });
          }

          const fanName = fanMsg.from?.first_name ?? "Fan";
          const customCaption = parsed.args || null;

          // Fan photo
          if (fanMsg.photo && fanMsg.photo.length > 0) {
            const largestPhoto = fanMsg.photo[fanMsg.photo.length - 1];
            const imageUrl = await saveImageAsDataUrl(largestPhoto.file_id);
            const caption = customCaption
              ? `📸 ${fanName}: ${customCaption}`
              : `📸 Fan-Foto von ${fanName}`;

            await addTickerMessage(caption, "photo", imageUrl ?? undefined, undefined, activeRaceId ?? undefined, message.message_id);
            await invalidateTickerCache();
            await forwardToChannel(caption, largestPhoto.file_id, "photo");
            await sendTelegramMessage(chatId, `✅ Fan-Foto von ${fanName} im Ticker`);
            return NextResponse.json({ ok: true });
          }

          // Fan video
          const fanVideo = fanMsg.video ?? fanMsg.video_note;
          if (fanVideo) {
            const fileUrl = await getTelegramFileUrl(fanVideo.file_id);
            if (fileUrl) {
              const buffer = await downloadTelegramFile(fileUrl);
              const mimeType = ("mime_type" in fanVideo && fanVideo.mime_type) ? fanVideo.mime_type : "video/mp4";
              const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
              const caption = customCaption
                ? `🎬 ${fanName}: ${customCaption}`
                : `🎬 Fan-Video von ${fanName}`;

              await addTickerMessage(caption, "video", dataUrl, undefined, activeRaceId ?? undefined, message.message_id);
              await invalidateTickerCache();
              await forwardToChannel(caption, fanVideo.file_id, "video");
              await sendTelegramMessage(chatId, `✅ Fan-Video von ${fanName} im Ticker`);
              return NextResponse.json({ ok: true });
            }
          }

          // Fan text
          if (fanMsg.text) {
            const caption = customCaption
              ? `💬 ${fanName}: ${customCaption}`
              : `💬 ${fanName}: ${fanMsg.text}`;

            await addTickerMessage(caption, "text", undefined, undefined, activeRaceId ?? undefined, message.message_id);
            await invalidateTickerCache();
            await forwardToChannel(caption);
            await sendTelegramMessage(chatId, `✅ Fan-Nachricht von ${fanName} im Ticker`);
            return NextResponse.json({ ok: true });
          }

          await sendTelegramMessage(chatId, "⚠️ Diese Nachricht enthält keinen unterstützten Inhalt (Text, Foto oder Video).");
          return NextResponse.json({ ok: true });
        }

        case "delete": {
          const replyMsg = message.reply_to_message;
          if (!replyMsg) {
            await sendTelegramMessage(chatId, "Verwendung: Auf eine Nachricht antworten mit /delete");
            return NextResponse.json({ ok: true });
          }
          const deleted = await deleteTickerMessageByTelegramId(replyMsg.message_id);
          if (deleted) {
            await invalidateTickerCache();
            await sendTelegramMessage(chatId, "✅ Ticker-Eintrag gelöscht");
          } else {
            await sendTelegramMessage(chatId, "⚠️ Eintrag nicht gefunden (evtl. vor dem Update erstellt)");
          }
          return NextResponse.json({ ok: true });
        }

        case "clear": {
          await clearTicker();
          await invalidateTickerCache();
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
    await addTickerMessage(message.text, "text", undefined, undefined, activeRaceId ?? undefined, message.message_id);
    await invalidateTickerCache();
    const channelErr = await forwardToChannel(message.text);
    const posted = activeRaceId ? `✅ Gepostet (${findEventBySlug(activeRaceId)?.name ?? activeRaceId})` : "✅ Im Ticker gepostet";
    await sendTelegramMessage(chatId, channelErr ? `${posted}\n⚠️ ${channelErr}` : posted);
    return NextResponse.json({ ok: true });
  }

  // Photo message
  if (message.photo && message.photo.length > 0) {
    const largestPhoto = message.photo[message.photo.length - 1];
    const imageUrl = await saveImageAsDataUrl(largestPhoto.file_id);
    const caption = message.caption || "📸 Bild aus dem Fahrerlager";

    await addTickerMessage(caption, "photo", imageUrl ?? undefined, undefined, activeRaceId ?? undefined, message.message_id);
    await invalidateTickerCache();
    await forwardToChannel(caption, largestPhoto.file_id, "photo");
    await sendTelegramMessage(chatId, activeRaceId ? `✅ Bild gepostet (${findEventBySlug(activeRaceId)?.name ?? activeRaceId})` : "✅ Bild im Ticker gepostet");
    return NextResponse.json({ ok: true });
  }

  // Video message
  const video = message.video ?? message.video_note;
  if (video) {
    const MAX_VIDEO_SIZE = 8 * 1024 * 1024; // 8MB
    if (video.file_size && video.file_size > MAX_VIDEO_SIZE) {
      await sendTelegramMessage(chatId, `⚠️ Video zu gross (${Math.round(video.file_size / 1024 / 1024)}MB). Maximum: 8MB.`);
      return NextResponse.json({ ok: true });
    }

    const fileUrl = await getTelegramFileUrl(video.file_id);
    if (!fileUrl) {
      await sendTelegramMessage(chatId, "❌ Video konnte nicht heruntergeladen werden.");
      return NextResponse.json({ ok: true });
    }

    const buffer = await downloadTelegramFile(fileUrl);
    const mimeType = ("mime_type" in video && video.mime_type) ? video.mime_type : "video/mp4";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const caption = message.caption || "🎬 Video aus dem Fahrerlager";

    await addTickerMessage(caption, "video", dataUrl, undefined, activeRaceId ?? undefined, message.message_id);
    await invalidateTickerCache();
    await forwardToChannel(caption, video.file_id, "video");
    await sendTelegramMessage(chatId, activeRaceId ? `✅ Video gepostet (${findEventBySlug(activeRaceId)?.name ?? activeRaceId})` : "✅ Video im Ticker gepostet");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
