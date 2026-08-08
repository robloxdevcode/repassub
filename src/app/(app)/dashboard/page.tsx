import { getDashboardStats } from "@/lib/actions/dashboard";
import { HudStatCard } from "@/components/retro";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Eye, Lock, TrendingUp, Users } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          Welcome back<span className="text-retro-accent">.</span>
        </h1>
        <p className="mt-2 text-sm text-retro-text-dim">Here&apos;s how your unlocks are performing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HudStatCard
          label="TOTAL UNLOCKS"
          value={formatNumber(stats.analytics.unlocked)}
          change={`${stats.analytics.conversion.toFixed(1)}% conv.`}
          positive
          icon={<Lock size={24} />}
        />
        <HudStatCard
          label="TOTAL VIEWS"
          value={formatNumber(stats.analytics.views)}
          icon={<Eye size={24} />}
        />
        <HudStatCard
          label="CAMPAIGNS"
          value={stats.campaignCount}
          icon={<TrendingUp size={24} />}
        />
        <HudStatCard
          label="AUDIENCE"
          value={formatNumber(stats.audienceCount)}
          icon={<Users size={24} />}
        />
      </div>

      <div className="mt-8 retro-panel p-6">
        <h2 className="font-display text-sm tracking-widest text-retro-text-dim mb-4">
          RECENT ACTIVITY
        </h2>
        {stats.recentEvents.length === 0 ? (
          <p className="text-sm text-retro-text-dim">No activity yet. Create your first unlock!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between border-b border-retro-border-dim/30 py-2 last:border-0"
              >
                <span className="text-sm">
                  <span className="text-retro-glow font-display text-xs">{event.type}</span>
                  {" — "}
                  {event.campaign.title}
                </span>
                <span className="text-xs text-retro-text-dim">
                  {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
