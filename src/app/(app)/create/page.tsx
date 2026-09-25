"use client";

import { useState, useEffect, useCallback, useTransition, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RetroLoading, RetroButton, RetroInput, RetroTextarea, RetroProgressBar, RetroLink } from "@/components/retro";
import { useToast } from "@/components/retro";
import {
  createCampaign,
  updateCampaignContent,
  updateCampaignActions,
  updateCampaignCustomization,
  publishCampaign,
  getCampaign,
  applyUnlockThemeToAllCampaigns,
} from "@/lib/actions/campaigns";
import { isProPlan, PLAN_LIMITS } from "@/lib/stripe";
import { detectPlatformFromUrl, getPlatform, guessPlatform, UNLOCK_PLATFORMS } from "@/lib/unlock-platforms";
import { UpgradeNudge } from "@/components/dashboard/upgrade-nudge";
import { AppCard } from "@/components/dashboard/app-page-header";
import { applyCaptchaToTheme, themeUsesCaptcha } from "@/lib/easter-eggs";
import { applyStrictVerification, displayUnlockTheme, themeUsesStrictVerification } from "@/lib/unlock-campaign-theme";
import { ShareKit } from "@/components/dashboard/share-kit";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { UnlockPreviewPanel } from "@/components/dashboard/unlock-preview-panel";
import { UNLOCK_THEMES } from "@/lib/unlock-themes";
import { PlatformBrandIcon } from "@/components/marketing/platform-brand-icon";
import { Link as LinkIcon, FileText, Check, Plus, Trash2 } from "lucide-react";
import type { ContentType } from "@prisma/client";

const CONTENT_TYPES = [
  { type: "URL" as ContentType, label: "Link", hint: "Any download URL you host", icon: LinkIcon },
  { type: "TEXT" as ContentType, label: "Text / code", hint: "Show a key or message after unlock", icon: FileText },
];

type ActionDraft = {
  id: string;
  platformId: string;
  url: string;
  label: string;
  labelTouched: boolean;
};

const STEPS = ["Your content", "Fan steps", "Publish"];

function slugFromTitle(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

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
  const router = useRouter();
  const [isNavigating, startNav] = useTransition();
  const { toast } = useToast();
  const editId = searchParams.get("id");
  const creatingCampaignRef = useRef<Promise<string> | null>(null);
  const slugTouchedRef = useRef(false);
  const editStepAppliedRef = useRef(false);
  const templateAppliedRef = useRef(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState<"publish" | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(editId);
  const [username, setUsername] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [campaignStatus, setCampaignStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [actionLimit, setActionLimit] = useState(1);
  const [plan, setPlan] = useState("FREE");
  const [planReady, setPlanReady] = useState(false);
  const [editLoaded, setEditLoaded] = useState(!editId);
  const [editInitialStep, setEditInitialStep] = useState(0);
  const [stepBusy, setStepBusy] = useState(false);

  const [contentType, setContentType] = useState<ContentType>("URL");
  const [externalUrl, setExternalUrl] = useState("");
  const [textBody, setTextBody] = useState("");

  const [actions, setActions] = useState<ActionDraft[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Get download");
  const [theme, setTheme] = useState("default");
  const [logoUrl, setLogoUrl] = useState("");
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState("");
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState("");
  const [requireCaptcha, setRequireCaptcha] = useState(false);
  const [strictVerification, setStrictVerification] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const [autosaveBusy, setAutosaveBusy] = useState(false);
  const [applyingThemeAll, setApplyingThemeAll] = useState(false);

  const isPro = isProPlan(plan);
  const isPublishedEdit = !!editId && campaignStatus === "PUBLISHED";

  useEffect(() => {
    import("@/lib/actions/dashboard").then(({ getDashboardStats }) =>
      getDashboardStats()
        .then((s) => {
          setUsername(s.user.username);
          setActionLimit(s.actionLimit);
          setPlan(s.plan);
        })
        .finally(() => setPlanReady(true)),
    );
  }, []);

  useEffect(() => {
    if (!lastSavedAt) return;
    const tick = () => {
      const sec = Math.max(0, Math.floor((Date.now() - lastSavedAt) / 1000));
      setSavedLabel(sec < 5 ? "Saved · just now" : `Saved · ${sec}s ago`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [lastSavedAt]);

  useEffect(() => {
    if (editId || !planReady || templateAppliedRef.current) return;
    if (searchParams.get("template") !== "youtube") return;
    templateAppliedRef.current = true;
    setTitle("Subscribe to unlock");
    setDescription("Fans subscribe on YouTube, then get your link.");
    setActions([
      {
        id: crypto.randomUUID(),
        platformId: "youtube",
        url: "",
        label: "Subscribe on YouTube",
        labelTouched: true,
      },
    ]);
  }, [editId, planReady, searchParams]);

  useEffect(() => {
    if (!editId) {
      setEditLoaded(true);
      return;
    }
    setEditLoaded(false);
    editStepAppliedRef.current = false;
    getCampaign(editId).then((campaign) => {
      if (!campaign) {
        toast("Link not found", "error");
        return;
      }
      setCampaignId(campaign.id);
      setTitle(campaign.title);
      setDescription(campaign.description || "");
      setButtonText(campaign.buttonText);
      setTheme(displayUnlockTheme(campaign.theme));
      setRequireCaptcha(themeUsesCaptcha(campaign.theme));
      setStrictVerification(themeUsesStrictVerification(campaign.theme));
      setSlug(campaign.slug);
      slugTouchedRef.current = true;
      setLogoUrl(campaign.logoUrl || "");
      setBackgroundMusicUrl(campaign.backgroundMusicUrl || "");
      setBackgroundVideoUrl(campaign.backgroundVideoUrl || "");
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
          campaign.actions.slice(0, PLAN_LIMITS.PRO.actionsPerUnlock).map((a) => {
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
          }),
        );
      }
      setCampaignStatus(campaign.status as "DRAFT" | "PUBLISHED");
      if (campaign.content && campaign.actions.length) {
        setEditInitialStep(2);
      } else if (campaign.content) {
        setEditInitialStep(1);
        if (!campaign.actions.length) {
          setActions([newActionDraft()]);
        }
      } else {
        setEditInitialStep(0);
      }
    }).finally(() => setEditLoaded(true));
  }, [editId, toast]);

  useEffect(() => {
    if (!editId || !planReady || !editLoaded || editStepAppliedRef.current) return;
    editStepAppliedRef.current = true;
    setStep(editInitialStep);
    setActions((prev) => (prev.length > actionLimit ? prev.slice(0, actionLimit) : prev));
  }, [editId, planReady, editLoaded, editInitialStep, actionLimit]);

  useEffect(() => {
    if (step !== 1 || !planReady) return;
    setActions((prev) => {
      if (prev.length === 0) return [newActionDraft()];
      if (prev.length > actionLimit) return prev.slice(0, actionLimit);
      return prev;
    });
  }, [step, actionLimit, planReady]);

  const ensureCampaign = useCallback(async () => {
    if (campaignId) return campaignId;
    if (!creatingCampaignRef.current) {
      creatingCampaignRef.current = createCampaign({ title: title.trim() || "My unlock" })
        .then((campaign) => {
          setCampaignId(campaign.id);
          setSlug(campaign.slug);
          if (!title.trim()) setTitle(campaign.title);
          return campaign.id;
        })
        .catch((error) => {
          creatingCampaignRef.current = null;
          throw error;
        });
    }
    return creatingCampaignRef.current;
  }, [campaignId, title]);

  const saveContentToServer = useCallback(
    async (id: string) => {
      const content =
        contentType === "URL"
          ? { type: "URL" as ContentType, externalUrl: externalUrl.trim() }
          : { type: "TEXT" as ContentType, textBody: textBody.trim() };
      await updateCampaignContent(id, content);
    },
    [contentType, externalUrl, textBody]
  );

  const saveActionsToServer = useCallback(
    async (id: string) => {
      await updateCampaignActions(
        id,
        actions.map((action) => {
          const platform = getPlatform(action.platformId) ?? getPlatform("website")!;
          return {
            type: platform.type,
            label: action.label.trim(),
            config: { url: action.url.trim(), platform: platform.id },
            verificationMode: "MANUAL" as const,
          };
        }),
      );
    },
    [actions],
  );

  useEffect(() => {
    if (!planReady) return;
    setActions((prev) => (prev.length > actionLimit ? prev.slice(0, actionLimit) : prev));
  }, [planReady, actionLimit]);

  function buildThemePayload() {
    let themeValue = isPro ? theme : "default";
    themeValue = applyCaptchaToTheme(themeValue, requireCaptcha);
    return applyStrictVerification(themeValue, isPro && strictVerification);
  }

  const runAutosave = useCallback(async () => {
    if (published || stepBusy || saving === "publish") return;
    setAutosaveBusy(true);
    try {
      const id = await ensureCampaign();
      if (externalUrl.trim() || textBody.trim()) {
        await saveContentToServer(id);
      }
      if (actions.some((a) => a.url.trim() || a.label.trim())) {
        await saveActionsToServer(id);
      }
      if (step === 2 && title.trim()) {
        await updateCampaignCustomization(id, {
          title: title.trim(),
          description,
          buttonText: buttonText.trim() || "Get download",
          theme: buildThemePayload(),
          ...(isPro
            ? {
                logoUrl: logoUrl.trim() || null,
                slug: slug.trim() || undefined,
                backgroundMusicUrl: backgroundMusicUrl.trim() || null,
                backgroundVideoUrl: backgroundVideoUrl.trim() || null,
              }
            : {}),
        });
      }
      setLastSavedAt(Date.now());
    } catch {
      /* draft autosave is best-effort */
    } finally {
      setAutosaveBusy(false);
    }
  }, [
    published,
    stepBusy,
    saving,
    ensureCampaign,
    externalUrl,
    textBody,
    actions,
    step,
    title,
    description,
    buttonText,
    isPro,
    logoUrl,
    slug,
    backgroundMusicUrl,
    backgroundVideoUrl,
    saveContentToServer,
    saveActionsToServer,
    theme,
    requireCaptcha,
    strictVerification,
  ]);

  const scheduleAutosave = useCallback(() => {
    if (published) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      void runAutosave();
    }, 700);
  }, [published, runAutosave]);

  function onFieldBlur() {
    scheduleAutosave();
  }

  async function handleApplyThemeToAll() {
    if (!isPro) return;
    setApplyingThemeAll(true);
    try {
      const result = await applyUnlockThemeToAllCampaigns(theme);
      toast(`Applied color theme to ${result.updated} link${result.updated === 1 ? "" : "s"}`, "success");
    } catch (e) {
      toast(actionErrorMessage(e, "Could not apply theme"), "error");
    } finally {
      setApplyingThemeAll(false);
    }
  }

  function validateContent(): string | null {
    if (contentType === "URL" && !externalUrl.trim()) return "Paste your download link";
    if (contentType === "URL" && !/^https?:\/\/.+/i.test(externalUrl.trim())) return "Link must start with http:// or https://";
    if (contentType === "TEXT" && !textBody.trim()) return "Write what fans unlock";
    return null;
  }

  function handleContentNext() {
    if (!planReady || stepBusy) return;
    const err = validateContent();
    if (err) {
      toast(err, "error");
      return;
    }

    setStepBusy(true);
    void (async () => {
      try {
        const id = await ensureCampaign();
        await saveContentToServer(id);
        setActions((prev) => (prev.length === 0 ? [newActionDraft()] : prev.slice(0, actionLimit)));
        setStep(1);
      } catch (e) {
        toast(actionErrorMessage(e, "Could not save"), "error");
      } finally {
        setStepBusy(false);
      }
    })();
  }

  function validateActions(): string | null {
    if (actions.length === 0) return "Add at least one step for fans";
    if (actions.length > actionLimit) {
      return plan === "FREE"
        ? `Free plan: max ${actionLimit} step per link. Remove extra steps or upgrade to Pro for up to ${PLAN_LIMITS.PRO.actionsPerUnlock}.`
        : `Pro plan: max ${actionLimit} steps per link.`;
    }
    for (const action of actions) {
      if (!action.url.trim()) return "Paste a link for each step";
      if (!/^https?:\/\/.+/i.test(action.url.trim())) return "Each link must start with http:// or https://";
      if (!action.label.trim()) return "Name the button fans will tap";
    }
    return null;
  }

  function handleActionsNext() {
    if (!planReady || stepBusy) return;
    const err = validateActions();
    if (err) {
      toast(err, "error");
      return;
    }

    setStepBusy(true);
    void (async () => {
      try {
        const id = await ensureCampaign();
        await saveActionsToServer(id);
        setStep(2);
        if (!title.trim()) setTitle("My unlock");
      } catch (e) {
        toast(actionErrorMessage(e, "Could not save steps"), "error");
      } finally {
        setStepBusy(false);
      }
    })();
  }

  async function handleFinishStep() {
    if (stepBusy || saving === "publish") return;
    if (!title.trim()) {
      toast("Give your link a name", "error");
      return;
    }
    setSaving("publish");
    try {
      const id = await ensureCampaign();
      await saveContentToServer(id);
      await saveActionsToServer(id);
      const updated = await updateCampaignCustomization(id, {
        title: title.trim(),
        description,
        buttonText: buttonText.trim() || "Get download",
        theme: buildThemePayload(),
        ...(isPro
          ? {
              logoUrl: logoUrl.trim() || null,
              slug: slug.trim() || undefined,
              backgroundMusicUrl: backgroundMusicUrl.trim() || null,
              backgroundVideoUrl: backgroundVideoUrl.trim() || null,
            }
          : {}),
      });
      setSlug(updated.slug);

      if (isPublishedEdit) {
        toast("Changes saved", "success");
        startNav(() => router.push("/unlocks"));
        return;
      }

      const result = await publishCampaign(id);
      setPublishedUrl(result.unlockUrl);
      setPublished(true);
      toast("Your link is live!", "success");
    } catch (e) {
      toast(actionErrorMessage(e, isPublishedEdit ? "Could not save" : "Could not publish"), "error");
    } finally {
      setSaving(null);
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
    if (actionLimit === 1 && actions.length <= 1) {
      toast("Your plan requires at least one fan step on this link.", "error");
      return;
    }
    if (actions.length <= 1) {
      toast("Add at least one step for fans.", "error");
      return;
    }
    setActions((prev) => prev.filter((a) => a.id !== id));
  }

  function quickAddPlatform(platformId: string) {
    const platform = getPlatform(platformId);
    if (!platform) return;
    if (actions.length >= actionLimit) {
      toast(
        `${plan === "FREE" ? "Free" : "Pro"} plan: max ${actionLimit} step${actionLimit === 1 ? "" : "s"}.`,
        "error",
      );
      return;
    }
    setActions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        platformId,
        url: "",
        label: platform.label,
        labelTouched: false,
      },
    ]);
  }

  if (!planReady || !editLoaded) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <RetroLoading message="Loading creator" />
      </div>
    );
  }

  if (published) {
    const url = publishedUrl;
    return (
      <div className="mx-auto max-w-lg text-center">
        <AppCard className="p-8" accent="green">
          <div className="create-publish-success-actions">
            <h1 className="font-body text-2xl font-bold mb-2">Your link is live</h1>
            <ShareKit url={url} title={title || "My unlock link"} />
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <RetroButton type="button" onClick={() => window.open(url, "_blank", "noopener,noreferrer")} className="w-full sm:w-auto">
                Open live page
              </RetroButton>
              <CopyLinkButton url={url} />
            </div>
          </div>
          <p className="font-body text-sm text-retro-text-dim mb-4">Share this anywhere:</p>
          <p className="font-mono text-sm bg-retro-surface-2 border-2 border-retro-ink p-3 break-all">{url}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <RetroLink href="/create" variant="secondary" className="w-full sm:w-auto">
              Create another
            </RetroLink>
          </div>
          <RetroLink href="/dashboard" variant="ghost" className="inline-block mt-6 text-sm">
            Back to dashboard
          </RetroLink>
        </AppCard>
      </div>
    );
  }

  return (
    <div className="create-wizard relative z-10 mx-auto max-w-2xl">
      <div className="create-wizard-sticky mb-8">
        <h1 className="font-body text-2xl font-bold">{editId ? "Edit link" : "Create link"}</h1>
        <p className="mt-2 text-sm text-retro-text-dim">
          Step {step + 1} of {STEPS.length}: {step === 2 ? "Publish" : STEPS[step]}
        </p>
        {plan === "FREE" && (
          <p className="mt-1 text-xs text-retro-text-muted">
            Free · unlimited links · {actionLimit} step per link ({PLAN_LIMITS.PRO.actionsPerUnlock} on Pro)
          </p>
        )}
        <RetroProgressBar value={step + 1} max={STEPS.length} showPercent={false} className="mt-4" />
        <p className="create-autosave-status mt-2" aria-live="polite">
          {autosaveBusy ? "Saving…" : savedLabel ?? (campaignId ? "Edits save when you leave a field" : "")}
        </p>
      </div>

      {step === 0 && (
        <AppCard className="p-6" accent="yellow">
          <h2 className="font-body text-lg font-bold mb-1">What do fans unlock?</h2>
          <p className="text-sm text-retro-text-dim mb-6">Paste the file link or text fans get after completing your steps.</p>
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            {CONTENT_TYPES.map(({ type, label, hint, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setContentType(type)}
                className={`brutal-border p-4 text-left ${
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
              placeholder="https://your-file-link.com/..."
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              onBlur={onFieldBlur}
            />
          )}
          {contentType === "TEXT" && (
            <RetroTextarea
              label="Text fans see"
              rows={6}
              placeholder="Your code, key, or message..."
              value={textBody}
              onChange={(e) => setTextBody(e.target.value)}
              onBlur={onFieldBlur}
            />
          )}

          <div className="wizard-footer">
            <RetroButton type="button" onClick={handleContentNext} loading={stepBusy} size="lg" className="w-full sm:w-auto sm:min-w-[140px]">
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
                Paste a subscribe / follow / join link — we pick the platform and button name for you.
              </p>
            </div>
            <span className="text-xs font-semibold bg-retro-surface-2 border border-retro-ink px-2 py-1 shrink-0">
              {actions.length}/{actionLimit} steps
            </span>
          </div>

          <div className="flex flex-col gap-4 mb-4">
            {actions.map((action, index) => {
              const platform = getPlatform(action.platformId) ?? getPlatform("website");
              return (
                <div key={action.id} className="step-card">
                  <div className="step-card-header">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-retro-text-dim shrink-0">Step {index + 1}</span>
                      {platform && (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 border border-retro-ink shrink-0 ${platform.accent}`}>
                          <PlatformBrandIcon platform={platform.id} size="sm" />
                          {platform.shortName}
                        </span>
                      )}
                    </div>
                    {actionLimit > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeAction(action.id)}
                        className="step-remove-btn"
                        aria-label="Remove step"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <RetroInput
                    label="Paste link"
                    placeholder="https://platform.com/your-page"
                    value={action.url}
                    onChange={(e) => updateActionUrl(action.id, e.target.value)}
                    onBlur={onFieldBlur}
                  />
                  <div className="mt-3">
                    <RetroInput
                      label="Button name (what fans tap)"
                      placeholder="Follow / Subscribe / Join"
                      value={action.label}
                      onChange={(e) => updateActionLabel(action.id, e.target.value)}
                      onBlur={onFieldBlur}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {actions.length === 0 && (
            <p className="text-sm text-retro-text-dim text-center py-4 mb-2 border-2 border-dashed border-retro-ink/25">
              No steps yet — add one below or quick-add a platform.
            </p>
          )}

          {actionLimit > 1 && actions.length < actionLimit ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {UNLOCK_PLATFORMS.filter((p) => ["tiktok", "instagram", "youtube", "website"].includes(p.id)).map((p) => (
                  <RetroButton key={p.id} type="button" variant="secondary" size="sm" onClick={() => quickAddPlatform(p.id)}>
                    + {p.shortName}
                  </RetroButton>
                ))}
              </div>

              <RetroButton
                type="button"
                variant="secondary"
                onClick={addAction}
                disabled={actions.length >= actionLimit}
                className="w-full mb-8"
                size="lg"
              >
                <Plus size={16} />
                Add step
              </RetroButton>
            </>
          ) : (
            <p className="text-xs text-retro-text-muted mb-6">
              {actionLimit === 1
                ? "Free includes one fan step on this link. Upgrade to Pro for up to 5 steps."
                : `You can add up to ${actionLimit} steps on this link.`}
            </p>
          )}

          {plan === "FREE" ? (
            <UpgradeNudge
              className="mb-4"
              title="Free: 1 step per link"
              description={`Pro lets you add up to ${PLAN_LIMITS.PRO.actionsPerUnlock} steps per link.`}
            />
          ) : null}

          <div className="wizard-footer wizard-footer--split">
            <RetroButton type="button" variant="ghost" onClick={() => setStep(0)} size="lg" className="w-full sm:w-auto">
              Back
            </RetroButton>
            <RetroButton type="button" onClick={handleActionsNext} loading={stepBusy} size="lg" className="w-full sm:w-auto sm:min-w-[140px]">
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
            onChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              if (isPro && !slugTouchedRef.current) {
                setSlug(slugFromTitle(next));
              }
            }}
            onBlur={onFieldBlur}
          />
          <div className="mt-4">
            <RetroTextarea
              label="Description (optional)"
              rows={3}
              placeholder="Short note fans see before unlocking..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={onFieldBlur}
            />
          </div>
          <div className="mt-4">
            <RetroInput
              label="Unlock button text"
              placeholder="Get download"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              onBlur={onFieldBlur}
            />
          </div>

          <label className="mt-4 flex items-start gap-3 text-sm text-retro-text-dim cursor-pointer">
            <input
              type="checkbox"
              checked={requireCaptcha}
              onChange={(e) => setRequireCaptcha(e.target.checked)}
              className="mt-1"
            />
            <span>
              <strong className="text-retro-text">Spam protection</strong> — add a hidden bot check on the unlock page (recommended for public links).
            </span>
          </label>

          {isPro ? (
            <label className="mt-3 flex items-start gap-3 text-sm text-retro-text-dim cursor-pointer">
              <input
                type="checkbox"
                checked={strictVerification}
                onChange={(e) => setStrictVerification(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong className="text-retro-text">Strict verification</strong> — fans must stay on YouTube and other sites longer before a step counts (Standard is faster).
              </span>
            </label>
          ) : null}

          <div className="mt-6">
            <RetroButton type="button" variant="secondary" size="sm" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? "Hide fan preview" : "See what fans see"}
            </RetroButton>
          </div>
          {showPreview ? (
            <UnlockPreviewPanel
              className="mt-4"
              title={title}
              description={description}
              buttonText={buttonText}
              theme={theme}
              actions={actions.map((a) => ({
                platformId: a.platformId,
                label: a.label,
                url: a.url,
              }))}
            />
          ) : null}

          {isPro ? (
            <div className="mt-6 pt-6 border-t-2 border-retro-ink/10 space-y-4">
              <p className="font-body text-sm font-bold">Pro options</p>
              <RetroInput
                label="Custom URL ending"
                placeholder="free-preset-pack"
                value={slug}
                onChange={(e) => {
                  slugTouchedRef.current = true;
                  setSlug(e.target.value);
                }}
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
                <div className="flex flex-wrap gap-3">
                  {UNLOCK_THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`px-4 py-2.5 border-2 border-retro-ink text-xs font-bold rounded-lg ${t.swatch} ${
                        theme === t.id ? "brutal-shadow-sm ring-2 ring-retro-accent ring-offset-1" : ""
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <RetroButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  loading={applyingThemeAll}
                  onClick={() => void handleApplyThemeToAll()}
                >
                  Apply this color to all my links
                </RetroButton>
              </div>
              <RetroInput
                label="Background music URL (optional)"
                placeholder="https://...mp3 or direct audio link"
                value={backgroundMusicUrl}
                onChange={(e) => setBackgroundMusicUrl(e.target.value)}
              />
              <p className="text-xs text-retro-text-muted -mt-2">
                Paste a direct link to an MP3 or audio file. Fans hear it when they start a step.
              </p>
              <RetroInput
                label="Background video URL (optional)"
                placeholder="https://...mp4 or direct video link"
                value={backgroundVideoUrl}
                onChange={(e) => setBackgroundVideoUrl(e.target.value)}
              />
              <p className="text-xs text-retro-text-muted -mt-2">
                Paste a direct link to an MP4 or video file for a looping background on your unlock page.
              </p>
            </div>
          ) : (
            <UpgradeNudge
              className="mt-6"
              title={`Want ${PLAN_LIMITS.PRO.actionsPerUnlock} steps and custom branding?`}
              description="Pro adds deeper funnels, your logo and colors, analytics, and no ads."
            />
          )}

          <div className="wizard-footer wizard-footer--split">
            <RetroButton type="button" variant="ghost" onClick={() => setStep(1)} size="lg" className="w-full sm:w-auto">
              Back
            </RetroButton>
            <RetroButton type="button" onClick={handleFinishStep} loading={saving === "publish" || isNavigating} size="lg" className="w-full sm:w-auto sm:min-w-[160px]">
              {isPublishedEdit ? "Save changes" : "Publish link"}
            </RetroButton>
          </div>
        </AppCard>
      )}
    </div>
  );
}

export default function CreateUnlockPage() {
  return (
    <Suspense fallback={<RetroLoading message="Loading" />}>
      <CreateUnlockWizard />
    </Suspense>
  );
}
