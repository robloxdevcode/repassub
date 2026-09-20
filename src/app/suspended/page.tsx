import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { RetroButton } from "@/components/retro";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { SUPPORT_DISCORD_URL } from "@/lib/support-links";

export const metadata = {
  title: "Account suspended — Linklock",
  robots: { index: false, follow: false },
};

export default function SuspendedPage() {
  return (
    <div className="classic-shell min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-retro-bg">
      <LinklockLogo size={48} className="mb-8" showWordmark wordmarkClassName="font-display text-[0.5rem]" />
      <div className="retro-panel max-w-md w-full p-8 text-center">
        <h1 className="font-display text-[0.5625rem] md:text-xs text-retro-text mb-4 uppercase leading-relaxed">
          Account suspended
        </h1>
        <p className="text-sm text-retro-text-dim leading-relaxed mb-2">
          Your Linklock account has been suspended by our team. You cannot create links, manage
          unlocks, or use paid features while suspended.
        </p>
        <p className="text-sm text-retro-text-muted leading-relaxed mb-8">
          If you think this is a mistake, contact us on{" "}
          <a
            href={SUPPORT_DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-retro-accent hover:underline font-medium"
          >
            Discord support
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <SignOutButton>
            <RetroButton variant="primary" className="w-full sm:w-auto">
              Sign out
            </RetroButton>
          </SignOutButton>
          <Link href="/">
            <RetroButton variant="secondary" className="w-full sm:w-auto">
              Back to homepage
            </RetroButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
