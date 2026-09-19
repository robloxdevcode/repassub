"use client";

import { useMemo, useState } from "react";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";

function bioLine(title: string, url: string) {
  return `🔓 ${title} — unlock here: ${url}`;
}

export function ShareKit({ url, title }: { url: string; title: string }) {
  const { toast } = useToast();
  const [showQr, setShowQr] = useState(false);
  const line = useMemo(() => bioLine(title, url), [title, url]);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;

  async function copyBioLine() {
    try {
      await navigator.clipboard.writeText(line);
      toast("Bio line copied — paste in Instagram, TikTok, or YouTube", "success");
    } catch {
      toast("Could not copy bio line", "error");
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-retro-border text-left space-y-4">
      <p className="text-sm font-semibold text-retro-text">Share kit</p>
      <div className="flex flex-wrap gap-2">
        <CopyLinkButton url={url} />
        <RetroButton type="button" variant="secondary" size="sm" onClick={copyBioLine}>
          Copy bio line
        </RetroButton>
        <RetroButton type="button" variant="secondary" size="sm" onClick={() => setShowQr((v) => !v)}>
          {showQr ? "Hide QR" : "Show QR code"}
        </RetroButton>
      </div>
      <p className="text-xs text-retro-text-muted font-mono break-all bg-retro-surface-2 border border-retro-border p-3 rounded-lg">
        {line}
      </p>
      {showQr ? (
        <div className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-retro-ink rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt={`QR code for ${title}`} width={220} height={220} className="rounded-lg" />
          <p className="text-xs text-retro-text-muted">Scan to open your unlock page</p>
        </div>
      ) : null}
    </div>
  );
}
