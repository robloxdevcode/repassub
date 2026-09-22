"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { PrizeDuration } from "@prisma/client";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";
import { AdminTable } from "@/components/admin/lemonade-admin-shell";
import {
  createPrizeCode,
  listActivePrizeCodes,
  listPrizeCodeHistory,
} from "@/lib/actions/prize-codes";
import { PRIZE_DURATION_OPTIONS } from "@/lib/prize-code";
import { PRIZE_CODE_GENERATE_COOLDOWN_MS } from "@/lib/prize-code";
import { cn } from "@/lib/utils";

type ActiveRow = Awaited<ReturnType<typeof listActivePrizeCodes>>[number];
type HistoryRow = Awaited<ReturnType<typeof listPrizeCodeHistory>>[number];

function formatCountdown(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function RewardCodesPanel({
  initialActive,
  initialHistory,
}: {
  initialActive: ActiveRow[];
  initialHistory: HistoryRow[];
}) {
  const { toast } = useToast();
  const [view, setView] = useState<"live" | "history">("live");
  const [duration, setDuration] = useState<PrizeDuration>(PrizeDuration.ONE_WEEK);
  const [active, setActive] = useState(initialActive);
  const [history, setHistory] = useState(initialHistory);
  const [freshCode, setFreshCode] = useState<{ code: string; expiresAt: string } | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [pending, startTransition] = useTransition();
  const [now, setNow] = useState(Date.now());

  const refreshLists = useCallback(async () => {
    const [a, h] = await Promise.all([listActivePrizeCodes(), listPrizeCodeHistory()]);
    setActive(a);
    setHistory(h);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (cooldownMs <= 0) return;
    const t = setInterval(() => {
      setCooldownMs((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldownMs]);

  useEffect(() => {
    if (view !== "live") return;
    const t = setInterval(() => {
      void refreshLists();
    }, 30_000);
    return () => clearInterval(t);
  }, [view, refreshLists]);

  function handleGenerate() {
    startTransition(async () => {
      const result = await createPrizeCode(duration);
      if (!result.ok) {
        if (result.retryAfterMs) setCooldownMs(result.retryAfterMs);
        toast(result.message, "error");
        return;
      }
      setFreshCode({ code: result.code, expiresAt: result.expiresAt });
      setCooldownMs(PRIZE_CODE_GENERATE_COOLDOWN_MS);
      toast("Code generated — send it to the winner within 2 minutes", "success");
      await refreshLists();
    });
  }

  async function copyCode() {
    if (!freshCode) return;
    try {
      await navigator.clipboard.writeText(freshCode.code);
      toast("Copied", "success");
    } catch {
      toast("Copy failed", "error");
    }
  }

  const freshExpiresIn = freshCode ? new Date(freshCode.expiresAt).getTime() - now : 0;

  return (
    <div className="admin-v2-section">
      <div className="admin-v2-section-head">
        <div>
          <h2 className="admin-v2-h2">Reward codes</h2>
          <p className="admin-v2-muted">
            Generate one-time codes for Discord giveaway winners. Codes expire after 2 minutes if unused.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            className={cn("admin-v2-toolbar-btn", view === "live" && "ring-2 ring-retro-accent")}
            onClick={() => setView("live")}
          >
            Live
          </button>
          <button
            type="button"
            className={cn("admin-v2-toolbar-btn", view === "history" && "ring-2 ring-retro-accent")}
            onClick={() => setView("history")}
          >
            History
          </button>
          {view === "live" ? (
            <button
              type="button"
              className="admin-v2-toolbar-btn"
              disabled={pending}
              onClick={() => startTransition(() => refreshLists())}
            >
              Refresh list
            </button>
          ) : null}
        </div>
      </div>

      {view === "live" ? (
        <>
          <div className="admin-v2-role-card max-w-xl mb-6 space-y-4">
            <label className="block text-sm font-semibold text-retro-text">Pro reward length</label>
            <select
              className="admin-v2-select w-full max-w-xs"
              value={duration}
              onChange={(e) => setDuration(e.target.value as PrizeDuration)}
            >
              {PRIZE_DURATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <RetroButton
              variant="primary"
              loading={pending}
              disabled={cooldownMs > 0}
              onClick={handleGenerate}
            >
              {cooldownMs > 0 ? `Generate (${formatCountdown(cooldownMs)})` : "Generate new code"}
            </RetroButton>
          </div>

          {freshCode && freshExpiresIn > 0 ? (
            <div className="admin-v2-role-card max-w-xl mb-6 border-2 border-retro-accent bg-orange-50/80">
              <p className="text-xs font-bold uppercase text-retro-text-muted mb-2">Active code — copy now</p>
              <p className="font-mono text-xl font-bold tracking-wide break-all">{freshCode.code}</p>
              <p className="text-sm text-retro-text-muted mt-2">
                Expires in {formatCountdown(freshExpiresIn)}
              </p>
              <RetroButton variant="secondary" className="mt-4" onClick={copyCode}>
                Copy code
              </RetroButton>
            </div>
          ) : freshCode ? (
            <p className="text-sm text-retro-text-muted mb-4">Last generated code has expired.</p>
          ) : null}

          <AdminTable>
            <table className="admin-v2-table">
              <thead>
                <tr>
                  {["Hint", "Reward", "Created by", "Expires in"].map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {active.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-v2-muted">
                      No active codes.
                    </td>
                  </tr>
                ) : (
                  active.map((row) => {
                    const left = new Date(row.expiresAt).getTime() - now;
                    return (
                      <tr key={row.id}>
                        <td>…{row.codeHint}</td>
                        <td>{row.durationLabel}</td>
                        <td>@{row.createdByUsername}</td>
                        <td>{left > 0 ? formatCountdown(left) : "Expired"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </AdminTable>
        </>
      ) : (
        <AdminTable>
          <table className="admin-v2-table">
            <thead>
              <tr>
                {["Status", "Hint", "Reward", "Winner", "Created by", "When"].map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-v2-muted">
                    No history yet.
                  </td>
                </tr>
              ) : (
                history.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span
                        className={
                          row.status === "REDEEMED"
                            ? "admin-v2-badge admin-v2-badge--ok"
                            : "admin-v2-badge"
                        }
                      >
                        {row.status === "REDEEMED" ? "Redeemed" : "Expired"}
                      </span>
                    </td>
                    <td>…{row.codeHint}</td>
                    <td>{row.durationLabel}</td>
                    <td>
                      {row.redeemedByUsername ? (
                        <>
                          @{row.redeemedByUsername}
                          {row.redeemedByDisplayName ? (
                            <span className="admin-v2-muted text-xs block">{row.redeemedByDisplayName}</span>
                          ) : null}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>@{row.createdByUsername}</td>
                    <td className="text-sm admin-v2-muted">
                      {row.redeemedAt
                        ? new Date(row.redeemedAt).toLocaleString()
                        : new Date(row.expiresAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminTable>
      )}
    </div>
  );
}
