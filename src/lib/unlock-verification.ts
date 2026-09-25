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
  strict?: boolean;
};

export type VerificationTiming = {
  minAwayMs: number;
  minVerifyMs: number;
};

export const STANDARD_VERIFY: VerificationTiming = {
  minAwayMs: MIN_STEP_AWAY_MS,
  minVerifyMs: MIN_STEP_VERIFY_MS,
};

export const STRICT_VERIFY: VerificationTiming = {
  minAwayMs: 8_000,
  minVerifyMs: 15_000,
};

export function timingForStrict(strict: boolean): VerificationTiming {
  return strict ? STRICT_VERIFY : STANDARD_VERIFY;
}

export const SOFT_QUICK_RETURN_MESSAGE =
  "You're almost there — stay on that site a few more seconds, then come back.";

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
  timing: VerificationTiming = STANDARD_VERIFY,
): { ok: true } | { ok: false; message: string; soft?: boolean } {
  if (!cookie || cookie.campaignId !== campaignId || cookie.actionId !== actionId) {
    return { ok: false, message: "Step expired — tap the button and try again." };
  }

  const elapsed = now - cookie.startedAt;
  if (elapsed < timing.minVerifyMs) {
    return { ok: false, message: "Still verifying this step…" };
  }

  if (hasExternalUrl) {
    const away = proof?.awayMs ?? 0;
    if (away < timing.minAwayMs) {
      return { ok: false, message: QUICK_RETURN_MESSAGE, soft: away > 800 };
    }
  }

  return { ok: true };
}
