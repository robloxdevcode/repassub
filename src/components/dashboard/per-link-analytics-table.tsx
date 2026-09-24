import { formatNumber } from "@/lib/utils";

export type CampaignStatRow = {
  id: string;
  title: string;
  slug: string;
  views: number;
  started: number;
  actionComplete: number;
  unlocked: number;
  conversion: number;
  dropOffBeforeStart: number;
  dropOffBeforeUnlock: number;
};

export function PerLinkAnalyticsTable({
  rows,
  showDropOff = true,
  showFunnelColumns = true,
}: {
  rows: CampaignStatRow[];
  showDropOff?: boolean;
  showFunnelColumns?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-retro-text-dim">No links yet — publish one to see stats here.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-retro-border-dim text-left text-retro-text-dim">
            <th className="py-2 pr-4 text-xs font-semibold">Link</th>
            <th className="py-2 pr-4 text-xs font-semibold">Views</th>
            {showFunnelColumns ? (
              <th className="py-2 pr-4 text-xs font-semibold">Started</th>
            ) : null}
            <th className="py-2 pr-4 text-xs font-semibold">Unlocks</th>
            <th className="py-2 pr-4 text-xs font-semibold">Conv.</th>
            {showDropOff ? (
              <>
                <th className="py-2 pr-4 text-xs font-semibold">Left early</th>
                <th className="py-2 text-xs font-semibold">Stuck mid-funnel</th>
              </>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-retro-border-dim/30">
              <td className="py-3 pr-4 font-semibold max-w-[180px] truncate">{row.title}</td>
              <td className="py-3 pr-4 tabular-nums">{formatNumber(row.views)}</td>
              {showFunnelColumns ? (
                <td className="py-3 pr-4 tabular-nums">{formatNumber(row.started)}</td>
              ) : null}
              <td className="py-3 pr-4 tabular-nums">{formatNumber(row.unlocked)}</td>
              <td className="py-3 pr-4 tabular-nums">{row.conversion.toFixed(1)}%</td>
              {showDropOff ? (
                <>
                  <td className="py-3 pr-4 tabular-nums text-retro-text-dim">
                    {formatNumber(row.dropOffBeforeStart)}
                  </td>
                  <td className="py-3 tabular-nums text-retro-text-dim">
                    {formatNumber(row.dropOffBeforeUnlock)}
                  </td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      {showDropOff ? (
        <p className="mt-3 text-xs text-retro-text-muted leading-relaxed">
          <strong>Left early</strong> = viewed but never started a step.{" "}
          <strong>Stuck mid-funnel</strong> = started steps but didn&apos;t unlock.
        </p>
      ) : null}
    </div>
  );
}
