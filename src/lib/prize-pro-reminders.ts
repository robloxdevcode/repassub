import { db } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { isPaidStripePro } from "@/lib/subscription-access";

const REMINDER_TYPE = "prize_pro_expiry_3d";
const REMINDER_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
const REMINDER_TOLERANCE_MS = 24 * 60 * 60 * 1000;

function formatExpiryDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export async function sendPrizeProExpiryReminders(now = new Date()): Promise<{ sent: number; skipped: number }> {
  let sent = 0;
  let skipped = 0;

  const windowStart = new Date(now.getTime() + REMINDER_WINDOW_MS - REMINDER_TOLERANCE_MS);
  const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MS + REMINDER_TOLERANCE_MS);

  const subs = await db.subscription.findMany({
    where: {
      status: "ACTIVE",
      plan: { in: ["PRO", "BUSINESS"] },
      stripeSubscriptionId: null,
      currentPeriodEnd: { gte: windowStart, lte: windowEnd },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          notifySecurityEmail: true,
        },
      },
    },
  });

  for (const sub of subs) {
    if (isPaidStripePro(sub)) {
      skipped++;
      continue;
    }
    if (!sub.user.email || !sub.user.notifySecurityEmail) {
      skipped++;
      continue;
    }
    if (!sub.currentPeriodEnd) {
      skipped++;
      continue;
    }

    const periodKey = sub.currentPeriodEnd.toISOString().slice(0, 10);
    const existing = await db.notification.findFirst({
      where: {
        userId: sub.user.id,
        type: REMINDER_TYPE,
        message: { contains: periodKey },
      },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://linklock.org";
    const billingUrl = `${siteUrl.replace(/\/$/, "")}/billing`;
    const expiryLabel = formatExpiryDate(sub.currentPeriodEnd);

    const subject = "Your Linklock Pro from a prize code expires in 3 days";
    const html = `
      <p>Hi ${sub.user.username},</p>
      <p>Your <strong>Pro access from a reward code</strong> ends on <strong>${expiryLabel}</strong> (about 3 days from now).</p>
      <p>This is separate from a paid Stripe subscription. To keep Pro after that date, subscribe on the billing page or redeem a new code if you have one.</p>
      <p><a href="${billingUrl}">Manage billing →</a></p>
      <p>— Linklock</p>
    `;

    const result = await sendTransactionalEmail({
      to: sub.user.email,
      subject,
      html,
    });

    if (!result.ok) {
      skipped++;
      continue;
    }

    await db.notification.create({
      data: {
        userId: sub.user.id,
        type: REMINDER_TYPE,
        title: subject,
        message: `Pro from prize code ends ${periodKey}. Email sent.`,
        payload: { periodEnd: sub.currentPeriodEnd.toISOString() },
      },
    });
    sent++;
  }

  return { sent, skipped };
}

/** Run when a signed-in user loads the app — cheap no-op if nothing due. */
export async function maybeSendPrizeProReminderForUser(userId: string, now = new Date()) {
  const sub = await db.subscription.findFirst({
    where: { userId, status: "ACTIVE", plan: { in: ["PRO", "BUSINESS"] } },
    include: {
      user: { select: { id: true, email: true, username: true, notifySecurityEmail: true } },
    },
  });
  if (!sub?.currentPeriodEnd || isPaidStripePro(sub)) return;
  if (!sub.user.email || !sub.user.notifySecurityEmail) return;

  const msUntil = sub.currentPeriodEnd.getTime() - now.getTime();
  if (msUntil < REMINDER_WINDOW_MS - REMINDER_TOLERANCE_MS || msUntil > REMINDER_WINDOW_MS + REMINDER_TOLERANCE_MS) {
    return;
  }

  await sendPrizeProExpiryReminders(now);
}
