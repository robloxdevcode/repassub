import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { campaignViewCountSelect } from "@/lib/analytics";

export default async function AdminUnlocksPage() {
  await requireAdmin();

  const campaigns = await db.campaign.findMany({
    include: {
      user: { select: { username: true } },
      _count: { select: campaignViewCountSelect },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h2 className="font-display text-xl tracking-wider mb-8">UNLOCK MANAGEMENT</h2>
      <div className="retro-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-retro-border-dim">
              {["TITLE", "CREATOR", "STATUS", "VIEWS", "CREATED"].map((col) => (
                <th key={col} className="px-4 py-3 text-left font-display text-xs tracking-widest text-retro-text-dim">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-retro-border-dim/30">
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3">@{c.user.username}</td>
                <td className="px-4 py-3 font-display text-xs">{c.status}</td>
                <td className="px-4 py-3">{c._count.analyticsEvents}</td>
                <td className="px-4 py-3 text-retro-text-dim">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
