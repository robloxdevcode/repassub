"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RetroLoading } from "@/components/retro";
import { RetroButton, RetroInput, RetroTextarea, RetroProgressBar } from "@/components/retro";
import { useToast } from "@/components/retro";
import {
  createCampaign,
  updateCampaignContent,
  updateCampaignActions,
  updateCampaignCustomization,
  publishCampaign,
  getCampaign,
} from "@/lib/actions/campaigns";
import { getUnlockUrl } from "@/lib/utils";
import { formatUnlockQuotaReset } from "@/lib/stripe";
import { UNLOCK_PLATFORMS, getPlatform, guessPlatform } from "@/lib/unlock-platforms";
import { UpgradeNudge } from "@/components/dashboard/upgrade-nudge";
import { AppCard } from "@/components/dashboard/app-page-header";
import { UNLOCK_THEMES } from "@/lib/unlock-themes";
import { isProPlan } from "@/lib/stripe";
import { Link as LinkIcon, FileText, Check, Plus, Trash2 } from "lucide-react";
import type { ContentType } from "@prisma/client";

const CONTENT_TYPES = [
  { type: "URL" as ContentType, label: "Link", hint: "Google Drive, Dropbox, your site — any URL", icon: LinkIcon },
  { type: "TEXT" as ContentType, label: "Text / code", hint: "Show text or a key after unlock", icon: FileText },
];

type ActionDraft = {
  id: string;
  platformId: string;
  url: string;
  label: string;
};

const STEPS = ["Your link", "Their steps", "Publish"];

function newActionDraft(platformId: string = "youtube"): ActionDraft {
  const platform = getPlatform(platformId);
  return {
    id: crypto.randomUUID(),
    platformId,
    url: "",
    label: platform?.label || "Complete step",
  };
}

function CreateUnlockWizard() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const editId = searchParams.get("id");

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(editId);
  const [username, setUsername] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(false);
  const [actionLimit, setActionLimit] = useState(2);
  const [plan, setPlan] = useState("FREE");
  const [linkQuota, setLinkQuota] = useState<{ used: number; limit: number; remaining: number; resetsAt: Date | null } | null>(null);

  const [contentType, setContentType] = useState<ContentType>("URL");
  const [externalUrl, setExternalUrl] = useState("");
  const [textBody, setTextBody] = useState("");

  const [actions, setActions] = useState<ActionDraft[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Get download");
  const [theme, setTheme] = useState("default");
  const [logoUrl, setLogoUrl] = useState("");

  const isPro = isProPlan(plan);

  const atLinkLimit =
    !editId && linkQuota !== null && linkQuota.limit !== Infinity && linkQuota.remaining <= 0;

  useEffect(() => {
    import("@/lib/actions/dashboard").then(({ getDashboardStats }) =>
      getDashboardStats().then((s) => {
        setUsername(s.user.username);
        setActionLimit(s.actionLimit === Infinity ? 99 : s.actionLimit);
        setPlan(s.plan);
        setLinkQuota(s.unlockQuota);
      })
    );
  }, []);

  useEffect(() => {
    if (editId) {
      getCampaign(editId).then((campaign) => {
        if (!campaign) return;
        setCampaignId(campaign.id);
        setTitle(campaign.title);
        setDescription(campaign.description || "");
        setButtonText(campaign.buttonText);
        setTheme(campaign.theme);
        setSlug(campaign.slug);
        setLogoUrl(campaign.logoUrl || "");
        if (campaign.content) {
          if (campaign.content.type === "FILE") {
            setContentType("URL");
            setExternalUrl(campaign.content.fileUrl || campaign.content.externalUrl || "");
          } else {
            setContentType(campaign.content.type);
            setExternalUrl(campaign.content.externalUrl || "");
            setTextBody(campaign.content.textBody || "");
          }
        }
        if (campaign.actions.length) {
          setActions(
            campaign.actions.map((a) => {
              const config = a.config as Record<string, string>;
              const platform = config?.platform
                ? getPlatform(config.platform) || guessPlatform(a.type, a.label)
                : guessPlatform(a.type, a.label);
              return {
                id: a.id,
                platformId: platform.id,
                url: config?.url || "",
                label: a.label,
              };
            })
          );
        }
      });
    }
  }, [editId]);

  const ensureCampaign = useCallback(async () => {
    if (campaignId) return campaignId;
    setLoading(true);
    try {
      const campaign = await createCampaign({ title: title || "My unlock" });
      setCampaignId(campaign.id);
      setSlug(campaign.slug);
      return campaign.id;
    } finally {
      setLoading(false);
    }
  }, [campaignId, title]);

  function validateContent(): string | null {
    if (contentType === "URL" && !externalUrl.trim()) return "Paste a link";
    if (contentType === "URL" && !/^https?:\/\/.+/i.test(externalUrl.trim())) return "Link must start with http:// or https://";
    if (contentType === "TEXT" && !textBody.trim()) return "Write what they unlock";
    return null;
  }

  async function handleContentNext() {
    if (atLinkLimit) {
      toast(`Free plan: ${linkQuota?.limit} links per week. Delete one or upgrade.`, "error");
      return;
    }
    const err = validateContent();
    if (err) {
      toast(err, "error");
      return;
    }
    setLoading(true);
    try {
      const id = await ensureCampaign();
      const content =
        contentType === "URL"
          ? { type: "URL" as ContentType, externalUrl: externalUrl.trim() }
          : { type: "TEXT" as ContentType, textBody: textBody.trim() };

      await updateCampaignContent(id, content);
      setStep(1);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save download", "error");
    } finally {
      setLoading(false);
    }
  }

  function validateActions(): string | null {
    if (actions.length === 0) return "Add at least one step";
    if (actions.length > actionLimit) {
      return plan === "FREE"
        ? `Free plan allows ${actionLimit} steps. Remove ${actions.length - actionLimit} or upgrade to Pro.`
        : `Pro plan allows up to ${actionLimit} steps. Remove ${actions.length - actionLimit}.`;
    }
    for (const action of actions) {
      const platform = getPlatform(action.platformId);
      if (!platform) return "Invalid platform on a step";
      if (!action.label.trim()) return "Name each step button";
      if (!action.url.trim()) return `Paste your ${platform.shortName} link`;
      if (!/^https?:\/\/.+/i.test(action.url.trim())) {
        return `${platform.shortName} link must start with http:// or https://`;
      }
    }
    return null;
  }

  async function handleActionsNext() {
    const err = validateActions();
    if (err) {
      toast(err, "error");
      return;
    }
    setLoading(true);
    try {
      const id = await ensureCampaign();
      await updateCampaignActions(
        id,
        actions.map((action) => {
          const platform = getPlatform(action.platformId)!;
          return {
            type: platform.type,
            label: action.label.trim(),
            config: { url: action.url.trim(), platform: platform.id },
            verificationMode: "MANUAL" as const,
          };
        })
      );
      setStep(2);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save steps", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishStep() {
    if (!title.trim()) {
      toast("Give your link a name", "error");
      return;
    }
    setLoading(true);
    try {
      const id = await ensureCampaign();
      const updated = await updateCampaignCustomization(id, {
        title: title.trim(),
        description,
        buttonText: buttonText.trim() || "Get download",
        ...(isPro
          ? {
              theme,
              logoUrl: logoUrl.trim() || null,
              slug: slug.trim() || undefined,
            }
          : {}),
      });
      setSlug(updated.slug);
      await publishCampaign(id);
      setPublished(true);
      toast("Your link is live!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not publish", "error");
    } finally {
      setLoading(false);
    }
  }

  function addAction(platformId: string) {
    if (actions.length >= actionLimit) {
      toast(`${plan === "FREE" ? "Free" : "Pro"} plan: max ${actionLimit} steps.`, "error");
      return;
    }
    setActions((prev) => [...prev, newActionDraft(platformId)]);
  }

  function updateAction(id: string, patch: Partial<ActionDraft>) {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function removeAction(id: string) {
    setActions((prev) => prev.filter((a) => a.id !== id));
  }

  if (published) {
    const url = getUnlockUrl(username || "player", slug);
    return (
      <div className="mx-auto max-w-lg text-center">
        <AppCard className="p-8" accent="green">
          <p className="font-display text-[8px] text-retro-success mb-3 tracking-widest">LIVE</p>
          <h1 className="font-body text-2xl font-bold mb-2">Your link is ready</h1>
          <p className="font-body text-sm text-retro-text-dim mb-4">Share this in your video or bio:</p>
          <p className="font-mono text-sm bg-retro-surface-2 border-2 border-retro-ink p-3 break-all">{url}</p>
          <div className="mt-8">
            <RetroButton onClick={() => navigator.clipboard.writeText(url)} className="w-full sm:w-auto">
              Copy link
            </RetroButton>
          </div>
          <Link href="/dashboard" className="inline-block mt-6 font-body text-sm text-retro-blue hover:underline">
            Done
          </Link>
        </AppCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="font-display text-[8px] text-retro-accent mb-2 tracking-widest">CREATE</p>
        <h1 className="font-body text-2xl font-bold">Create unlock link</h1>
        <p className="mt-2 text-sm text-retro-text-dim">
          {STEPS[step]} — step {step + 1} of {STEPS.length}
        </p>
        {plan === "FREE" && linkQuota && (
          <p className="mt-2 text-xs text-retro-text-dim">
            {linkQuota.used}/{linkQuota.limit} links this week · {formatUnlockQuotaReset(linkQuota.resetsAt)}
          </p>
        )}
        <div className="app-wizard-header mt-4">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`app-wizard-step ${i === step ? "app-wizard-step-active" : i < step ? "app-wizard-step-done" : ""}`}
            >
              {i + 1}. {label.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {atLinkLimit && (
        <UpgradeNudge
          className="mb-6"
          title="You've used all 5 free links this week"
          description="Delete an old link from My links, wait for the weekly reset, or upgrade to Pro for unlimited links."
        />
      )}

      <RetroProgressBar value={step + 1} max={STEPS.length} showPercent={false} className="mb-8" />

      {step === 0 && (
        <AppCard className="p-6" accent="yellow">
          <h2 className="font-body text-lg font-bold mb-2">What are you giving away?</h2>
          <p className="text-sm text-retro-text-dim mb-6">Paste a link or write text — fans get it after your steps.</p>
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            {CONTENT_TYPES.map(({ type, label, hint, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setContentType(type)}
                className={`brutal-border p-4 text-left transition-all hover:-translate-y-0.5 ${
                  contentType === type ? "border-retro-accent bg-retro-accent/10 brutal-shadow-sm" : "bg-retro-surface-2"
                }`}
              >
                <Icon size={22} className="mb-2 text-retro-accent" />
                <p className="font-body text-sm font-bold">{label}</p>
                <p className="text-xs text-retro-text-dim mt-1">{hint}</p>
                {contentType === type && <Check size={14} className="mt-2 text-retro-success" />}
              </button>
            ))}
          </div>

          {contentType === "URL" && (
            <RetroInput
              label="Link"
              placeholder="https://drive.google.com/file/..."
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          )}
          {contentType === "TEXT" && (
            <RetroTextarea label="Text / code" rows={6} placeholder="Paste your code, key, or message..." value={textBody} onChange={(e) => setTextBody(e.target.value)} />
          )}

          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <RetroButton onClick={handleContentNext} loading={loading} disabled={atLinkLimit} className="w-full sm:w-auto">
              Next
            </RetroButton>
          </div>
        </AppCard>
      )}

      {step === 1 && (
        <AppCard className="p-6" accent="red">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-body text-lg font-bold mb-1">What must they do first?</h2>
              <p className="text-sm text-retro-text-dim">
                Pick a platform, paste your link, and name the button fans will tap.
              </p>
            </div>
            <span className="font-display text-[7px] bg-retro-yellow border-2 border-retro-ink px-2 py-1 shrink-0">
              {plan === "FREE"
                ? `FREE: ${actions.length}/${actionLimit} STEPS`
                : `PRO: ${actions.length}/${actionLimit} STEPS`}
            </span>
          </div>

          <p className="font-body text-xs font-semibold text-retro-text-dim mb-2">Supported platforms</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {UNLOCK_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                disabled={actions.length >= actionLimit}
                onClick={() => addAction(platform.id)}
                className={`flex min-h-[72px] flex-col items-center justify-center gap-1 border-2 border-retro-ink px-2 py-3 text-center transition-all disabled:cursor-not-allowed disabled:opacity-40 ${platform.accent}`}
              >
                <Plus size={14} className="shrink-0" />
                <span className="font-body text-[11px] font-bold leading-tight">{platform.shortName}</span>
              </button>
            ))}
          </div>

          {actions.length === 0 && (
            <div className="border-2 border-dashed border-retro-ink/30 p-6 text-center mb-6">
              <p className="font-body text-sm text-retro-text-dim">
                Tap a platform above to add your first step.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 mb-6">
            {actions.map((action, index) => {
              const platform = getPlatform(action.platformId)!;
              return (
                <div key={action.id} className="brutal-border bg-retro-surface-2 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`font-body text-xs font-bold px-2 py-1 border-2 border-retro-ink ${platform.accent}`}>
                      {platform.shortName}
                    </span>
                    <span className="font-display text-[8px] text-retro-text-dim">STEP {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeAction(action.id)}
                      className="ml-auto min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-retro-accent hover:bg-retro-accent/10 border-2 border-transparent hover:border-retro-accent"
                      aria-label={`Remove ${platform.shortName} step`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <RetroInput
                    label="Button name"
                    placeholder={platform.label}
                    value={action.label}
                    onChange={(e) => updateAction(action.id, { label: e.target.value })}
                  />
                  <div className="mt-3">
                    <RetroInput
                      label={`${platform.shortName} link`}
                      placeholder={platform.placeholder}
                      value={action.url}
                      onChange={(e) => updateAction(action.id, { url: e.target.value })}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {plan === "FREE" && actions.length >= actionLimit && (
            <UpgradeNudge
              className="mb-4"
              title="Free plan: 2 steps max"
              description="Upgrade to Pro for up to 4 steps per unlock link."
            />
          )}
          {plan !== "FREE" && actions.length >= actionLimit && (
            <p className="text-xs text-retro-text-dim mb-4">Pro plan = {actionLimit} steps max.</p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <RetroButton variant="ghost" onClick={() => setStep(0)} className="w-full sm:w-auto">
              Back
            </RetroButton>
            <RetroButton onClick={handleActionsNext} loading={loading} className="w-full sm:w-auto">
              Next
            </RetroButton>
          </div>
        </AppCard>
      )}

      {step === 2 && (
        <AppCard className="p-6" accent="blue">
          <h2 className="font-body text-lg font-bold mb-2">Name your link</h2>
          <p className="text-sm text-retro-text-dim mb-6">Fans see this on your unlock page.</p>
          <RetroInput
            label="Link name"
            placeholder="Free preset pack"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="mt-4">
            <RetroInput
              label="Unlock button text"
              placeholder="Get download"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
            />
          </div>

          {isPro ? (
            <div className="mt-6 pt-6 border-t-2 border-retro-ink/10 space-y-4">
              <p className="font-body text-sm font-bold">Pro branding</p>
              <RetroInput
                label="Custom URL ending"
                placeholder="free-preset-pack"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              {username && slug && (
                <p className="text-xs text-retro-text-dim font-mono break-all">
                  /u/{username}/{slug.replace(/\s+/g, "-").toLowerCase()}
                </p>
              )}
              <RetroInput
                label="Logo image URL (optional)"
                placeholder="https://..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              <div>
                <p className="font-body text-xs font-semibold text-retro-text-dim mb-2">Page color</p>
                <div className="flex flex-wrap gap-2">
                  {UNLOCK_THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`px-3 py-2 border-2 border-retro-ink text-xs font-bold ${t.swatch} ${
                        theme === t.id ? "brutal-shadow-sm ring-2 ring-retro-accent ring-offset-1" : ""
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <UpgradeNudge
              className="mt-6"
              title="Want your own look?"
              description="Pro removes ads, adds custom URL, colors, logo, and stats."
            />
          )}

          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <RetroButton variant="ghost" onClick={() => setStep(1)} className="w-full sm:w-auto">
              Back
            </RetroButton>
            <RetroButton onClick={handlePublishStep} loading={loading} className="w-full sm:w-auto">
              Publish
            </RetroButton>
          </div>
        </AppCard>
      )}
    </div>
  );
}

export default function CreateUnlockPage() {
  return (
    <Suspense fallback={<RetroLoading message="Loading..." />}>
      <CreateUnlockWizard />
    </Suspense>
  );
}
