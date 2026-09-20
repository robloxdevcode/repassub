"use server";

export type ClaimEasterEggResult = {
  ok: boolean;
  already?: boolean;
  message: string;
  eggName?: string;
};

export async function getFoundEasterEggBadges(): Promise<string[]> {
  return [];
}

export async function claimEasterEgg(_eggId: string): Promise<ClaimEasterEggResult> {
  return { ok: false, message: "Hidden rewards are no longer available." };
}
