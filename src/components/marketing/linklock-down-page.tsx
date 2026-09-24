import { LinklockLogo } from "@/components/brand/linklock-logo";
import { MemphisDecorations } from "@/components/retro/memphis-ui";
import { RetroBackground } from "@/components/retro/retro-background";

export function LinklockDownPage() {
  return (
    <div className="classic-shell classic-down">
      <RetroBackground />
      <MemphisDecorations />

      <main className="classic-down-main">
        <LinklockLogo size={56} variant="lockup" className="justify-center" />

        <p className="classic-down-badge classic-blink">OFFLINE — BE RIGHT BACK</p>

        <h1 className="classic-down-title">
          We&apos;re polishing the
          <br />
          classic experience.
        </h1>

        <p className="classic-down-lead">
          Linklock is taking a quick break while we make unlocks smoother, faster, and even more fun.
        </p>

        <p className="classic-down-sub">Try again later — thanks for waiting, creator.</p>

        <p className="classic-down-team">— TEAM LINKLOCK</p>
      </main>
    </div>
  );
}
