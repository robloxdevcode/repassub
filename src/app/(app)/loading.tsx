export default function AppLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-6 pt-2">
      <div className="h-9 w-48 rounded-lg bg-retro-surface-2" />
      <div className="h-4 w-72 max-w-full rounded bg-retro-surface-2" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="h-24 rounded-xl bg-retro-surface-2" />
        <div className="h-24 rounded-xl bg-retro-surface-2" />
        <div className="h-24 rounded-xl bg-retro-surface-2 col-span-2 sm:col-span-1" />
      </div>
      <div className="h-40 rounded-xl bg-retro-surface-2" />
    </div>
  );
}
