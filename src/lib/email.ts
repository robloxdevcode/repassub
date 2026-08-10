import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const fromEmail = process.env.RESEND_FROM_EMAIL || "Linklock <onboarding@resend.dev>";

export async function sendUnlockNotificationEmail(params: {
  to: string;
  campaignTitle: string;
  unlockUrl: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping unlock notification");
    return { sent: false as const };
  }

  await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: `Someone unlocked "${params.campaignTitle}"`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h1 style="font-size:20px;margin:0 0 12px;">New unlock 🎉</h1>
        <p style="color:#555;line-height:1.5;">
          A fan completed all steps on <strong>${escapeHtml(params.campaignTitle)}</strong> and unlocked your content.
        </p>
        <p style="margin-top:20px;">
          <a href="${params.unlockUrl}" style="display:inline-block;background:#ff2b2b;color:#fff;padding:12px 20px;text-decoration:none;font-weight:bold;border-radius:4px;">
            View unlock page
          </a>
        </p>
        <p style="margin-top:24px;font-size:12px;color:#888;">
          You’re receiving this because unlock alerts are on. Turn them off in Linklock Settings → Notifications.
        </p>
      </div>
    `,
  });

  return { sent: true as const };
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isEmailConfigured() {
  return !!process.env.RESEND_API_KEY;
}
