import { randomBytes, createHmac } from "crypto";

// Secret for signing tokens — derived from auth token or fallback
const SECRET =
  process.env.TURSO_AUTH_TOKEN?.slice(0, 32) ?? "maluk-racing-game-secret-key-v1";

interface TokenPayload {
  id: string;
  issuedAt: number;
}

// Active game sessions: tokenId -> issuedAt timestamp
const activeSessions = new Map<string, number>();

// Cleanup expired sessions every 2 minutes
setInterval(() => {
  const cutoff = Date.now() - 30_000; // 30 seconds max game duration
  for (const [id, issuedAt] of activeSessions) {
    if (issuedAt < cutoff) {
      activeSessions.delete(id);
    }
  }
}, 120_000);

function sign(payload: TokenPayload): string {
  const data = `${payload.id}:${payload.issuedAt}`;
  const hmac = createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}:${hmac}`;
}

function verify(token: string): TokenPayload | null {
  const parts = token.split(":");
  if (parts.length !== 3) return null;

  const [id, issuedAtStr, providedHmac] = parts;
  const issuedAt = Number(issuedAtStr);
  if (!id || isNaN(issuedAt)) return null;

  const expectedHmac = createHmac("sha256", SECRET)
    .update(`${id}:${issuedAt}`)
    .digest("hex");

  if (providedHmac !== expectedHmac) return null;

  return { id, issuedAt };
}

export function createGameToken(): { token: string } {
  const id = randomBytes(16).toString("hex");
  const issuedAt = Date.now();
  activeSessions.set(id, issuedAt);
  return { token: sign({ id, issuedAt }) };
}

export function validateGameToken(
  token: string,
  reactionTimeMs: number
): { valid: boolean; error?: string } {
  const payload = verify(token);
  if (!payload) {
    return { valid: false, error: "Ungültiges Spieltoken" };
  }

  // Check if session exists (prevents replay)
  if (!activeSessions.has(payload.id)) {
    return { valid: false, error: "Spielsitzung abgelaufen oder bereits verwendet" };
  }

  // Remove session (one-time use)
  activeSessions.delete(payload.id);

  const elapsed = Date.now() - payload.issuedAt;

  // Game needs at least ~8 seconds: 5 lights × 1.2s + 2s min wait
  // Minimum realistic elapsed time: ~8000ms
  const MIN_GAME_DURATION = 7_000;
  const MAX_GAME_DURATION = 30_000;

  if (elapsed < MIN_GAME_DURATION) {
    return { valid: false, error: "Spiel zu schnell abgeschlossen" };
  }

  if (elapsed > MAX_GAME_DURATION) {
    return { valid: false, error: "Spielsitzung abgelaufen" };
  }

  // Reaction time plausibility: human minimum is ~100ms, suspicious below that
  if (reactionTimeMs < 100) {
    return { valid: false, error: "Reaktionszeit nicht plausibel" };
  }

  return { valid: true };
}
