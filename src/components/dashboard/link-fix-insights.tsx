import Link from "next/link";
import { RetroCard } from "@/components/retro";
import type { CampaignStatRow } from "@/components/dashboard/per-link-analytics-table";

type Insight = {
  id: string;
  title: string;
  headline: string;
  action: string;
};

function buildInsights(rows: CampaignStatRow[]): Insight[] {
  const insights: Insight[] = [];

  for (const row of rows) {
    if (row.views < 8) continue;

    const leaveBeforeStartPct = row.views > 0 ? ((row.views - row.started) / row.views) * 100 : 0;
    if (leaveBeforeStartPct >= 45) {
      insights.push({
        id: row.id,
        title: row.title,
        headline: `${Math.round(leaveBeforeStartPct)}% leave before starting step 1`,
        action: "Try a shorter title, one clear step, or a simpler first action (e.g. Subscribe only).",
      });
      continue;
    }

    if (row.started >= 5 && row.dropOffBeforeUnlock >= 3) {
      const stuckPct = row.started > 0 ? (row.dropOffBeforeUnlock / row.started) * 100 : 0;
      if (stuckPct >= 35) {
        insights.push({
          id: row.id,
          title: row.title,
          headline: `${Math.round(stuckPct)}% start but never unlock`,
          action: "Fewer steps, clearer button labels, or turn off strict verification if fans bounce.",
        });
      }
    }
  }

  return insights.slice(0, 5);
}

export function LinkFixInsights({ rows }: { rows: CampaignStatRow[] }) {
  const insights = buildInsights(rows);
  if (insights.length === 0) return null;

  return (
    <RetroCard className="mb-8 p-6">
      <h2 className="text-sm font-semibold mb-1">Fix this link</h2>
      <p className="text-xs text-retro-text-muted mb-4">
        Quick reads from your funnel — one suggested action per link.
      </p>
      <ul className="space-y-4">
        {insights.map((item) => (
          <li key={item.id} className="border-2 border-retro-ink/15 bg-retro-surface-2 p-4">
            <p className="font-semibold text-sm truncate">{item.title}</p>
            <p className="text-sm text-retro-accent font-bold mt-1">{item.headline}</p>
            <p className="text-xs text-retro-text-dim mt-2 leading-relaxed">{item.action}</p>
            <Link href={`/create?id=${item.id}`} className="inline-block mt-3 text-xs font-bold text-retro-accent hover:underline">
              Edit link →
            </Link>
          </li>
        ))}
      </ul>
    </RetroCard>
  );
}
