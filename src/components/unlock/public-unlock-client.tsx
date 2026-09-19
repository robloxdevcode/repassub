"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  getUnlockSession,
  completeAction,
  unlockContent,
  trackCampaignView,
} from "@/lib/actions/unlock";
import {
  actionProgressKey,
  completedIdsFromKeys,
  getStoredVisitorId,
  mergeCompletedIds,
  readUnlockProgress,
  writeUnlockProgress,
} from "@/lib/unlock-client-storage";
import { RetroButton, UnlockAnimation } from "@/components/retro";
import { UnlockPageBackdrop } from "./unlock-page-backdrop";
import { UnlockPageAd } from "./unlock-page-ad";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { unlockThemeClass, unlockThemeCtaVariant } from "@/lib/unlock-themes";
import { themeUsesCaptcha } from "@/lib/easter-eggs";
import { cn } from "@/lib/utils";
import { Check, Lock, Play, MessageCircle, Music2, UserPlus, ExternalLink, Loader2, ArrowUpRight, Copy } from "lucide-react";

const VERIFY_SECONDS = 10;

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (i + 1)));
      }
    }
  }
  throw lastError;
}

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
  backgroundMusicUrl: string | null;
  backgroundVideoUrl: string | null;
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
  adClient = "",
  adSlots = { left: "", right: "", bottom: "" },
}: {
  campaign: CampaignWithRelations;
  showAds?: boolean;
  isPro?: boolean;
  adClient?: string;
  adSlots?: { left: string; right: string; bottom: string };
}) {
  const visitorId = getStoredVisitorId();

  const initialCache = readUnlockProgress(campaign.id);
  const initialLocalIds = initialCache
    ? completedIdsFromKeys(campaign.actions, initialCache.completedKeys)
    : [];
  const initialUnlocked = initialCache?.status === "UNLOCKED";
  const hasInitialSession =
    initialLocalIds.length > 0 || initialCache?.status === "UNLOCKED";

  const [session, setSession] = useState<{ completedActions: string[]; status: string } | null>(() =>
    hasInitialSession && initialCache
      ? { completedActions: initialLocalIds, status: initialCache.status }
      : null
  );
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [showAnimation, setShowAnimation] = useState(false);
  const [content, setContent] = useState<ContentItem | null>(() =>
    initialUnlocked ? campaign.content : null
  );
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const captchaEnabled = themeUsesCaptcha(campaign.theme);

  function persistProgress(completedIds: string[], status: string) {
    const keys = campaign.actions
      .filter((a) => completedIds.includes(a.id))
      .map((a) => actionProgressKey(a));
    writeUnlockProgress(campaign.id, { completedKeys: keys, status });
  }

  function applySession(session: { completedActions: unknown; status: string }) {
    const serverIds = (session.completedActions as string[]) || [];
    const cache = readUnlockProgress(campaign.id);
    const localIds = cache ? completedIdsFromKeys(campaign.actions, cache.completedKeys) : [];
    const merged = mergeCompletedIds(serverIds, localIds);
    const status = session.status === "UNLOCKED" || cache?.status === "UNLOCKED" ? "UNLOCKED" : session.status;

    setSession({ completedActions: merged, status });
    persistProgress(merged, status);

    if (status === "UNLOCKED") {
      setUnlocked(true);
      setContent(campaign.content);
    }
  }

  useEffect(() => {
    trackCampaignView(campaign.id);
    getUnlockSession(campaign.id, visitorId).then((session) => {
      applySession(session);
    });
  }, [campaign.id, visitorId]);

  const completed = session?.completedActions || [];
  const total = campaign.actions.length;
  const progress = completed.length;
  const allComplete = total > 0 && campaign.actions.every((a) => completed.includes(a.id));

  const finishVerification = useCallback(
    async (actionId: string) => {
      setSession((prev) => {
        const ids = [...(prev?.completedActions || [])];
        if (!ids.includes(actionId)) ids.push(actionId);
        const allDone = campaign.actions.every((a) => ids.includes(a.id));
        const status = allDone ? "COMPLETED" : prev?.status || "IN_PROGRESS";
        persistProgress(ids, status);
        return { completedActions: ids, status };
      });
      setVerifyingId(null);
      setUnlockError(null);

      try {
        const result = await withRetry(() => completeAction(campaign.id, actionId, visitorId));
        const completedActions = (result.session.completedActions as string[]) || [];
        setSession({
          completedActions,
          status: result.session.status,
        });
        persistProgress(completedActions, result.session.status);
      } catch {
        // Keep optimistic progress — fan already waited; unlock still works if all steps show done.
      }
    },
    [campaign.id, campaign.actions, visitorId]
  );

  useEffect(() => {
    if (!verifyingId) return;
    const timer = setTimeout(() => finishVerification(verifyingId), VERIFY_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [verifyingId, finishVerification]);

  function tryStartMusic() {
    if (!campaign.backgroundMusicUrl || musicStarted) return;
    const audio = document.getElementById("unlock-page-music") as HTMLAudioElement | null;
    if (!audio) return;
    audio.play().then(() => setMusicStarted(true)).catch(() => {});
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setUnlockError("Could not copy — select the text manually.");
    }
  }

  function startAction(action: ActionItem) {
    if (verifyingId || completed.includes(action.id)) return;
    if (captchaEnabled && honeypot.trim()) {
      setUnlockError("Something went wrong. Refresh and try again.");
      return;
    }

    const config = action.config as Record<string, string>;
    if (config?.url) window.open(config.url, "_blank", "noopener,noreferrer");

    setUnlockError(null);
    tryStartMusic();
    setVerifyingId(action.id);
  }

  async function onAnimationComplete() {
    try {
      const result = await withRetry(() => unlockContent(campaign.id, visitorId));
      setUnlocked(true);
      setContent(result.content ?? campaign.content);
      persistProgress(
        campaign.actions.map((a) => a.id),
        "UNLOCKED"
      );
      setUnlockError(null);
    } catch {
      setUnlocked(true);
      setContent(campaign.content);
      persistProgress(
        campaign.actions.map((a) => a.id),
        "UNLOCKED"
      );
    } finally {
      setShowAnimation(false);
    }
  }

  return (
    <div className="unlock-v2 relative min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-retro-border bg-retro-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="shrink-0 pro-focus rounded-md">
            <LinklockLogo size={32} showWordmark wordmarkClassName="hidden sm:inline text-retro-text" />
          </Link>
          <Link href="/sign-up">
            <RetroButton size="sm" variant="primary">
              Get started
            </RetroButton>
          </Link>
        </div>
      </header>

      <div className="relative flex flex-1 items-stretch justify-center gap-4 px-3 py-4 sm:px-4 lg:gap-6">
      <UnlockPageBackdrop videoUrl={isPro ? campaign.backgroundVideoUrl : null} />
      {isPro && campaign.backgroundMusicUrl ? (
        <audio id="unlock-page-music" loop preload="auto" src={campaign.backgroundMusicUrl} className="hidden" />
      ) : null}
      {showAnimation && <UnlockAnimation onComplete={onAnimationComplete} />}

      {showAds && (
        <aside className="relative z-10 hidden md:flex w-[300px] shrink-0 items-start justify-center pt-4 sticky top-24 self-start">
          <UnlockPageAd side="left" adClient={adClient} adSlots={adSlots} />
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
              Complete each step below. After you finish the action on the other site, we verify it
              for about {VERIFY_SECONDS} seconds — then the step turns green.
            </p>
            {captchaEnabled ? (
              <input
                type="text"
                name="company"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute opacity-0 pointer-events-none h-0 w-0"
              />
            ) : null}

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
                    <div key={action.id} className="platform-btn platform-btn--verifying">
                      <Loader2 size={16} className="animate-spin shrink-0" />
                      <span className="flex-1 text-left">Verifying step… (~{VERIFY_SECONDS}s)</span>
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
              className="w-full"
              size="lg"
              disabled={!allComplete}
              onClick={() => allComplete && setShowAnimation(true)}
              variant={allComplete ? unlockThemeCtaVariant(campaign.theme) : "secondary"}
            >
              {allComplete ? (
                <>
                  {campaign.buttonText || "Open"}
                  <ArrowUpRight size={18} />
                </>
              ) : (
                <>
                  <Lock size={16} />
                  {`Complete ${total - progress} more step${total - progress !== 1 ? "s" : ""}`}
                </>
              )}
            </RetroButton>

            {unlockError && (
              <p className="mt-3 text-center text-sm font-semibold text-retro-error" role="alert">
                {unlockError}
              </p>
            )}
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
              <div className="mt-4 text-left">
                <div className="brutal-border bg-retro-surface-2 p-4 text-sm whitespace-pre-wrap mb-3">
                  {content.textBody}
                </div>
                <RetroButton size="md" variant="secondary" onClick={() => copyText(content.textBody!)} className="w-full">
                  <Copy size={16} />
                  {copied ? "Copied!" : "Copy text"}
                </RetroButton>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-retro-text-muted">
          <Link href={`/u/${campaign.user.username}`} className="hover:text-retro-accent hover:underline">
            {campaign.user.displayName || campaign.user.username}
          </Link>
          {!isPro && " — Linklock"}
        </p>
      </div>

      {showAds && (
        <div className="mt-4 w-full md:hidden">
          <UnlockPageAd side="bottom" adClient={adClient} adSlots={adSlots} />
        </div>
      )}
      </div>

      {showAds && (
        <aside className="relative z-10 hidden md:flex w-[300px] shrink-0 items-start justify-center pt-4 sticky top-24 self-start">
          <UnlockPageAd side="right" adClient={adClient} adSlots={adSlots} />
        </aside>
      )}
      </div>
    </div>
  );
}
