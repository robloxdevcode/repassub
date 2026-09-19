import Link from "next/link";

export function DatabaseSetupRequired() {
  const isProd = process.env.NODE_ENV === "production";

  return (
    <div className="min-h-screen bg-retro-bg flex items-center justify-center p-6">
      <div className="max-w-lg w-full border border-retro-border rounded-xl bg-retro-surface p-8">
        <p className="text-xs font-semibold tracking-wide text-retro-accent mb-3">Setup required</p>
        <h1 className="text-2xl font-semibold mb-3">Database not configured</h1>
        {isProd ? (
          <p className="text-sm text-retro-text-dim leading-relaxed mb-6">
            Production needs <code className="bg-retro-surface-2 px-1 rounded">DATABASE_URL</code> and{" "}
            <code className="bg-retro-surface-2 px-1 rounded">DIRECT_URL</code> in your Vercel project
            settings (Supabase connection strings), then redeploy.
          </p>
        ) : (
          <>
            <p className="text-sm text-retro-text-dim leading-relaxed mb-6">
              Add <code className="bg-retro-surface-2 px-1 rounded">DATABASE_URL</code> to{" "}
              <code className="bg-retro-surface-2 px-1 rounded">.env.local</code>, then run the database
              setup.
            </p>
            <ol className="text-sm space-y-2 mb-6 list-decimal list-inside text-retro-text-dim">
              <li>Copy `.env.example` to `.env.local`</li>
              <li>Add Supabase pooler URL to `DATABASE_URL` and direct URL to `DIRECT_URL`</li>
              <li>Run `npm run db:push`</li>
            </ol>
          </>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-retro-accent text-white text-sm font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
