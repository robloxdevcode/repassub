import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-3xl tracking-wider mb-8">TERMS OF SERVICE</h1>
      <div className="retro-panel p-8 text-sm text-retro-text-dim space-y-4">
        <p>Last updated: January 2026</p>
        <p>By using Repassub, you agree to these terms. You are responsible for the content you create and share through unlock campaigns.</p>
        <p>You must not use Repassub for illegal activities, spam, or to collect credentials from third-party services.</p>
        <p>We reserve the right to suspend accounts that violate these terms.</p>
      </div>
    </div>
  );
}
