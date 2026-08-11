"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  getUnlockSession,
  completeAction,
  unlockContent,
  trackCampaignView,
} from "@/lib/actions/unlock";
import { RetroButton, UnlockAnimation } from "@/components/retro";
import { UnlockPageBackdrop } from "./unlock-page-backdrop";
import { UnlockPageAd } from "./unlock-page-ad";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { unlockThemeClass } from "@/lib/unlock-themes";
import { cn } from "@/lib/utils";
import { Check, Lock, Play, MessageCircle, Music2, UserPlus, ExternalLink, Loader2, ArrowUpRight } from "lucide-react";

const VERIFY_SECONDS = 14;

type ActionItem = {
  id: string;
  type: string;
  label: string;
  config: unknown;
  verificationMode: string;
};

type ContentItem = {
  type: string;
  externalUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
  textBody: string | null;
};

type CampaignWithRelations = {
  id: string;
  title: string;
  description: string | null;
  buttonText: string;
  theme: string;
  logoUrl: string | null;
  content: ContentItem | null;
  actions: ActionItem[];
  user: { username: string; displayName: string | null; avatarUrl: string | null };
};

const actionPlatform = (type: string, label: string) => {
  const l = label.toLowerCase();
  if (type === "SUBSCRIBE" || l.includes("youtube") || l.includes("subscribe")) return "youtube";
  if (type === "JOIN" || l.includes("discord") || l.includes("server")) return "discord";
  if (type === "FOLLOW" || l.includes("spotify") || l.includes("follow")) return "spotify";
  return "generic";
};

const platformStyles = {
  youtube: "platform-youtube",
  discord: "platform-discord",
  spotify: "platform-spotify",
  generic: "platform-generic",
};

const platformIcons = {
  youtube: Play,
  discord: MessageCircle,
  spotify: Music2,
  generic: UserPlus,
};

export function PublicUnlockClient({
  campaign,
  showAds = false,
  isPro = false,
}: {
  campaign: CampaignWithRelations;
  showAds?: boolean;
  isPro?: boolean;
}) {
  const [session, setSession] = useState<{ completedActions: string[]; status: string } | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [content, setContent] = useState<ContentItem | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    trackCampaignView(campaign.id);
    getUnlockSession(campaign.id).then(() => {
      setSession({ completedActions: [], status: "STARTED" });
      setUnlocked(false);
      setContent(null);
    });
  }, [campaign.id]);

  const completed = session?.completedActions || [];
  const total = campaign.actions.length;
  const progress = completed.length;
  const allComplete = total > 0 && campaign.actions.every((a) => completed.includes(a.id));

  const finishVerification = useCallback(
    async (actionId: string) => {
      try {
        const result = await completeAction(campaign.id, actionId);
        setSession({
          completedActions: (result.session.completedActions as string[]) || [],
          status: result.session.status,
        });
      } finally {
        setVerifyingId(null);
      }
    },
    [campaign.id]
  );

  useEffect(() => {
    if (!verifyingId) return;
    const timer = setTimeout(() => finishVerification(verifyingId), VERIFY_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [verifyingId, finishVerification]);

  function startAction(action: ActionItem) {
    if (verifyingId || completed.includes(action.id)) return;

    const config = action.config as Record<string, string>;
    if (config?.url) window.open(config.url, "_blank", "noopener,noreferrer");

    setVerifyingId(action.id);
  }

  async function onAnimationComplete() {
    try {
      const result = await unlockContent(campaign.id);
      setUnlocked(true);
      setContent(result.content ?? campaign.content);
    } catch {
      setUnlocked(true);
      setContent(campaign.content);
    }
    setShowAnimation(false);
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b-[3px] border-retro-ink bg-retro-surface">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="shrink-0">
            <LinklockLogo size={32} showWordmark wordmarkClassName="hidden sm:inline text-retro-ink" />
          </Link>
          <Link href="/">
            <RetroButton size="sm" variant="primary">
              Create your link!
            </RetroButton>
          </Link>
        </div>
      </header>

      <div className="relative flex flex-1 items-stretch justify-center gap-4 px-3 py-4 sm:px-4 lg:gap-6">
      <UnlockPageBackdrop />
      {showAnimation && <UnlockAnimation onComplete={onAnimationComplete} />}

      {showAds && (
        <aside className="relative z-10 hidden md:flex w-[300px] shrink-0 items-start justify-center pt-4 sticky top-24 self-start">
          <UnlockPageAd side="left" />
        </aside>
      )}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center min-w-0 max-w-md mx-auto">
      <div className={cn("w-full unlock-preview-card animate-pulse-glow", unlockThemeClass(campaign.theme))}>
        {!unlocked ? (
          <>
            {campaign.logoUrl ? (
              <img src={campaign.logoUrl} alt="" className="h-12 w-12 rounded-xl mb-4 object-cover brutal-border" />
            ) : isPro && campaign.user.avatarUrl ? (
              <img src={campaign.user.avatarUrl} alt="" className="h-12 w-12 rounded-xl mb-4 object-cover brutal-border" />
            ) : !isPro ? (
              <LinklockLogo size={48} className="mb-4" />
            ) : (
              <div className="h-12 w-12 rounded-xl mb-4 brutal-border bg-retro-yellow flex items-center justify-center font-display text-lg">
                {(campaign.user.displayName || campaign.user.username).slice(0, 1).toUpperCase()}
              </div>
            )}

            <h1 className="font-display text-xl font-bold text-retro-text">{campaign.title}</h1>
            {campaign.description && (
              <p className="text-sm text-retro-text-dim mt-1 mb-3">{campaign.description}</p>
            )}
            <p className="text-sm text-retro-text-dim mb-4">
              Tap each step. Finish it. It turns green.
            </p>

            <div className="flex flex-col gap-2 mb-4">
              {campaign.actions.map((action) => {
                const isComplete = completed.includes(action.id);
                const isVerifying = verifyingId === action.id;
                const platform = actionPlatform(action.type, action.label);
                const Icon = platformIcons[platform];
                const config = action.config as Record<string, string>;
                if (isComplete) {
                  return (
                    <div key={action.id} className="platform-btn platform-btn--done">
                      <Check size={16} strokeWidth={3} />
                      <span>{action.label}</span>
                      <span className="ml-auto font-display text-[8px]">DONE</span>
                    </div>
                  );
                }

                if (isVerifying) {
                  return (
                    <div key={action.id} className="platform-btn platform-btn--verifying !flex-col !items-start gap-1 pb-3">
                      <div className="flex items-center gap-2 w-full">
                        <Loader2 size={16} className="animate-spin shrink-0" />
                        <span className="font-semibold">Checking…</span>
                      </div>
                      <span className="text-xs opacity-80 pl-6">Finish the step in the other tab</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={action.id}
                    type="button"
                    disabled={!!verifyingId}
                    onClick={() => startAction(action)}
                    className={cn(
                      "platform-btn relative overflow-hidden",
                      platformStyles[platform],
                      "cursor-pointer disabled:opacity-50"
                    )}
                  >
                    <Icon size={16} />
                    {config?.url ? (
                      <span className="flex items-center gap-1 text-left">
                        {action.label} <ExternalLink size={12} className="shrink-0" />
                      </span>
                    ) : (
                      action.label
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-retro-text-dim mb-2">
              <span>Progress</span>
              <span>{progress}/{total} done</span>
            </div>
            <div className="retro-progress mb-4">
              <div
                className={cn(
                  "retro-progress-fill transition-all duration-500",
                  allComplete && "bg-retro-success"
                )}
                style={{ width: total ? `${(progress / total) * 100}%` : "0%" }}
              />
            </div>

            <RetroButton
              className="w-full !rounded-xl"
              disabled={!allComplete}
              onClick={() => allComplete && setShowAnimation(true)}
              variant={allComplete ? "primary" : "secondary"}
            >
              {allComplete ? (
                <>
                  {campaign.buttonText || "Open"}
                  <ArrowUpRight size={16} />
                </>
              ) : (
                <>
                  <Lock size={14} />
                  {`Complete ${total - progress} more step${total - progress !== 1 ? "s" : ""}`}
                </>
              )}
            </RetroButton>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-retro-success border-2 border-retro-ink mb-4">
              <Check size={32} className="text-retro-ink" strokeWidth={3} />
            </div>
            <h2 className="font-body text-xl font-bold mb-2">Download ready</h2>
            <p className="text-sm text-retro-text-dim mb-6">Thanks for completing the steps.</p>

            {content?.type === "URL" && content.externalUrl && (
              <a href={content.externalUrl} target="_blank" rel="noopener noreferrer">
                <RetroButton size="lg">Open</RetroButton>
              </a>
            )}
            {content?.type === "FILE" && content.fileUrl && (
              <a href={content.fileUrl} download={content.fileName || true}>
                <RetroButton size="lg">Open</RetroButton>
              </a>
            )}
            {content?.type === "TEXT" && content.textBody && (
              <div className="mt-4 text-left brutal-border bg-retro-surface-2 p-4 text-sm whitespace-pre-wrap">
                {content.textBody}
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-retro-text-muted">
          {campaign.user.displayName || campaign.user.username}
          {!isPro && " · Linklock"}
        </p>
      </div>

      {showAds && (
        <div className="mt-4 w-full md:hidden">
          <UnlockPageAd side="bottom" />
        </div>
      )}
      </div>

      {showAds && (
        <aside className="relative z-10 hidden md:flex w-[300px] shrink-0 items-start justify-center pt-4 sticky top-24 self-start">
          <UnlockPageAd side="right" />
        </aside>
      )}
      </div>
    </div>
  );
}
