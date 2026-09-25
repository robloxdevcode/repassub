import Link from "next/link";

export function PlanSyncBanner() {
  return (
    <div
      className="mb-6 border-2 border-retro-ink bg-retro-yellow/90 px-4 py-3 text-sm text-retro-ink"
      role="status"
    >
      <p className="font-bold">Your Pro access expired</p>
      <p className="mt-1 text-retro-ink/90 leading-relaxed">
        Billing still shows a Pro prize or legacy plan, but your account is on Free limits until you renew. Upgrade or
        redeem a new code to restore Pro features.
      </p>
      <Link href="/billing" className="mt-2 inline-block font-bold underline underline-offset-2">
        Review billing →
      </Link>
    </div>
  );
}
