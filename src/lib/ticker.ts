import { turso } from "./turso";

export type TickerMessageType = "text" | "photo" | "result" | "status";
export type RaceStatus = "live" | "pause" | "ende";

export interface TickerMessage {
  id: number;
  text: string;
  image_url: string | null;
  type: TickerMessageType;
  race_status: RaceStatus | null;
  race_id: string | null;
  created_at: string;
}

export interface RaceSummary {
  race_id: string;
  summary: string;
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
      race_id TEXT,
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

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS race_summaries (
      race_id TEXT PRIMARY KEY,
      summary TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS active_race (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      race_id TEXT NOT NULL
    )
  `);

  // Add race_id column if it doesn't exist (migration for existing DBs)
  try {
    await turso.execute("ALTER TABLE ticker_messages ADD COLUMN race_id TEXT");
  } catch {
    // Column already exists
  }
}

// --- Admin functions ---

export async function isAdmin(chatId: string): Promise<boolean> {
  const primaryAdmin = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (primaryAdmin && chatId === primaryAdmin) return true;

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

// --- Active race ---

export async function setActiveRace(raceId: string) {
  await turso.execute({
    sql: "INSERT OR REPLACE INTO active_race (id, race_id) VALUES (1, ?)",
    args: [raceId],
  });
}

export async function getActiveRace(): Promise<string | null> {
  const result = await turso.execute("SELECT race_id FROM active_race WHERE id = 1");
  if (result.rows.length === 0) return null;
  return result.rows[0].race_id as string;
}

export async function clearActiveRace() {
  await turso.execute("DELETE FROM active_race WHERE id = 1");
}

// --- Ticker messages ---

export async function addTickerMessage(
  text: string,
  type: TickerMessageType = "text",
  imageUrl?: string,
  raceStatus?: RaceStatus,
  raceId?: string
) {
  await turso.execute({
    sql: "INSERT INTO ticker_messages (text, image_url, type, race_status, race_id) VALUES (?, ?, ?, ?, ?)",
    args: [text, imageUrl ?? null, type, raceStatus ?? null, raceId ?? null],
  });
}

export async function getTickerMessages(limit = 50): Promise<TickerMessage[]> {
  const result = await turso.execute({
    sql: "SELECT id, text, image_url, type, race_status, race_id, created_at FROM ticker_messages ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    text: row.text as string,
    image_url: row.image_url as string | null,
    type: row.type as TickerMessageType,
    race_status: row.race_status as RaceStatus | null,
    race_id: row.race_id as string | null,
    created_at: row.created_at as string,
  }));
}

export async function getActiveRaceMessages(limit = 50): Promise<TickerMessage[]> {
  const activeRace = await getActiveRace();
  if (!activeRace) return [];

  const result = await turso.execute({
    sql: "SELECT id, text, image_url, type, race_status, race_id, created_at FROM ticker_messages WHERE race_id = ? ORDER BY created_at DESC LIMIT ?",
    args: [activeRace, limit],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    text: row.text as string,
    image_url: row.image_url as string | null,
    type: row.type as TickerMessageType,
    race_status: row.race_status as RaceStatus | null,
    race_id: row.race_id as string | null,
    created_at: row.created_at as string,
  }));
}

export async function getMessagesByRace(raceId: string): Promise<TickerMessage[]> {
  const result = await turso.execute({
    sql: "SELECT id, text, image_url, type, race_status, race_id, created_at FROM ticker_messages WHERE race_id = ? ORDER BY created_at ASC",
    args: [raceId],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    text: row.text as string,
    image_url: row.image_url as string | null,
    type: row.type as TickerMessageType,
    race_status: row.race_status as RaceStatus | null,
    race_id: row.race_id as string | null,
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

// --- Race summaries ---

export async function saveSummary(raceId: string, summary: string) {
  await turso.execute({
    sql: "INSERT OR REPLACE INTO race_summaries (race_id, summary) VALUES (?, ?)",
    args: [raceId, summary],
  });
}

export async function getSummary(raceId: string): Promise<RaceSummary | null> {
  const result = await turso.execute({
    sql: "SELECT race_id, summary, created_at FROM race_summaries WHERE race_id = ?",
    args: [raceId],
  });
  if (result.rows.length === 0) return null;
  return {
    race_id: result.rows[0].race_id as string,
    summary: result.rows[0].summary as string,
    created_at: result.rows[0].created_at as string,
  };
}
