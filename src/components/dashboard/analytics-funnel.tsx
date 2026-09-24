import { formatNumber } from "@/lib/utils";

type FunnelAnalytics = {
  views: number;
  started: number;
  actionComplete: number;
  unlocked: number;
};

function pct(part: number, whole: number) {
  if (whole <= 0) return 0;
  return (part / whole) * 100;
}

export function AnalyticsFunnel({ analytics }: { analytics: FunnelAnalytics }) {
  const { views, started, actionComplete, unlocked } = analytics;

  const stages = [
    { label: "Page views", value: views, rate: 100 },
    { label: "Started a step", value: started, rate: pct(started, views) },
    { label: "Finished a step", value: actionComplete, rate: pct(actionComplete, views) },
    { label: "Unlocked", value: unlocked, rate: pct(unlocked, views) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage, index) => (
        <div key={stage.label} className="rounded-xl border-2 border-retro-border bg-retro-surface-2/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-retro-text-muted">{stage.label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-retro-text">{formatNumber(stage.value)}</p>
          <p className="mt-1 text-xs text-retro-text-dim">
            {index === 0 ? "Top of funnel" : `${stage.rate.toFixed(1)}% of views`}
          </p>
          <div className="mt-3 h-2 border border-retro-border bg-retro-surface overflow-hidden">
            <div
              className="h-full bg-retro-accent transition-all duration-500"
              style={{ width: `${Math.min(100, stage.rate)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
