import { LinklockLogo } from "@/components/brand/linklock-logo";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";

/** Single-screen public home when site is live — matches down-page drama, no scroll wall */
export function LinklockLiveLanding() {
  return (
    <div className="ll-down ll-down--live">
      <div className="ll-down-glow ll-down-glow--a" aria-hidden />
      <div className="ll-down-glow ll-down-glow--b" aria-hidden />
      <div className="ll-down-grid" aria-hidden />

      <main className="ll-down-main">
        <LinklockLogo size={56} showWordmark wordmarkClassName="ll-down-logo-text" />

        <p className="ll-down-badge ll-down-badge--live">Subscribe-to-unlock links</p>

        <h1 className="ll-down-title">
          Turn downloads
          <br />
          <span className="ll-down-title-accent">into real followers.</span>
        </h1>

        <p className="ll-down-lead">
          One link. Your steps — subscribe, follow, join. Fans unlock; you grow. Free to start.
        </p>

        <div className="ll-down-actions">
          <MarketingAuthLink href="/sign-up">
            <span className="ll-down-cta">Create your link — free</span>
          </MarketingAuthLink>
        </div>

        <p className="ll-down-sub">
          Questions?{" "}
          <a
            href="https://discord.gg/DQQTf6XXg3"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            Discord support
          </a>
        </p>
      </main>
    </div>
  );
}
