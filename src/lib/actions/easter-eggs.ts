"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EASTER_EGGS, isEasterEggId } from "@/lib/easter-eggs";

export type ClaimEasterEggResult = {
  ok: boolean;
  already?: boolean;
  message: string;
  eggName?: string;
};

function badgeIdFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const eggId = (payload as { eggId?: string }).eggId;
  if (!eggId || !isEasterEggId(eggId)) return null;
  return EASTER_EGGS[eggId].badgeId;
}

export async function getFoundEasterEggBadges(): Promise<string[]> {
  const user = await requireUser();
  const notes = await db.notification.findMany({
    where: { userId: user.id, type: "easter_egg" },
    select: { payload: true },
  });

  return [
    ...new Set(
      notes
        .map((note) => badgeIdFromPayload(note.payload))
        .filter((badgeId): badgeId is string => !!badgeId)
    ),
  ];
}

async function hasClaimedEgg(userId: string, eggId: string) {
  const notes = await db.notification.findMany({
    where: { userId, type: "easter_egg" },
    select: { payload: true },
  });
  return notes.some((note) => (note.payload as { eggId?: string })?.eggId === eggId);
}

export async function claimEasterEgg(eggId: string): Promise<ClaimEasterEggResult> {
  try {
    const user = await requireUser();
    if (!isEasterEggId(eggId)) {
      return { ok: false, message: "That secret doesn't exist." };
    }

    const egg = EASTER_EGGS[eggId];
    if (await hasClaimedEgg(user.id, eggId)) {
      return {
        ok: true,
        already: true,
        eggName: egg.name,
        message: `You already found ${egg.name}.`,
      };
    }

    const proUntil =
      egg.grantsProDays != null
        ? new Date(Date.now() + egg.grantsProDays * 24 * 60 * 60 * 1000)
        : undefined;

    await db.$transaction(async (tx) => {
      if (egg.grantsProDays && proUntil) {
        await tx.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            plan: "PRO",
            status: "ACTIVE",
            currentPeriodEnd: proUntil,
          },
          update: {
            plan: "PRO",
            status: "ACTIVE",
            currentPeriodEnd: proUntil,
            stripeSubscriptionId: null,
          },
        });
      }

      await tx.notification.create({
        data: {
          userId: user.id,
          type: "easter_egg",
          title: `${egg.name} found!`,
          message: egg.rewardMessage,
          payload: { eggId, badgeId: egg.badgeId },
        },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath("/billing");

    return {
      ok: true,
      eggName: egg.name,
      message: egg.rewardMessage,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not claim reward.";
    return { ok: false, message };
  }
}
