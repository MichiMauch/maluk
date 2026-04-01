const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(chatId: string, text: string) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function sendTelegramPhoto(chatId: string, fileId: string, caption?: string) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo: fileId, caption }),
  });
}

export async function sendTelegramVideo(chatId: string, fileId: string, caption?: string) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, video: fileId, caption }),
  });
}

export async function forwardToChannel(text: string, fileId?: string, mediaType?: "photo" | "video") {
  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  if (!BOT_TOKEN || !channelId) return;

  if (fileId && mediaType === "photo") {
    await sendTelegramPhoto(channelId, fileId, text);
  } else if (fileId && mediaType === "video") {
    await sendTelegramVideo(channelId, fileId, text);
  } else {
    await sendTelegramMessage(channelId, text);
  }
}

export async function getTelegramFileUrl(fileId: string): Promise<string | null> {
  if (!BOT_TOKEN) return null;

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
  );
  if (!res.ok) return null;

  const data = await res.json();
  const filePath = data.result?.file_path;
  if (!filePath) return null;

  return `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
}

export async function downloadTelegramFile(fileUrl: string): Promise<Buffer> {
  const res = await fetch(fileUrl);
  return Buffer.from(await res.arrayBuffer());
}
