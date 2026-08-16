"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyLinkButton({
  url,
  className,
  iconOnly = false,
}: {
  url: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy link"}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg text-retro-text-muted",
          "hover:text-retro-text hover:bg-retro-surface-2 transition-colors",
          className
        )}
      >
        {copied ? <Check size={16} className="text-retro-success" /> : <Copy size={16} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-retro-border px-3 py-2 text-xs font-semibold",
        "text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 transition-colors",
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
