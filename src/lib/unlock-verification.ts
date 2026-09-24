/** Shared unlock step timing — used on fan pages and server validation. */

export const MIN_STEP_AWAY_MS = 5000;
export const MIN_STEP_VERIFY_MS = 10_000;

export const QUICK_RETURN_MESSAGE =
  "Please redo the quest — you didn't spend enough time on that step.";

export const STEP_VERIFY_COOKIE = "linklock_step_verify";

export type StepVerifyCookie = {
  campaignId: string;
  actionId: string;
  startedAt: number;
  hasExternalUrl: boolean;
};

export type ActionCompletionProof = {
  awayMs?: number;
};

export function validateActionCompletionProof(
  cookie: StepVerifyCookie | null,
  campaignId: string,
  actionId: string,
  hasExternalUrl: boolean,
  proof: ActionCompletionProof | undefined,
  now = Date.now(),
): { ok: true } | { ok: false; message: string } {
  if (!cookie || cookie.campaignId !== campaignId || cookie.actionId !== actionId) {
    return { ok: false, message: "Step expired — tap the button and try again." };
  }

  const elapsed = now - cookie.startedAt;
  if (elapsed < MIN_STEP_VERIFY_MS) {
    return { ok: false, message: "Still verifying this step…" };
  }

  if (hasExternalUrl) {
    const away = proof?.awayMs ?? 0;
    if (away < MIN_STEP_AWAY_MS) {
      return { ok: false, message: QUICK_RETURN_MESSAGE };
    }
  }

  return { ok: true };
}
