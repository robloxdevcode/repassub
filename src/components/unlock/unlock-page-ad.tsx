import Link from "next/link";
import { RetroButton } from "@/components/retro";

export function UnlockPageAd() {
  return (
    <div className="mt-5 brutal-border bg-retro-surface-2 p-3 text-center" data-ad-slot="unlock-page">
      <p className="font-display text-[7px] text-retro-text-muted mb-2">AD</p>
      <p className="font-body text-xs font-bold">Sponsored</p>
      <p className="text-[10px] text-retro-text-dim mt-1 mb-3 leading-relaxed">
        Free unlock pages include ads. Creators can upgrade to Pro to remove them.
      </p>
      <Link href="/pricing">
        <RetroButton variant="secondary" size="sm">
          Go ad-free with Pro
        </RetroButton>
      </Link>
    </div>
  );
}
