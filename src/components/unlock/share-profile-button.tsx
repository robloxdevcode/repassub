"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareProfileButton({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      setSharing(true);
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled or unsupported */
      } finally {
        setSharing(false);
      }
    }
    await copyLink();
  }

  return (
    <div className={cn("public-creator-share-row", className)}>
      <button type="button" onClick={handleShare} disabled={sharing} className="public-creator-share-btn">
        <Share2 size={15} aria-hidden />
        Share
      </button>
      <button type="button" onClick={copyLink} className="public-creator-share-btn public-creator-share-btn--secondary">
        {copied ? <Check size={15} className="text-retro-success" aria-hidden /> : <Copy size={15} aria-hidden />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
