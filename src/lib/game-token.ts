import { randomBytes, createHmac } from "crypto";

const SECRET =
  process.env.TURSO_AUTH_TOKEN?.slice(0, 32) ?? "maluk-racing-game-secret-key-v1";

function sign(id: string, issuedAt: number): string {
  const data = `${id}:${issuedAt}`;
  const hmac = createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}:${hmac}`;
}

function verify(token: string): { id: string; issuedAt: number } | null {
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
  return { token: sign(id, issuedAt) };
}

export function validateGameToken(
  token: string,
  reactionTimeMs: number
): { valid: boolean; error?: string } {
  const payload = verify(token);
  if (!payload) {
    return { valid: false, error: "Ungültiges Spieltoken" };
  }

  const elapsed = Date.now() - payload.issuedAt;

  // Game needs at least ~8 seconds: 5 lights × 1.2s + 2s min wait
  const MIN_GAME_DURATION = 7_000;
  const MAX_GAME_DURATION = 30_000;

  if (elapsed < MIN_GAME_DURATION) {
    return { valid: false, error: "Spiel zu schnell abgeschlossen" };
  }

  if (elapsed > MAX_GAME_DURATION) {
    return { valid: false, error: "Spielsitzung abgelaufen" };
  }

  if (reactionTimeMs < 100) {
    return { valid: false, error: "Reaktionszeit nicht plausibel" };
  }

  return { valid: true };
}
