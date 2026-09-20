import { LinklockLogo } from "@/components/brand/linklock-logo";

export function LinklockDownPage() {
  return (
    <div className="ll-down">
      <div className="ll-down-glow ll-down-glow--a" aria-hidden />
      <div className="ll-down-glow ll-down-glow--b" aria-hidden />
      <div className="ll-down-grid" aria-hidden />

      <main className="ll-down-main">
        <LinklockLogo size={56} showWordmark wordmarkClassName="ll-down-logo-text" />

        <p className="ll-down-badge">Linklock is down</p>

        <h1 className="ll-down-title">
          We&apos;re rebuilding
          <br />
          <span className="ll-down-title-accent">something better.</span>
        </h1>

        <p className="ll-down-lead">
          Linklock is offline for a short time while the team makes things sharper, faster, and
          more reliable.
        </p>

        <p className="ll-down-sub">
          Please try again later. Thank you for your patience — we&apos;ll be back soon.
        </p>

        <p className="ll-down-team">— The Linklock team</p>
      </main>
    </div>
  );
}
