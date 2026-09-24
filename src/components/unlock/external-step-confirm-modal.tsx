"use client";

import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { RetroButton } from "@/components/retro";

type ExternalStepConfirmModalProps = {
  stepLabel: string;
  destinationUrl?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ExternalStepConfirmModal({
  stepLabel,
  destinationUrl,
  onConfirm,
  onCancel,
}: ExternalStepConfirmModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onCancel]);

  return (
    <div
      className="unlock-external-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="external-step-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="unlock-external-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="unlock-external-dialog-icon" aria-hidden>
          <ExternalLink size={26} strokeWidth={2.25} />
        </div>
        <h2 id="external-step-title" className="unlock-external-dialog-title">
          Leaving Linklock
        </h2>
        <p className="unlock-external-dialog-body">
          You&apos;re opening a <strong>third-party site</strong> to complete:{" "}
          <strong>{stepLabel}</strong>.
        </p>
        {destinationUrl ? (
          <p className="unlock-external-dialog-url" title={destinationUrl}>
            {destinationUrl}
          </p>
        ) : null}
        <p className="unlock-external-dialog-note">
          Linklock isn&apos;t partnered with that site — we only track your unlock progress. Continue only if
          you trust the creator&apos;s link.
        </p>
        <div className="unlock-external-dialog-actions">
          <RetroButton type="button" variant="primary" className="w-full" onClick={onConfirm}>
            Open site &amp; continue
          </RetroButton>
          <RetroButton type="button" variant="secondary" className="w-full" onClick={onCancel}>
            Stay on Linklock
          </RetroButton>
        </div>
      </div>
    </div>
  );
}
