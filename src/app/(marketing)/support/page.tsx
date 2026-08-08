import type { Metadata } from "next";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl tracking-wider glow-text mb-6">SUPPORT</h1>
      <p className="text-retro-text-dim mb-8">Need help? We&apos;re here for you.</p>
      <div className="retro-panel p-8">
        <p className="text-sm text-retro-text-dim">Email us at</p>
        <p className="font-display text-lg text-retro-glow mt-2">support@repassub.com</p>
      </div>
    </div>
  );
}
