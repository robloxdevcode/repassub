import Link from "next/link";

export function DatabaseSetupRequired() {
  return (
    <div className="min-h-screen bg-retro-bg flex items-center justify-center p-6">
      <div className="max-w-lg w-full brutal-border brutal-shadow bg-retro-surface p-8">
        <p className="font-display text-[8px] text-retro-accent mb-3">SETUP REQUIRED</p>
        <h1 className="font-body text-2xl font-bold mb-3">Database not configured</h1>
        <p className="font-body text-sm text-retro-text-dim leading-relaxed mb-6">
          Add <code className="bg-retro-surface-2 px-1">DATABASE_URL</code> to{" "}
          <code className="bg-retro-surface-2 px-1">.env.local</code>, then run the database setup.
        </p>
        <ol className="font-body text-sm space-y-2 mb-6 list-decimal list-inside text-retro-text">
          <li>Copy <code className="bg-retro-surface-2 px-1">.env.example</code> to <code className="bg-retro-surface-2 px-1">.env.local</code></li>
          <li>
            Create a free project at{" "}
            <a href="https://supabase.com" className="text-retro-blue underline" target="_blank" rel="noreferrer">
              Supabase
            </a>
            , then copy the <strong>Direct connection</strong> URI (port 5432) into{" "}
            <code className="bg-retro-surface-2 px-1">DATABASE_URL</code>
          </li>
          <li>Run <code className="bg-retro-surface-2 px-1">npm run db:push</code></li>
          <li>Restart <code className="bg-retro-surface-2 px-1">npm run dev</code></li>
        </ol>
        <Link
          href="/"
          className="font-display text-[8px] inline-block bg-retro-accent text-white px-4 py-2 border-2 border-retro-ink brutal-shadow-sm"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
