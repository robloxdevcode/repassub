import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "Terms of service for Linklock — the subscribe-to-download platform for creators.",
  path: "/terms",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-body text-base font-bold text-retro-text">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-3xl tracking-wider mb-4">TERMS OF SERVICE</h1>
      <p className="font-body text-sm text-retro-text-dim mb-8">Last updated: August 9, 2026</p>

      <div className="retro-panel p-6 md:p-10 text-sm text-retro-text-dim space-y-8 leading-relaxed">
        <Section title="1. Agreement to these Terms">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Linklock website,
            applications, unlock pages, APIs, and related services (collectively, the &quot;Service&quot;)
            operated by Linklock (&quot;Linklock,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p>
            By creating an account, clicking &quot;Start free,&quot; publishing an unlock link, visiting a
            public unlock page, or otherwise using the Service, you agree to be bound by these Terms and our
            Privacy Policy. If you do not agree, do not use the Service.
          </p>
          <p>
            If you use the Service on behalf of a company, organization, or other entity, you represent that
            you have authority to bind that entity to these Terms, and &quot;you&quot; refers to that entity.
          </p>
        </Section>

        <Section title="2. What Linklock Is">
          <p>
            Linklock is a creator tool that lets you build &quot;unlock links&quot;: single URLs where visitors
            complete steps you define (such as subscribing on YouTube, following on social media, joining a
            Discord server, submitting an email address, or visiting a page) before receiving content you
            specify (such as an external download link, redirect URL, or text/code displayed on screen).
          </p>
          <p>
            Linklock does not host your files. You provide URLs to third-party services (for example Google
            Drive, Dropbox, or your own website) or text content. We act as a gateway and analytics layer
            between you and your audience. We are not a file storage provider, CDN, or digital marketplace
            unless we explicitly state otherwise in writing.
          </p>
          <p>
            Linklock is not affiliated with, endorsed by, or sponsored by YouTube, Google, Discord, Spotify,
            TikTok, Instagram, Meta, or any other third-party platform unless we clearly say so. You are
            solely responsible for complying with each platform&apos;s terms when you ask fans to take actions
            on those platforms.
          </p>
        </Section>

        <Section title="3. Eligibility and Accounts">
          <p>
            You must be at least 13 years old (or the minimum age required in your country to consent to
            use online services) to use the Service. If you are under 18, you represent that you have
            permission from a parent or legal guardian.
          </p>
          <p>
            Account registration and authentication are provided through our identity partner (Clerk). You
            agree to provide accurate information, keep your login credentials secure, and notify us
            immediately at{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>{" "}
            if you suspect unauthorized access to your account.
          </p>
          <p>
            You may not share accounts, sell accounts, or create accounts through automated means except
            where we explicitly permit it. One person or entity should not maintain multiple free accounts
            to evade plan limits.
          </p>
        </Section>

        <Section title="4. Free and Paid Plans">
          <p>
            Linklock offers a Free plan and paid subscription plans (such as Pro). Plan features—including
            maximum steps per unlock, advertising on public unlock pages, analytics depth, branding tools,
            and support level—are described on our Pricing page and may change from time to time.
          </p>
          <p>
            The Free plan includes unlimited unlock links and up to four steps per link unless stated
            otherwise on the site. Pro includes up to ten steps per link plus additional features listed on
            our Pricing page.
          </p>
          <p>
            Paid subscriptions are processed by Stripe. By subscribing, you also agree to Stripe&apos;s
            terms where applicable. Subscription fees are billed in advance on a recurring basis until
            cancelled. You can manage or cancel billing through the Billing section of your account when
            billing is enabled.
          </p>
          <p>
            We may offer promotional pricing, lifetime grants, or complimentary Pro access at our sole
            discretion. Such offers may be modified or revoked if we detect abuse or violation of these
            Terms.
          </p>
          <p>
            <strong>Important:</strong> Linklock does not pay creators for using the Service. Any revenue
            you earn from your audience is between you and your fans or sponsors. Our fees cover your
            subscription to Linklock only.
          </p>
        </Section>

        <Section title="5. Your Content and Campaigns">
          <p>
            You retain ownership of content you upload metadata for, link to, or display through unlock
            campaigns (&quot;Your Content&quot;). By using the Service, you grant Linklock a worldwide,
            non-exclusive, royalty-free license to host, store, reproduce, display, and distribute Your
            Content solely as needed to operate the Service—for example rendering your unlock page, counting
            analytics events, and sending notification emails you enable.
          </p>
          <p>
            You represent and warrant that: (a) you own or have all necessary rights to Your Content and
            the actions you require visitors to perform; (b) Your Content does not infringe any copyright,
            trademark, privacy, or other rights; (c) Your Content complies with applicable laws and
            third-party platform rules; and (d) if you collect emails or personal data from visitors, you
            have a lawful basis to do so and will honor your own privacy promises to your audience.
          </p>
          <p>
            You are solely responsible for what happens after a visitor unlocks Your Content—for example
            whether a Google Drive link remains available, whether a Discord invite is valid, or whether
            shared keys or codes remain secret. Linklock is not responsible for third-party link rot,
            takedowns, or access changes.
          </p>
        </Section>

        <Section title="6. Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Distribute malware, viruses, phishing pages, or harmful code</li>
            <li>Promote illegal goods, services, or activity in any jurisdiction</li>
            <li>Harass, threaten, defame, or discriminate against others</li>
            <li>Collect passwords, OAuth tokens, or payment details from third-party sites</li>
            <li>Impersonate Linklock, another creator, or any person or entity</li>
            <li>Send spam or unsolicited bulk messages using unlock flows or audience data</li>
            <li>Circumvent plan limits, rate limits, or security measures</li>
            <li>Scrape, crawl, or reverse engineer the Service except as law permits</li>
            <li>Use unlock pages primarily to drive fraudulent engagement (fake subscribers, bot farms, etc.)</li>
            <li>Violate the intellectual property or terms of any third-party platform</li>
          </ul>
          <p>
            We may investigate violations and cooperate with law enforcement where required. You are
            responsible for all activity under your account, including activity by anyone you allow to
            use your account.
          </p>
        </Section>

        <Section title="7. Public Unlock Pages and Visitors">
          <p>
            Unlock pages you publish are publicly accessible to anyone with the URL unless we offer
            password protection or other restrictions in the future. Visitors are not required to create
            Linklock accounts to complete unlock steps on your page.
          </p>
          <p>
            Free plan unlock pages may display third-party or Linklock advertising. Pro plan pages may be
            ad-free as described on our Pricing page. Ad content is provided &quot;as is&quot; and may change
            without notice.
          </p>
          <p>
            Unlock verification (such as timed confirmation before marking a step complete) is a UX feature
            to encourage genuine engagement. It is not a guarantee that a visitor actually subscribed,
            followed, or joined on an external platform. You acknowledge that automated or dishonest
            completion may occur and Linklock does not warrant perfect verification of third-party actions.
          </p>
        </Section>

        <Section title="8. Analytics, Notifications, and Email">
          <p>
            We provide analytics such as views, unlock counts, and (on eligible plans) conversion and
            breakdown data. Analytics are provided for informational purposes and may be delayed, estimated,
            or incomplete due to ad blockers, cookie settings, bot traffic, or technical errors.
          </p>
          <p>
            If you enable email notifications, we may send alerts (for example when someone unlocks your
            content) through our email provider (such as Resend) to the address associated with your account.
            You can adjust notification preferences in Settings. You are responsible for keeping your email
            address current.
          </p>
        </Section>

        <Section title="9. Intellectual Property of Linklock">
          <p>
            The Service, including our software, design, logos, branding, and documentation, is owned by
            Linklock or our licensors and protected by intellectual property laws. These Terms do not grant
            you any right to use our trademarks except as necessary to use the Service in accordance with
            our brand guidelines, if any.
          </p>
          <p>
            You may not copy, modify, distribute, sell, or lease any part of the Service unless we give
            written permission or open-source license terms apply to specific components.
          </p>
        </Section>

        <Section title="10. Suspension and Termination">
          <p>
            We may suspend or terminate your access to the Service immediately, with or without notice, if
            we reasonably believe you violated these Terms, pose a security risk, or if we must do so to
            comply with law. We may also remove or disable specific unlock campaigns that we deem harmful or
            unlawful.
          </p>
          <p>
            You may stop using the Service at any time and may request account deletion by contacting{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>
            . Upon termination, your right to use the Service ends. Sections that by their nature should
            survive (including disclaimers, limitations of liability, and dispute provisions) will survive.
          </p>
          <p>
            We are not obligated to retain Your Content after termination and may delete campaign data,
            analytics, and audience records according to our data retention practices described in the
            Privacy Policy.
          </p>
        </Section>

        <Section title="11. Disclaimers">
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
            KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, error-free, secure, or free of harmful
            components; that unlock links will remain online forever; that analytics will be accurate; or
            that paid features will meet your specific business goals.
          </p>
          <p>
            Some jurisdictions do not allow certain warranty exclusions, so some of the above may not apply
            to you.
          </p>
        </Section>

        <Section title="12. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, LINKLOCK AND ITS OFFICERS, DIRECTORS, EMPLOYEES,
            AGENTS, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
            OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS
            OPPORTUNITIES, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED
            OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR
            RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID
            US IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR (B) FIFTY US DOLLARS
            (USD $50).
          </p>
          <p>
            Some jurisdictions do not allow limitations of liability for certain damages, so the above
            limits may not fully apply to you.
          </p>
        </Section>

        <Section title="13. Indemnification">
          <p>
            You agree to defend, indemnify, and hold harmless Linklock and its affiliates from and against
            any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos;
            fees) arising from: (a) Your Content or unlock campaigns; (b) your use of the Service; (c) your
            violation of these Terms or applicable law; or (d) any dispute between you and your audience or a
            third party.
          </p>
        </Section>

        <Section title="14. Changes to the Service and Terms">
          <p>
            We may modify the Service at any time—adding, removing, or changing features, plan limits, or
            integrations. We may update these Terms from time to time. When we make material changes, we will
            post the updated Terms on this page and update the &quot;Last updated&quot; date. Continued use
            after changes become effective constitutes acceptance of the revised Terms.
          </p>
          <p>
            If you do not agree to updated Terms, you must stop using the Service before the effective date
            of the changes.
          </p>
        </Section>

        <Section title="15. Governing Law and Disputes">
          <p>
            These Terms are governed by the laws applicable in the jurisdiction where Linklock operates,
            without regard to conflict-of-law principles, except where mandatory consumer protection laws
            in your country require otherwise.
          </p>
          <p>
            Before filing a formal claim, you agree to contact us at{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>{" "}
            and attempt to resolve the dispute informally within thirty (30) days. If informal resolution
            fails, disputes will be resolved in the courts or arbitration forum specified by applicable law,
            unless you have a statutory right to bring claims in your local courts.
          </p>
        </Section>

        <Section title="16. Miscellaneous">
          <p>
            These Terms, together with the Privacy Policy and any plan-specific terms on our site, constitute
            the entire agreement between you and Linklock regarding the Service. If any provision is found
            unenforceable, the remaining provisions remain in effect.
          </p>
          <p>
            Our failure to enforce any right or provision is not a waiver of that right or provision. You
            may not assign these Terms without our consent; we may assign them in connection with a merger,
            acquisition, or sale of assets.
          </p>
          <p>
            Questions about these Terms:{" "}
            <a href="mailto:ltrobloxbrothers@gmail.com" className="text-retro-blue hover:underline">
              ltrobloxbrothers@gmail.com
            </a>
          </p>
        </Section>
      </div>
    </div>
  );
}
