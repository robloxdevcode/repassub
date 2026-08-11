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
import { formatUnlockQuotaReset } from "@/lib/stripe";
import { detectPlatformFromUrl, getPlatform, guessPlatform } from "@/lib/unlock-platforms";
import { UpgradeNudge } from "@/components/dashboard/upgrade-nudge";
import { AppCard } from "@/components/dashboard/app-page-header";
import { UNLOCK_THEMES } from "@/lib/unlock-themes";
import { isProPlan } from "@/lib/stripe";
import { Link as LinkIcon, FileText, Check, Plus, Trash2 } from "lucide-react";
import type { ContentType } from "@prisma/client";

const CONTENT_TYPES = [
  { type: "URL" as ContentType, label: "Link", hint: "Drive, Dropbox, any download URL", icon: LinkIcon },
  { type: "TEXT" as ContentType, label: "Text / code", hint: "Show a key or message after unlock", icon: FileText },
];

type ActionDraft = {
  id: string;
  platformId: string;
  url: string;
  label: string;
  labelTouched: boolean;
};

const STEPS = ["Your file", "Fan steps", "Publish"];

function actionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("Server Components render") || msg.includes("Minified React error #441")) {
      return "Could not save — please try again.";
    }
    return msg || fallback;
  }
  return fallback;
}

function newActionDraft(): ActionDraft {
  return {
    id: crypto.randomUUID(),
    platformId: "website",
    url: "",
    label: "Complete this step",
    labelTouched: false,
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
  const [publishedUrl, setPublishedUrl] = useState("");
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
                labelTouched: true,
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
    if (contentType === "URL" && !externalUrl.trim()) return "Paste your download link";
    if (contentType === "URL" && !/^https?:\/\/.+/i.test(externalUrl.trim())) return "Link must start with http:// or https://";
    if (contentType === "TEXT" && !textBody.trim()) return "Write what fans unlock";
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
      toast(actionErrorMessage(e, "Could not save"), "error");
    } finally {
      setLoading(false);
    }
  }

  function validateActions(): string | null {
    if (actions.length === 0) return "Add at least one step for fans";
    if (actions.length > actionLimit) {
      return plan === "FREE"
        ? `Free plan: max ${actionLimit} steps. Remove ${actions.length - actionLimit} or upgrade.`
        : `Pro plan: max ${actionLimit} steps.`;
    }
    for (const action of actions) {
      if (!action.url.trim()) return "Paste a link for each step";
      if (!/^https?:\/\/.+/i.test(action.url.trim())) return "Each link must start with http:// or https://";
      if (!action.label.trim()) return "Name the button fans will tap";
      if (!getPlatform(action.platformId)) return "Could not detect platform on one step — check the link";
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
      toast(actionErrorMessage(e, "Could not save steps"), "error");
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
      const result = await publishCampaign(id);
      setPublishedUrl(result.unlockUrl);
      setPublished(true);
      toast("Your link is live!", "success");
    } catch (e) {
      toast(actionErrorMessage(e, "Could not publish"), "error");
    } finally {
      setLoading(false);
    }
  }

  function addAction() {
    if (actions.length >= actionLimit) {
      toast(`${plan === "FREE" ? "Free" : "Pro"} plan: max ${actionLimit} steps.`, "error");
      return;
    }
    setActions((prev) => [...prev, newActionDraft()]);
  }

  function updateActionUrl(id: string, url: string) {
    const detected = detectPlatformFromUrl(url);
    setActions((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next: ActionDraft = { ...a, url };
        if (detected) {
          next.platformId = detected.id;
          if (!a.labelTouched) {
            next.label = detected.label;
          }
        }
        return next;
      })
    );
  }

  function updateActionLabel(id: string, label: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, label, labelTouched: true } : a))
    );
  }

  function removeAction(id: string) {
    setActions((prev) => prev.filter((a) => a.id !== id));
  }

  if (published) {
    const url = publishedUrl;
    return (
      <div className="mx-auto max-w-lg text-center">
        <AppCard className="p-8" accent="green">
          <h1 className="font-body text-2xl font-bold mb-2">Link is live</h1>
          <p className="font-body text-sm text-retro-text-dim mb-4">Share this anywhere:</p>
          <p className="font-mono text-sm bg-retro-surface-2 border-2 border-retro-ink p-3 break-all">{url}</p>
          <div className="mt-8">
            <RetroButton onClick={() => navigator.clipboard.writeText(url)} className="w-full sm:w-auto">
              Copy link
            </RetroButton>
          </div>
          <Link href="/dashboard" className="inline-block mt-6 font-body text-sm text-retro-blue hover:underline">
            Back to dashboard
          </Link>
        </AppCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-body text-2xl font-bold">Create link</h1>
        <p className="mt-2 text-sm text-retro-text-dim">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        {plan === "FREE" && linkQuota && (
          <p className="mt-1 text-xs text-retro-text-muted">
            {linkQuota.used}/{linkQuota.limit} links this week ({formatUnlockQuotaReset(linkQuota.resetsAt)})
          </p>
        )}
        <RetroProgressBar value={step + 1} max={STEPS.length} showPercent={false} className="mt-4" />
      </div>

      {atLinkLimit && (
        <UpgradeNudge
          className="mb-6"
          title="Weekly link limit reached"
          description="Delete an old link, wait for reset, or upgrade to Pro."
        />
      )}

      {step === 0 && (
        <AppCard className="p-6" accent="yellow">
          <h2 className="font-body text-lg font-bold mb-1">What do fans unlock?</h2>
          <p className="text-sm text-retro-text-dim mb-6">Paste the file or page they get after finishing your steps.</p>
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
              label="Download link"
              placeholder="https://drive.google.com/file/..."
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          )}
          {contentType === "TEXT" && (
            <RetroTextarea
              label="Text fans see"
              rows={6}
              placeholder="Your code, key, or message..."
              value={textBody}
              onChange={(e) => setTextBody(e.target.value)}
            />
          )}

          <div className="mt-8 flex justify-end">
            <RetroButton onClick={handleContentNext} loading={loading} disabled={atLinkLimit}>
              Next
            </RetroButton>
          </div>
        </AppCard>
      )}

      {step === 1 && (
        <AppCard className="p-6" accent="red">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-body text-lg font-bold mb-1">What must fans do first?</h2>
              <p className="text-sm text-retro-text-dim">
                Add a step, paste your subscribe/join/follow link — we name the button for you.
              </p>
            </div>
            <span className="text-xs font-semibold bg-retro-surface-2 border border-retro-ink px-2 py-1 shrink-0">
              {actions.length}/{actionLimit} steps
            </span>
          </div>

          <div className="flex flex-col gap-4 mb-4">
            {actions.map((action, index) => {
              const platform = getPlatform(action.platformId);
              return (
                <div key={action.id} className="brutal-border bg-retro-surface-2 p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-retro-text-dim">Step {index + 1}</span>
                    {platform && (
                      <span className={`text-xs font-bold px-2 py-0.5 border border-retro-ink ${platform.accent}`}>
                        {platform.shortName}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAction(action.id)}
                      className="ml-auto p-2 text-retro-accent hover:bg-retro-accent/10"
                      aria-label="Remove step"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <RetroInput
                    label="Paste link"
                    placeholder="https://youtube.com/@you or discord.gg/..."
                    value={action.url}
                    onChange={(e) => updateActionUrl(action.id, e.target.value)}
                  />
                  <div className="mt-3">
                    <RetroInput
                      label="Button name (what fans tap)"
                      placeholder="Subscribe on YouTube"
                      value={action.label}
                      onChange={(e) => updateActionLabel(action.id, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {actions.length === 0 && (
            <p className="text-sm text-retro-text-dim text-center py-4 mb-2 border-2 border-dashed border-retro-ink/25">
              No steps yet — add one below.
            </p>
          )}

          <RetroButton
            type="button"
            variant="secondary"
            onClick={addAction}
            disabled={actions.length >= actionLimit}
            className="w-full mb-6"
          >
            <Plus size={16} />
            Add step
          </RetroButton>

          {plan === "FREE" && actions.length >= actionLimit && (
            <UpgradeNudge className="mb-4" title="Free: 2 steps max" description="Pro allows up to 4 steps per link." />
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <RetroButton variant="ghost" onClick={() => setStep(0)}>
              Back
            </RetroButton>
            <RetroButton onClick={handleActionsNext} loading={loading}>
              Next
            </RetroButton>
          </div>
        </AppCard>
      )}

      {step === 2 && (
        <AppCard className="p-6" accent="blue">
          <h2 className="font-body text-lg font-bold mb-1">Finish up</h2>
          <p className="text-sm text-retro-text-dim mb-6">Name your page — fans see this before they unlock.</p>
          <RetroInput
            label="Page title"
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
              <p className="font-body text-sm font-bold">Pro options</p>
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
                label="Logo URL (optional)"
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
              title="Want custom URL and colors?"
              description="Pro removes ads and adds branding plus stats."
            />
          )}

          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <RetroButton variant="ghost" onClick={() => setStep(1)}>
              Back
            </RetroButton>
            <RetroButton onClick={handlePublishStep} loading={loading}>
              Publish link
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
