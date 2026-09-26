const UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

export type DurationParseResult =
  | { ok: true; ms: number; label: string }
  | { ok: false; message: string };

export function parseDuration(input: string, maxMs = 30 * 86_400_000): DurationParseResult {
  const raw = input.trim().toLowerCase();
  if (!raw) return { ok: false, message: "Duration cannot be empty." };

  const match = /^(\d+)([smhdw])$/.exec(raw);
  if (!match) {
    return { ok: false, message: "Use formats like 10s, 5m, 2h, 3d, or 1w." };
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const unitMs = UNIT_MS[unit];
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Duration must be a positive number." };
  }

  const ms = amount * unitMs;
  if (ms > maxMs) {
    return { ok: false, message: `Duration cannot exceed ${Math.floor(maxMs / 86_400_000)} days.` };
  }

  return { ok: true, ms, label: raw };
}

export function formatDurationMs(ms: number): string {
  if (ms % UNIT_MS.w === 0) return `${ms / UNIT_MS.w}w`;
  if (ms % UNIT_MS.d === 0) return `${ms / UNIT_MS.d}d`;
  if (ms % UNIT_MS.h === 0) return `${ms / UNIT_MS.h}h`;
  if (ms % UNIT_MS.m === 0) return `${ms / UNIT_MS.m}m`;
  return `${Math.round(ms / 1000)}s`;
}
