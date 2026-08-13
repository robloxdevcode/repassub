import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund Policy",
  description:
    "Linklock does not offer refunds on Pro subscriptions. All sales are final once payment is processed.",
  path: "/refund-policy",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-body text-base font-bold text-retro-text">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-3xl tracking-wider mb-4">REFUND POLICY</h1>
      <p className="font-body text-sm text-retro-text-dim mb-8">Last updated: August 13, 2026</p>

      <div className="retro-panel p-6 md:p-10 text-sm text-retro-text-dim space-y-8 leading-relaxed">
        <Section title="Summary">
          <p className="font-body font-semibold text-retro-ink">
            All Linklock Pro payments are final. We do not offer refunds, partial refunds, or credits for
            subscription fees.
          </p>
          <p>
            By upgrading to Pro, you agree to this policy in addition to our{" "}
            <Link href="/terms" className="text-retro-blue hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </Section>

        <Section title="1. No refunds">
          <p>
            Linklock Pro is a digital subscription service delivered immediately when payment succeeds.
            Because access to Pro features begins right away, we do not accept refund requests for any
            reason, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Change of mind or accidental purchase</li>
            <li>Failure to cancel before renewal</li>
            <li>Unused time remaining on a billing period</li>
            <li>Dissatisfaction with features or results</li>
            <li>Account suspension or termination for Terms violations</li>
          </ul>
        </Section>

        <Section title="2. Free plan">
          <p>
            The Linklock free plan costs nothing. No payment is collected and no refund applies.
          </p>
        </Section>

        <Section title="3. Cancellations">
          <p>
            You may cancel Pro at any time from{" "}
            <Link href="/billing" className="text-retro-blue hover:underline">
              Billing
            </Link>{" "}
            or the Stripe customer portal. Cancellation stops future charges; it does not refund amounts
            already paid for the current billing period.
          </p>
        </Section>

        <Section title="4. Billing errors">
          <p>
            If you believe you were charged in error (for example duplicate charges), contact us within 7
            days at{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>
            . We may investigate genuine billing mistakes at our sole discretion. This does not guarantee
            a refund.
          </p>
        </Section>

        <Section title="5. Chargebacks">
          <p>
            Filing a chargeback without contacting us first may result in immediate account suspension.
            We reserve the right to dispute invalid chargebacks and provide payment records to our
            payment processor.
          </p>
        </Section>

        <Section title="6. Changes">
          <p>
            We may update this Refund Policy from time to time. The &quot;Last updated&quot; date at the top
            reflects the latest version. Continued use of paid plans after changes means you accept the
            updated policy.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>
            Questions about billing or this policy:{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>
          </p>
        </Section>
      </div>
    </div>
  );
}
