import Link from "next/link";

export function DatabaseSchemaOutdated() {
  return (
    <div className="min-h-screen bg-retro-bg flex items-center justify-center p-6">
      <div className="max-w-lg w-full border border-retro-border rounded-xl bg-retro-surface p-8">
        <p className="text-xs font-semibold tracking-wide text-retro-warning mb-3">Database update</p>
        <h1 className="text-2xl font-semibold mb-3">Schema sync in progress</h1>
        <p className="text-sm text-retro-text-dim leading-relaxed mb-6">
          A new deploy is applying database changes. If this screen stays more than a few minutes,
          trigger a redeploy on Vercel or run <code className="bg-retro-surface-2 px-1 rounded">npm run db:push</code>{" "}
          against your Supabase project.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-full bg-retro-accent text-[#0a0a0a] text-sm font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
