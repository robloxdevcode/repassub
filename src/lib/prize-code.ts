import { createHash, randomBytes } from "crypto";
import type { PrizeDuration } from "@prisma/client";

const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function pepper() {
  return process.env.PRIZE_CODE_PEPPER?.trim() || process.env.CLERK_SECRET_KEY?.slice(0, 32) || "linklock-dev-pepper";
}

export function normalizePrizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function hashPrizeCode(normalized: string): string {
  return createHash("sha256").update(`${pepper()}:${normalized}`).digest("hex");
}

function randomSegment(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
  }
  return out;
}

/** Format: LLPRIZE-XXXX-XXXX */
export function generatePrizeCodePlaintext(): string {
  return `LLPRIZE-${randomSegment(4)}-${randomSegment(4)}`;
}

export function prizeCodeHint(normalized: string): string {
  const parts = normalized.split("-");
  const last = parts[parts.length - 1];
  return last && last.length >= 4 ? last.slice(-4) : normalized.slice(-4);
}

export const PRIZE_CODE_ACTIVE_MS = 2 * 60 * 1000;
export const PRIZE_CODE_GENERATE_COOLDOWN_MS = 2 * 60 * 1000;

export function prizeDurationLabel(duration: PrizeDuration): string {
  switch (duration) {
    case "ONE_DAY":
      return "1 day Pro";
    case "ONE_WEEK":
      return "1 week Pro";
    case "ONE_MONTH":
      return "1 month Pro";
    case "ONE_YEAR":
      return "1 year Pro";
    default:
      return duration;
  }
}

export const PRIZE_DURATION_OPTIONS: { value: PrizeDuration; label: string }[] = [
  { value: "ONE_DAY", label: "1 day Pro" },
  { value: "ONE_WEEK", label: "1 week Pro" },
  { value: "ONE_MONTH", label: "1 month Pro" },
  { value: "ONE_YEAR", label: "1 year Pro" },
];

export function addDurationToDate(from: Date, duration: PrizeDuration): Date {
  const d = new Date(from);
  switch (duration) {
    case "ONE_DAY":
      d.setDate(d.getDate() + 1);
      break;
    case "ONE_WEEK":
      d.setDate(d.getDate() + 7);
      break;
    case "ONE_MONTH":
      d.setMonth(d.getMonth() + 1);
      break;
    case "ONE_YEAR":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d;
}
