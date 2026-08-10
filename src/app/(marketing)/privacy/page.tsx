import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "How Linklock collects, uses, and protects your data.",
  path: "/privacy",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-body text-base font-bold text-retro-text">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-3xl tracking-wider mb-4">PRIVACY POLICY</h1>
      <p className="font-body text-sm text-retro-text-dim mb-8">Last updated: August 9, 2026</p>

      <div className="retro-panel p-6 md:p-10 text-sm text-retro-text-dim space-y-8 leading-relaxed">
        <Section title="1. Introduction">
          <p>
            Linklock (&quot;Linklock,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your
            privacy. This Privacy Policy explains how we collect, use, disclose, and protect information
            when you use our website, creator dashboard, public unlock pages, and related services
            (collectively, the &quot;Service&quot;).
          </p>
          <p>
            This Policy applies to creators who register for accounts and to visitors who interact with
            public unlock pages. By using the Service, you agree to the practices described here. If you do
            not agree, please do not use the Service.
          </p>
          <p>
            This Policy is incorporated into our Terms of Service. Capitalized terms not defined here have
            the meanings given in the Terms.
          </p>
        </Section>

        <Section title="2. Roles: Creators vs. Visitors">
          <p>
            <strong>Creators</strong> are users who sign up through Clerk authentication and build unlock
            campaigns. We process creator account data to provide the Service, billing, support, and
            analytics.
          </p>
          <p>
            <strong>Visitors</strong> are people who open a public unlock link (for example{" "}
            <code className="text-xs bg-retro-surface-2 px-1 py-0.5 border border-retro-ink/20">
              /u/username/slug
            </code>
            ). Visitors generally do not need a Linklock account. When a creator collects emails or other
            information from visitors through an unlock step, the creator is responsible for their own
            privacy obligations to that audience—we process such data on the creator&apos;s behalf as
            described below.
          </p>
        </Section>

        <Section title="3. Information We Collect">
          <p>
            <strong>Account and profile information (creators).</strong> When you register, we receive
            information from our authentication provider (Clerk), such as email address, name, username,
            profile photo, and authentication identifiers. You may also provide a display name, bio, and
            custom username in your Linklock profile settings.
          </p>
          <p>
            <strong>Campaign and content data.</strong> We store unlock campaign titles, descriptions,
            slugs, step configurations (platform, button labels, external URLs), unlock content (external
            URLs or text you provide), themes, and publication status. We do not host downloadable files on
            our servers when you use link-based content types.
          </p>
          <p>
            <strong>Analytics and unlock interaction data.</strong> When someone views or uses an unlock
            page, we may record events such as page views, session starts, step completions, and successful
            unlocks. We may also store a pseudonymous visitor identifier in a cookie (
            <code className="text-xs bg-retro-surface-2 px-1 py-0.5 border border-retro-ink/20">
              linklock_visitor
            </code>
            ) to remember progress through steps on a device. Where available, we may collect coarse
            metadata such as referrer source, device type, browser, or country derived from request headers
            or analytics tools.
          </p>
          <p>
            <strong>Audience data.</strong> If you use email-collection steps, we store email addresses (and
            optional names) submitted by visitors in your audience list, associated with your account.
          </p>
          <p>
            <strong>Payment information.</strong> If you subscribe to a paid plan, payment details are
            collected and processed by Stripe. We receive subscription status, plan type, and billing-related
            identifiers from Stripe—not your full card number.
          </p>
          <p>
            <strong>Communications.</strong> If you contact us at{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>
            , we retain the content of your messages and associated contact information to respond and
            maintain support records.
          </p>
          <p>
            <strong>Technical and usage logs.</strong> Our hosting and infrastructure providers may
            automatically log IP addresses, timestamps, user agents, error reports, and performance data
            necessary to secure and operate the Service.
          </p>
        </Section>

        <Section title="4. How We Use Information">
          <p>We use collected information to:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Create and maintain your account and authenticate you</li>
            <li>Publish and render unlock pages you configure</li>
            <li>Track analytics and show statistics in your dashboard</li>
            <li>Enforce plan limits (such as weekly link quotas on the Free plan)</li>
            <li>Process subscriptions and send billing-related communications via Stripe</li>
            <li>Send optional email notifications you enable (for example unlock alerts via Resend)</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Detect, prevent, and address fraud, abuse, and security incidents</li>
            <li>Comply with legal obligations and enforce our Terms of Service</li>
            <li>Improve the Service through aggregated or de-identified analysis</li>
          </ul>
          <p>
            We do not sell your personal information to third parties for their independent marketing
            purposes.
          </p>
        </Section>

        <Section title="5. Legal Bases for Processing (EEA/UK)">
          <p>
            If you are in the European Economic Area or United Kingdom, we process personal data on one or
            more of the following bases: performance of a contract with you (providing the Service);
            legitimate interests (security, analytics, product improvement, fraud prevention); compliance
            with legal obligations; and consent where required (for example optional marketing emails if we
            offer them separately).
          </p>
          <p>
            Creators who collect visitor emails must ensure they have an appropriate legal basis under
            applicable law (such as consent or legitimate interest) and provide their own notices to visitors.
          </p>
        </Section>

        <Section title="6. How We Share Information">
          <p>We may share information with:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Service providers</strong> who help us operate the Service, such as Clerk
              (authentication), Supabase/PostgreSQL hosting (database), Vercel or similar (hosting), Stripe
              (payments), Resend (transactional email), Cloudflare or similar (infrastructure), and
              analytics providers if enabled
            </li>
            <li>
              <strong>Creators</strong>, in the sense that analytics and audience submissions belong to the
              creator account associated with a campaign
            </li>
            <li>
              <strong>Law enforcement or regulators</strong> when required by law, court order, or to
              protect rights, safety, and security
            </li>
            <li>
              <strong>Successors</strong> in connection with a merger, acquisition, or sale of assets, subject
              to this Policy
            </li>
          </ul>
          <p>
            When visitors unlock content, they may be redirected to third-party URLs you provide (Google
            Drive, Discord, etc.). Those sites have their own privacy policies—we do not control them.
          </p>
        </Section>

        <Section title="7. Cookies and Similar Technologies">
          <p>
            We use cookies and similar storage technologies for essential Service functions, including
            keeping creators signed in (via Clerk), remembering visitor progress on unlock pages, and
            measuring analytics.
          </p>
          <p>
            You can control cookies through your browser settings. Blocking essential cookies may prevent
            unlock flows or account access from working correctly.
          </p>
          <p>
            If we enable third-party analytics (such as PostHog), those tools may use cookies or local storage
            according to their own policies. We will update this section when such features are active on
            production.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain account and campaign data while your account is active and for a reasonable period
            afterward to comply with law, resolve disputes, and enforce agreements.
          </p>
          <p>
            Analytics events and unlock session data may be retained in aggregated or raw form according to
            operational needs and storage limits. Audience email records remain until you delete them or
            delete your account, subject to backup retention cycles.
          </p>
          <p>
            Support emails and security logs may be retained for a limited period appropriate to their purpose.
          </p>
        </Section>

        <Section title="9. Security">
          <p>
            We implement administrative, technical, and organizational measures designed to protect
            information, including encrypted connections (HTTPS), access controls, and reputable
            infrastructure providers. No method of transmission or storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>
          <p>
            You are responsible for safeguarding your account credentials and for the security of external
            links you share (for example ensuring Drive permissions are set correctly).
          </p>
        </Section>

        <Section title="10. International Transfers">
          <p>
            We and our service providers may process data in countries other than where you live, including
            the United States and European Union regions where our vendors operate data centers. Where
            required, we rely on appropriate safeguards such as standard contractual clauses or equivalent
            mechanisms.
          </p>
        </Section>

        <Section title="11. Your Rights and Choices">
          <p>Depending on your location, you may have rights to:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Access personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data, subject to legal exceptions</li>
            <li>Restrict or object to certain processing</li>
            <li>Data portability where applicable</li>
            <li>Withdraw consent where processing is consent-based</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p>
            Creators can update profile information in the dashboard and manage notification preferences in
            Settings. To request deletion of your account or export of your data, email{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>
            . We will respond within a reasonable timeframe as required by law.
          </p>
          <p>
            Visitors who submitted email addresses to a creator should contact that creator directly. We may
            assist creators in honoring deletion requests where appropriate.
          </p>
        </Section>

        <Section title="12. Children&apos;s Privacy">
          <p>
            The Service is not directed to children under 13 (or under 16 in certain jurisdictions). We do
            not knowingly collect personal information from children. If you believe a child has provided us
            personal information, contact us and we will take steps to delete it.
          </p>
        </Section>

        <Section title="13. Third-Party Links and Embeds">
          <p>
            Unlock pages may link to or embed third-party services (YouTube, Discord, etc.). Your interactions
            with those services are governed by their privacy policies. We encourage creators and visitors to
            review third-party policies before providing information on external platforms.
          </p>
        </Section>

        <Section title="14. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will post the revised version on this
            page and update the &quot;Last updated&quot; date. Material changes may be communicated through
            the Service or by email where appropriate. Continued use after changes take effect constitutes
            acceptance of the updated Policy.
          </p>
        </Section>

        <Section title="15. Contact Us">
          <p>
            For privacy questions, data requests, or complaints, contact:
          </p>
          <p>
            Email:{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>
          </p>
          <p>
            We will work with you in good faith to address concerns about how we handle personal information.
          </p>
        </Section>
      </div>
    </div>
  );
}
