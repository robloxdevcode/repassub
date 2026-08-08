import { getAudienceData } from "@/lib/actions/dashboard";

export default async function AudiencePage() {
  const audience = await getAudienceData();

  return (
    <div>
      <h1 className="font-display text-2xl tracking-wider mb-2">AUDIENCE DATABASE</h1>
      <p className="text-sm text-retro-text-dim mb-8">Your verified audience members</p>

      <div className="retro-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-retro-border-dim">
                {["NAME", "EMAIL", "SOURCE", "JOINED", "STATUS"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left font-display text-xs tracking-widest text-retro-text-dim">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {audience.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-retro-text-dim">
                    No audience members yet
                  </td>
                </tr>
              ) : (
                audience.map((member) => (
                  <tr key={member.id} className="border-b border-retro-border-dim/30 hover:bg-retro-surface-2">
                    <td className="px-4 py-3">{member.name || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{member.email || "—"}</td>
                    <td className="px-4 py-3">{member.source || "—"}</td>
                    <td className="px-4 py-3 text-retro-text-dim">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-display text-xs ${
                          member.status === "VERIFIED"
                            ? "text-retro-success"
                            : member.status === "ACTIVE"
                            ? "text-retro-glow"
                            : "text-retro-text-dim"
                        }`}
                      >
                        ● {member.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
