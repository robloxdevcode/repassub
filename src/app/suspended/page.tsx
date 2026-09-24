import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RetroButton } from "@/components/retro";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { getCurrentUser } from "@/lib/auth";
import { SUPPORT_DISCORD_URL } from "@/lib/support-links";

export const metadata = {
  title: "Account suspended — Linklock",
  robots: { index: false, follow: false },
};

export default async function SuspendedPage() {
  const user = await getCurrentUser();
  if (!user?.banned) {
    redirect("/");
  }

  const reason = user.banReason?.trim() || "Your account was suspended by Linklock staff.";

  return (
    <div className="classic-shell min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-retro-bg">
      <LinklockLogo size={48} variant="lockup" className="mb-8" />
      <div className="retro-panel max-w-md w-full p-8 text-center">
        <h1 className="font-display text-[0.5625rem] md:text-xs text-retro-text mb-4 uppercase leading-relaxed">
          Account suspended
        </h1>
        <p className="text-sm text-retro-text-dim leading-relaxed mb-4">
          You cannot create links, manage unlocks, or use paid features while suspended.
        </p>
        <div className="classic-panel p-4 mb-6 text-left">
          <p className="font-display text-[0.4375rem] uppercase text-retro-text-muted mb-2">Reason</p>
          <p className="text-sm font-semibold text-retro-text leading-relaxed">{reason}</p>
        </div>
        <p className="text-sm text-retro-text-muted leading-relaxed mb-8">
          Think this is a mistake?{" "}
          <a
            href={SUPPORT_DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-retro-accent hover:underline font-medium"
          >
            Discord support
          </a>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <SignOutButton redirectUrl="/">
            <RetroButton variant="primary" className="w-full sm:w-auto">
              Sign out
            </RetroButton>
          </SignOutButton>
          <Link href="/">
            <RetroButton variant="secondary" className="w-full sm:w-auto">
              Homepage
            </RetroButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
