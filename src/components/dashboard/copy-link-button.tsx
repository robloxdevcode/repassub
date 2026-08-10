"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { RetroButton } from "@/components/retro";

export function CopyLinkButton({ url, className }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <RetroButton variant="secondary" size="sm" onClick={handleCopy} className={className}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </RetroButton>
  );
}
