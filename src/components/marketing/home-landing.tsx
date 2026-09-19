import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";

export function HomeLanding() {
  return (
    <div className="lm-page">
      <section className="lm-hero" aria-labelledby="lm-hero-title">
        <div className="lm-hero-core">
          <h1 id="lm-hero-title" className="lm-headline">
            <span className="lm-headline-row">Turn downloads into audience</span>
            <span className="lm-headline-row lm-headline-row--echo" aria-hidden="true">
              Turn downloads into audience
            </span>
          </h1>
          <p className="lm-lede">
            Subscribe-to-unlock links for creators. One URL, your steps, their file.
          </p>
          <div className="lm-actions">
            <MarketingAuthLink href="/sign-up">
              <span className="lm-btn lm-btn--primary">Get started</span>
            </MarketingAuthLink>
            <Link href="/pricing" className="lm-btn lm-btn--ghost">
              See pricing
            </Link>
          </div>
        </div>
        <footer className="lm-hero-footer">
          <p>
            <Link href="/sign-in" className="lm-inline-link">
              Sign in
            </Link>
            <span className="lm-dot" aria-hidden="true">
              ·
            </span>
            <Link href="/terms" className="lm-inline-link">
              Terms
            </Link>
            <span className="lm-dot" aria-hidden="true">
              ·
            </span>
            <span>© Linklock</span>
          </p>
        </footer>
      </section>
    </div>
  );
}
