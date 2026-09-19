"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";

const REF_COOKIE = "ll_ref";
const REFERRAL_TYPE = "referral_signup";

export async function getReferralLink() {
  const user = await requireUser();
  return `${absoluteUrl("/sign-up")}?ref=${encodeURIComponent(user.username)}`;
}

export async function getReferralStats() {
  const user = await requireUser();
  const rows = await db.notification.findMany({
    where: { userId: user.id, type: REFERRAL_TYPE },
    select: { id: true, createdAt: true, payload: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return {
    count: rows.length,
    recent: rows.map((r) => ({
      id: r.id,
      username: (r.payload as { referredUsername?: string })?.referredUsername ?? "Someone",
      at: r.createdAt,
    })),
  };
}

export async function claimReferralCookie() {
  const user = await requireUser();
  const jar = await cookies();
  const ref = jar.get(REF_COOKIE)?.value?.trim().toLowerCase();
  if (!ref || ref === user.username) return { claimed: false };

  const referrer = await db.user.findUnique({ where: { username: ref } });
  if (!referrer || referrer.banned) {
    jar.delete(REF_COOKIE);
    return { claimed: false };
  }

  const existing = await db.notification.findMany({
    where: { userId: referrer.id, type: REFERRAL_TYPE },
    select: { payload: true },
  });
  if (existing.some((n) => (n.payload as { referredUserId?: string })?.referredUserId === user.id)) {
    jar.delete(REF_COOKIE);
    return { claimed: false };
  }

  await db.notification.create({
    data: {
      userId: referrer.id,
      type: REFERRAL_TYPE,
      title: "New signup from your link",
      message: `@${user.username} joined Linklock via your invite.`,
      payload: { referredUserId: user.id, referredUsername: user.username },
      read: false,
    },
  });

  jar.delete(REF_COOKIE);
  revalidatePath("/dashboard");
  return { claimed: true, referrer: referrer.username };
}
