import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";

export function HomeLanding() {
  return (
    <div className="llv2-page">
      <section className="llv2-hero llv2-hero--center">
        <div className="llv2-hero-inner llv2-hero-inner--narrow">
          <p className="llv2-kicker">Linklock</p>
          <h1 className="llv2-title">
            Subscribe-to-unlock
            <br />
            links for creators
          </h1>
          <p className="llv2-sub llv2-sub--center">
            One link. Your steps. Their download. No clutter.
          </p>
          <div className="llv2-hero-actions">
            <MarketingAuthLink href="/sign-up">
              <span className="llv2-cta">Create your link</span>
            </MarketingAuthLink>
          </div>
          <p className="llv2-footnote">
            Free to start ·{" "}
            <Link href="/sign-in" className="llv2-footnote-link">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
