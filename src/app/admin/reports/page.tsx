import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default async function AdminReportsPage() {
  await requireAdmin();

  const reports = await db.report.findMany({
    include: { reporter: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h2 className="font-display text-xl tracking-wider mb-8">REPORTS QUEUE</h2>
      <div className="retro-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-retro-border-dim">
              {["TYPE", "TARGET", "REASON", "REPORTER", "STATUS", "DATE"].map((col) => (
                <th key={col} className="px-4 py-3 text-left font-display text-xs tracking-widest text-retro-text-dim">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-retro-text-dim">No reports</td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="border-b border-retro-border-dim/30">
                  <td className="px-4 py-3">{r.targetType}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.targetId.slice(0, 8)}...</td>
                  <td className="px-4 py-3">{r.reason}</td>
                  <td className="px-4 py-3">{r.reporter?.username || "Anonymous"}</td>
                  <td className="px-4 py-3 font-display text-xs">{r.status}</td>
                  <td className="px-4 py-3 text-retro-text-dim">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
