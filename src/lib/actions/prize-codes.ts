"use server";

import { revalidatePath } from "next/cache";
import { PrizeCodeStatus, PrizeDuration } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { canAccessRewardCodes } from "@/lib/admin-access";
import { db } from "@/lib/db";
import {
  PRIZE_CODE_GENERATE_COOLDOWN_MS,
  PRIZE_CODE_ACTIVE_MS,
  addDurationToDate,
  generatePrizeCodePlaintext,
  hashPrizeCode,
  normalizePrizeCode,
  prizeCodeHint,
  prizeDurationLabel,
} from "@/lib/prize-code";
import { downgradeExpiredPrizePro, isPaidStripePro } from "@/lib/subscription-access";

async function requireRewardCodeStaff() {
  const user = await requireUser();
  if (!canAccessRewardCodes(user)) throw new Error("Forbidden");
  return user;
}

async function expireStaleActiveCodes() {
  await db.prizeCode.updateMany({
    where: {
      status: PrizeCodeStatus.ACTIVE,
      expiresAt: { lt: new Date() },
    },
    data: { status: PrizeCodeStatus.EXPIRED },
  });
}

export async function createPrizeCode(duration: PrizeDuration): Promise<
  | { ok: true; code: string; expiresAt: string; id: string }
  | { ok: false; message: string; retryAfterMs?: number }
> {
  try {
    const staff = await requireRewardCodeStaff();
    await expireStaleActiveCodes();

    const cooldownSince = new Date(Date.now() - PRIZE_CODE_GENERATE_COOLDOWN_MS);
    const recent = await db.prizeCode.findFirst({
      where: { createdById: staff.id, createdAt: { gt: cooldownSince } },
      orderBy: { createdAt: "desc" },
    });

    if (recent) {
      const retryAfterMs = recent.createdAt.getTime() + PRIZE_CODE_GENERATE_COOLDOWN_MS - Date.now();
      return {
        ok: false,
        message: "You can generate one code every 2 minutes.",
        retryAfterMs: Math.max(0, retryAfterMs),
      };
    }

    const plaintext = generatePrizeCodePlaintext();
    const normalized = normalizePrizeCode(plaintext);
    const expiresAt = new Date(Date.now() + PRIZE_CODE_ACTIVE_MS);

    const row = await db.prizeCode.create({
      data: {
        codeHash: hashPrizeCode(normalized),
        codeHint: prizeCodeHint(normalized),
        duration,
        status: PrizeCodeStatus.ACTIVE,
        expiresAt,
        createdById: staff.id,
      },
    });

    revalidatePath("/admin/reward-codes");
    return { ok: true, code: normalized, expiresAt: expiresAt.toISOString(), id: row.id };
  } catch (error) {
    console.error("[createPrizeCode]", error);
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("PrizeCode") || msg.includes("enum")) {
      return { ok: false, message: "Database needs update — run prisma/migrations/manual_prize_codes.sql" };
    }
    return { ok: false, message: "Could not generate code" };
  }
}

export async function listActivePrizeCodes() {
  await requireRewardCodeStaff();
  await expireStaleActiveCodes();

  const rows = await db.prizeCode.findMany({
    where: { status: PrizeCodeStatus.ACTIVE, expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: "asc" },
    take: 50,
    include: {
      createdBy: { select: { username: true, displayName: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    codeHint: r.codeHint,
    duration: r.duration,
    durationLabel: prizeDurationLabel(r.duration),
    expiresAt: r.expiresAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
    createdByUsername: r.createdBy.username,
  }));
}

export async function listPrizeCodeHistory(take = 100) {
  await requireRewardCodeStaff();

  const rows = await db.prizeCode.findMany({
    where: { status: { in: [PrizeCodeStatus.REDEEMED, PrizeCodeStatus.EXPIRED] } },
    orderBy: { updatedAt: "desc" },
    take,
    include: {
      createdBy: { select: { username: true } },
      redeemedBy: { select: { username: true, displayName: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    codeHint: r.codeHint,
    duration: r.duration,
    durationLabel: prizeDurationLabel(r.duration),
    createdAt: r.createdAt.toISOString(),
    expiresAt: r.expiresAt.toISOString(),
    redeemedAt: r.redeemedAt?.toISOString() ?? null,
    createdByUsername: r.createdBy.username,
    redeemedByUsername: r.redeemedBy?.username ?? null,
    redeemedByDisplayName: r.redeemedBy?.displayName ?? null,
  }));
}

export async function redeemPrizeCode(rawCode: string): Promise<
  | { ok: true; plan: "PRO"; proExpiresAt: string; durationLabel: string }
  | { ok: false; message: string }
> {
  try {
    const user = await requireUser();
    if (user.banned) return { ok: false, message: "Account suspended" };

    const sub = user.subscriptions?.[0] ?? null;
    await downgradeExpiredPrizePro(user.id, sub);
    const refreshed = await requireUser();
    const freshSub = refreshed.subscriptions?.[0] ?? null;

    if (isPaidStripePro(freshSub)) {
      return { ok: false, message: "You already have paid Pro — manage it in billing." };
    }

    const normalized = normalizePrizeCode(rawCode);
    if (normalized.length < 8) {
      return { ok: false, message: "Invalid or expired code." };
    }

    const codeHash = hashPrizeCode(normalized);
    await expireStaleActiveCodes();

    const now = new Date();
    const prize = await db.prizeCode.findUnique({ where: { codeHash } });

    if (!prize || prize.status !== PrizeCodeStatus.ACTIVE || prize.expiresAt <= now) {
      return { ok: false, message: "Invalid or expired code." };
    }

    const proExpiresAt = addDurationToDate(now, prize.duration);

    await db.$transaction(async (tx) => {
      const current = await tx.prizeCode.findUnique({ where: { id: prize.id } });
      if (!current || current.status !== PrizeCodeStatus.ACTIVE || current.expiresAt <= now) {
        throw new Error("CODE_GONE");
      }

      await tx.prizeCode.update({
        where: { id: prize.id },
        data: {
          status: PrizeCodeStatus.REDEEMED,
          redeemedByUserId: user.id,
          redeemedAt: now,
          proExpiresAt,
        },
      });

      await tx.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          plan: "PRO",
          status: "ACTIVE",
          currentPeriodEnd: proExpiresAt,
        },
        update: {
          plan: "PRO",
          status: "ACTIVE",
          stripeSubscriptionId: null,
          currentPeriodEnd: proExpiresAt,
        },
      });
    });

    revalidatePath("/pricing");
    revalidatePath("/redeem");
    revalidatePath("/billing");
    revalidatePath("/dashboard");
    revalidatePath("/admin/reward-codes");

    return {
      ok: true,
      plan: "PRO",
      proExpiresAt: proExpiresAt.toISOString(),
      durationLabel: prizeDurationLabel(prize.duration),
    };
  } catch (error) {
    if (error instanceof Error && error.message === "CODE_GONE") {
      return { ok: false, message: "Invalid or expired code." };
    }
    console.error("[redeemPrizeCode]", error);
    return { ok: false, message: "Could not redeem code. Try again." };
  }
}
