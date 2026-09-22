export default function AdminLoading() {
  return (
    <div className="admin-v2-section animate-pulse" aria-busy="true" aria-label="Loading admin page">
      <div className="h-7 w-48 bg-retro-surface-2 border-2 border-retro-border mb-3" />
      <div className="h-4 w-full max-w-xl bg-retro-surface-2 mb-8" />
      <div className="space-y-3">
        {[0, 1, 2, 4, 5].map((i) => (
          <div key={i} className="h-11 bg-retro-surface-2 border-2 border-retro-border" />
        ))}
      </div>
    </div>
  );
}
