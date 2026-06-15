// Single source of truth for the Claude model used across the app and scripts.
//
// Why this file exists: the model ID used to be hardcoded in three places
// (ai-summary.ts + two scripts). When Anthropic retired an older dated model,
// the API started returning 404 ("not_found_error") and the race summary failed
// at exactly the wrong moment (race already ended). Keeping it in one place —
// overridable via env without a code change — means a future model swap is a
// one-line change instead of a hunt across the codebase.
//
// Override at runtime with ANTHROPIC_MODEL if you ever need to switch quickly
// (e.g. to "claude-opus-4-8" for higher quality, or a future model).
export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
