"use client";

import { useEffect, useState } from "react";
import { claimReferralCookie, getReferralLink, getReferralStats } from "@/lib/actions/referral";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { useToast } from "@/components/retro";
import Link from "next/link";

export function ReferralCard() {
  const { toast } = useToast();
  const [link, setLink] = useState<string | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getReferralStats>> | null>(null);

  useEffect(() => {
    void claimReferralCookie().catch(() => undefined);
    getReferralLink()
      .then(setLink)
      .catch(() => setLink(null));
    getReferralStats()
      .then(setStats)
      .catch(() => setStats({ count: 0, recent: [] }));
  }, []);

  return (
    <section className="dash-pro-panel dash-pro-panel--referral">
      <div className="dash-pro-panel-head">
        <h2>Referral link</h2>
        <Link href="/grow">Templates</Link>
      </div>
      <p className="dash-pro-referral-copy">
        Share Linklock with other creators. When someone signs up through your link, it&apos;s tracked
        on your account.
      </p>
      {link ? (
        <div className="dash-pro-referral-actions">
          <CopyLinkButton url={link} />
          <button
            type="button"
            className="dash-pro-text-btn"
            onClick={async () => {
              const msg = `I use Linklock for subscribe-to-download links — free to start: ${link}`;
              try {
                await navigator.clipboard.writeText(msg);
                toast("Invite message copied", "success");
              } catch {
                toast("Copy failed", "error");
              }
            }}
          >
            Copy invite message
          </button>
        </div>
      ) : null}
      <p className="dash-pro-referral-url">{link ?? "Loading referral link…"}</p>
      {stats && stats.count > 0 ? (
        <p className="dash-pro-referral-stat">
          {stats.count} signup{stats.count !== 1 ? "s" : ""} from your link
        </p>
      ) : null}
    </section>
  );
}
