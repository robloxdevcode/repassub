import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-3xl tracking-wider mb-8">PRIVACY POLICY</h1>
      <div className="retro-panel p-8 text-sm text-retro-text-dim space-y-4">
        <p>Last updated: January 2026</p>
        <p>Repassub collects account information through Clerk authentication and analytics data from unlock interactions.</p>
        <p>We do not sell personal data. Payment processing is handled securely by Stripe.</p>
        <p>Contact us at privacy@repassub.com for data requests.</p>
      </div>
    </div>
  );
}
