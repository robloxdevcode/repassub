"use client";

import { useEffect, useState } from "react";
import {
  getPublicCampaign,
  getUnlockSession,
  completeAction,
  unlockContent,
  trackCampaignView,
} from "@/lib/actions/unlock";
import { RetroButton, UnlockAnimation, RetroBackground } from "@/components/retro";
import { Check, Lock, Play, MessageCircle, Music2, UserPlus, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function PublicUnlockClient({ campaign }: { campaign: CampaignWithRelations }) {
  const [session, setSession] = useState<{ completedActions: string[]; status: string } | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    trackCampaignView(campaign.id);
    getUnlockSession(campaign.id).then((s) => {
      setSession({ completedActions: (s.completedActions as string[]) || [], status: s.status });
      if (s.status === "UNLOCKED") {
        setUnlocked(true);
        setContent(campaign.content);
      }
    });
  }, [campaign.id, campaign.content]);

  const completed = session?.completedActions || [];
  const total = campaign.actions.length;
  const progress = completed.length;
  const allComplete = total > 0 && campaign.actions.every((a) => completed.includes(a.id));

  async function handleCompleteAction(actionId: string, action: ActionItem) {
    setLoading(actionId);
    try {
      const config = action.config as Record<string, string>;
      if (action.type === "VISIT" && config?.url) window.open(config.url, "_blank");
      const result = await completeAction(campaign.id, actionId);
      setSession({
        completedActions: (result.session.completedActions as string[]) || [],
        status: result.session.status,
      });
    } finally {
      setLoading(null);
    }
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
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <RetroBackground />
      {showAnimation && <UnlockAnimation onComplete={onAnimationComplete} />}

      <div className="relative z-10 w-full max-w-md unlock-preview-card animate-pulse-glow">
        {!unlocked ? (
          <>
            {campaign.logoUrl ? (
              <img src={campaign.logoUrl} alt="" className="h-12 w-12 rounded-xl mb-4 object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-retro-accent flex items-center justify-center mb-4">
                <span className="text-black font-bold">R</span>
              </div>
            )}

            <h1 className="font-display text-xl font-bold text-retro-text">{campaign.title}</h1>
            {campaign.description && (
              <p className="text-sm text-retro-text-dim mt-1 mb-4">{campaign.description}</p>
            )}
            <p className="text-sm text-retro-text-dim mb-4">Complete the actions to unlock</p>

            <div className="flex flex-col gap-2 mb-4">
              {campaign.actions.map((action) => {
                const isComplete = completed.includes(action.id);
                const platform = actionPlatform(action.type, action.label);
                const Icon = platformIcons[platform];

                if (isComplete) {
                  return (
                    <div key={action.id} className="platform-btn platform-generic opacity-60">
                      <Check size={16} className="text-retro-accent" />
                      <span className="line-through">{action.label}</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={action.id}
                    disabled={loading === action.id}
                    onClick={() => handleCompleteAction(action.id, action)}
                    className={cn("platform-btn", platformStyles[platform], "cursor-pointer disabled:opacity-50")}
                  >
                    <Icon size={16} />
                    {action.type === "VISIT" ? (
                      <span className="flex items-center gap-1">{action.label} <ExternalLink size={12} /></span>
                    ) : (
                      action.label
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-retro-text-dim mb-2">
              <span>Unlock progress</span>
              <span>{progress}/{total} done</span>
            </div>
            <div className="retro-progress mb-4">
              <div className="retro-progress-fill" style={{ width: total ? `${(progress / total) * 100}%` : "0%" }} />
            </div>

            <RetroButton
              className="w-full !rounded-xl"
              disabled={!allComplete}
              onClick={() => allComplete && setShowAnimation(true)}
              variant={allComplete ? "primary" : "secondary"}
            >
              <Lock size={14} />
              {campaign.buttonText}
            </RetroButton>

            {campaign.actions.some((a) => a.verificationMode === "MANUAL") && (
              <p className="text-xs text-retro-text-muted text-center mt-3">
                Manual confirmation required for some actions
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-retro-accent/20 mb-4">
              <Check size={32} className="text-retro-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-retro-accent mb-2">Unlocked!</h2>
            <p className="text-sm text-retro-text-dim mb-6">Your content is ready</p>

            {content?.type === "URL" && content.externalUrl && (
              <a href={content.externalUrl} target="_blank" rel="noopener noreferrer">
                <RetroButton size="lg">Open link →</RetroButton>
              </a>
            )}
            {content?.type === "FILE" && content.fileUrl && (
              <a href={content.fileUrl} download={content.fileName || true}>
                <RetroButton size="lg">Download file →</RetroButton>
              </a>
            )}
            {content?.type === "TEXT" && content.textBody && (
              <div className="mt-4 text-left retro-panel p-4 text-sm whitespace-pre-wrap text-retro-text-dim">
                {content.textBody}
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-retro-text-muted">
          by {campaign.user.displayName || campaign.user.username} · Repassub
        </p>
      </div>
    </div>
  );
}
