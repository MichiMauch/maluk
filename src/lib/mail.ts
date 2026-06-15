import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";

const SITE_URL = "https://malukracing.ch";
const MAIL_FROM =
  process.env.MAIL_FROM || "MALUK Racing <onboarding@resend.dev>";

export async function sendRaceReport(
  recipients: { email: string; name?: string | null }[],
  raceName: string,
  summary: string
): Promise<{ sent: number; errors: string[] }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");
  if (recipients.length === 0) return { sent: 0, errors: [] };

  const resend = new Resend(apiKey);
  const html = buildRaceReportHtml(raceName, summary);
  const subject = `Rennbericht: ${raceName}`;

  const emails = recipients.map((r) => ({
    from: MAIL_FROM,
    to: r.email,
    subject,
    html,
  }));

  const errors: string[] = [];
  let sent = 0;

  // Resend batch supports up to 100 emails per call
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100);
    try {
      const result = await resend.batch.send(batch);
      if (result.error) {
        errors.push(result.error.message);
      } else {
        sent += batch.length;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
    }
  }

  return { sent, errors };
}

function buildRaceReportHtml(raceName: string, summary: string): string {
  const paragraphs = summary
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      let html = escapeHtml(p);
      // Convert **bold** to <strong>
      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      return `<p style="margin: 0 0 16px 0; line-height: 1.6;">${html}</p>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
        <!-- Header -->
        <tr><td style="background-color: #e53e3e; padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 2px;">MALUK RACING</h1>
        </td></tr>
        <!-- Content -->
        <tr><td style="background-color: #1a1a1a; padding: 32px;">
          <h2 style="margin: 0 0 24px 0; color: #ffffff; font-size: 20px; font-weight: 600;">${escapeHtml(raceName)}</h2>
          <div style="color: #d4d4d4; font-size: 16px;">
            ${paragraphs}
          </div>
          <div style="margin-top: 32px; text-align: center;">
            <a href="${SITE_URL}" style="display: inline-block; background-color: #e53e3e; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: 600; border-radius: 4px;">Zum Live-Ticker &amp; Fotos</a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding: 24px 32px; text-align: center; color: #666666; font-size: 13px;">
          <p style="margin: 0;">MALUK Racing &middot; info@malukracing.ch</p>
          <p style="margin: 8px 0 0 0;">&copy; ${new Date().getFullYear()} MALUK Racing. Alle Rechte vorbehalten.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
