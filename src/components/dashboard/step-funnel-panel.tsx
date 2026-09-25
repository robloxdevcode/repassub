import { formatNumber } from "@/lib/utils";
import type { StepFunnelRow } from "@/lib/analytics";

export function StepFunnelPanel({ rows }: { rows: StepFunnelRow[] }) {
  const withData = rows.filter((r) => r.views >= 5 && r.stepCount > 0);
  if (withData.length === 0) {
    return (
      <p className="text-sm text-retro-text-dim">
        Per-step drop-off appears once links have enough views and step completes are tracked.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {withData.slice(0, 6).map((row) => (
        <div key={row.campaignId} className="border-2 border-retro-ink/15 bg-retro-surface-2 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <p className="font-semibold text-sm truncate max-w-[240px]">{row.title}</p>
            <p className="text-xs text-retro-text-muted tabular-nums">
              {formatNumber(row.views)} views · {formatNumber(row.unlocked)} unlocks
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-retro-text-dim border-b border-retro-border-dim">
                  <th className="py-1.5 pr-3 font-semibold">Step</th>
                  <th className="py-1.5 pr-3 font-semibold">Completes</th>
                  <th className="py-1.5 font-semibold">Drop to next</th>
                </tr>
              </thead>
              <tbody>
                {row.stepCompletes.map((count, index) => {
                  const next = row.stepCompletes[index + 1];
                  const drop =
                    next !== undefined && count > 0 ? Math.max(0, Math.round(((count - next) / count) * 100)) : null;
                  return (
                    <tr key={index} className="border-b border-retro-border-dim/30">
                      <td className="py-2 pr-3 font-bold">Step {index + 1}</td>
                      <td className="py-2 pr-3 tabular-nums">{formatNumber(count)}</td>
                      <td className="py-2 tabular-nums text-retro-text-dim">
                        {drop === null ? "—" : drop > 0 ? `${drop}% lost` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
