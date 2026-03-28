import { turso } from "./turso";

export type TickerMessageType = "text" | "photo" | "result" | "status";
export type RaceStatus = "live" | "pause" | "ende";

export interface TickerMessage {
  id: number;
  text: string;
  image_url: string | null;
  type: TickerMessageType;
  race_status: RaceStatus | null;
  created_at: string;
}

// Initialize tables (safe to call multiple times)
export async function initTickerTables() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS ticker_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      image_url TEXT,
      type TEXT NOT NULL DEFAULT 'text',
      race_status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS ticker_admins (
      chat_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      added_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function isAdmin(chatId: string): Promise<boolean> {
  // Primary admin from env var
  const primaryAdmin = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (primaryAdmin && chatId === primaryAdmin) return true;

  // Additional admins from DB
  const result = await turso.execute({
    sql: "SELECT chat_id FROM ticker_admins WHERE chat_id = ?",
    args: [chatId],
  });
  return result.rows.length > 0;
}

export async function addAdmin(chatId: string, name: string, addedBy: string) {
  await turso.execute({
    sql: "INSERT OR IGNORE INTO ticker_admins (chat_id, name, added_by) VALUES (?, ?, ?)",
    args: [chatId, name, addedBy],
  });
}

export async function removeAdmin(chatId: string) {
  await turso.execute({
    sql: "DELETE FROM ticker_admins WHERE chat_id = ?",
    args: [chatId],
  });
}

export async function addTickerMessage(
  text: string,
  type: TickerMessageType = "text",
  imageUrl?: string,
  raceStatus?: RaceStatus
) {
  await turso.execute({
    sql: "INSERT INTO ticker_messages (text, image_url, type, race_status) VALUES (?, ?, ?, ?)",
    args: [text, imageUrl ?? null, type, raceStatus ?? null],
  });
}

export async function getTickerMessages(limit = 50): Promise<TickerMessage[]> {
  const result = await turso.execute({
    sql: "SELECT id, text, image_url, type, race_status, created_at FROM ticker_messages ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    text: row.text as string,
    image_url: row.image_url as string | null,
    type: row.type as TickerMessageType,
    race_status: row.race_status as RaceStatus | null,
    created_at: row.created_at as string,
  }));
}

export async function getCurrentStatus(): Promise<RaceStatus | null> {
  const result = await turso.execute(
    "SELECT race_status FROM ticker_messages WHERE type = 'status' ORDER BY created_at DESC LIMIT 1"
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].race_status as RaceStatus | null;
}

export async function clearTicker() {
  await turso.execute("DELETE FROM ticker_messages");
}
