"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { Upload, Link as LinkIcon, FileText, Check } from "lucide-react";
import type { ActionType, ContentType, VerificationMode } from "@prisma/client";

const CONTENT_TYPES = [
  { type: "FILE" as ContentType, label: "UPLOAD FILE", icon: Upload },
  { type: "URL" as ContentType, label: "PASTE URL", icon: LinkIcon },
  { type: "TEXT" as ContentType, label: "WRITE CONTENT", icon: FileText },
];

const ACTION_TYPES: { type: ActionType; label: string; desc: string }[] = [
  { type: "FOLLOW", label: "FOLLOW", desc: "Follow on social media" },
  { type: "SUBSCRIBE", label: "SUBSCRIBE", desc: "Subscribe to channel" },
  { type: "JOIN", label: "JOIN COMMUNITY", desc: "Join Discord/community" },
  { type: "EMAIL", label: "EMAIL", desc: "Submit email address" },
  { type: "VISIT", label: "VISIT PAGE", desc: "Visit a website" },
];

const STEPS = ["CONTENT", "ACTIONS", "CUSTOMIZE", "PUBLISH"];

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

  const [contentType, setContentType] = useState<ContentType>("URL");
  const [externalUrl, setExternalUrl] = useState("");
  const [textBody, setTextBody] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const [selectedActions, setSelectedActions] = useState<ActionType[]>([]);
  const [actionConfigs, setActionConfigs] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("UNLOCK");
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    import("@/lib/actions/dashboard").then(({ getDashboardStats }) =>
      getDashboardStats().then((s) => setUsername(s.user.username))
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
        if (campaign.content) {
          setContentType(campaign.content.type);
          setExternalUrl(campaign.content.externalUrl || "");
          setTextBody(campaign.content.textBody || "");
          setFileUrl(campaign.content.fileUrl || "");
          setFileName(campaign.content.fileName || "");
        }
        if (campaign.actions.length) {
          setSelectedActions(campaign.actions.map((a) => a.type));
          const configs: Record<string, string> = {};
          campaign.actions.forEach((a) => {
            const config = a.config as Record<string, string>;
            configs[a.type] = config?.url || config?.platform || "";
          });
          setActionConfigs(configs);
        }
      });
    }
  }, [editId]);

  const ensureCampaign = useCallback(async () => {
    if (campaignId) return campaignId;
    setLoading(true);
    try {
      const campaign = await createCampaign({ title: title || "Untitled Unlock" });
      setCampaignId(campaign.id);
      setSlug(campaign.slug);
      return campaign.id;
    } finally {
      setLoading(false);
    }
  }, [campaignId, title]);

  async function handleContentNext() {
    setLoading(true);
    try {
      const id = await ensureCampaign();
      const content =
        contentType === "URL"
          ? { type: contentType, externalUrl }
          : contentType === "TEXT"
          ? { type: contentType, textBody }
          : { type: contentType, fileUrl, fileName: fileName || "file" };

      await updateCampaignContent(id, content);
      setStep(1);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Error saving content", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleActionsNext() {
    if (selectedActions.length === 0) {
      toast("Select at least one action", "error");
      return;
    }
    setLoading(true);
    try {
      const id = await ensureCampaign();
      await updateCampaignActions(
        id,
        selectedActions.map((type) => ({
          type,
          label: ACTION_TYPES.find((a) => a.type === type)?.label || type,
          config: { url: actionConfigs[type] || "" },
          verificationMode: "MANUAL" as const,
        }))
      );
      setStep(2);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Error saving actions", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCustomizeNext() {
    if (!title) {
      toast("Title is required", "error");
      return;
    }
    setLoading(true);
    try {
      const id = await ensureCampaign();
      await updateCampaignCustomization(id, { title, description, buttonText, theme });
      setStep(3);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Error saving customization", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setLoading(true);
    try {
      const id = await ensureCampaign();
      await publishCampaign(id);
      setPublished(true);
      toast("Unlock published!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Error publishing", "error");
    } finally {
      setLoading(false);
    }
  }

  function toggleAction(type: ActionType) {
    setSelectedActions((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  useEffect(() => {
    import("@/lib/actions/dashboard").then(({ getDashboardStats }) =>
      getDashboardStats().then((s) => setUsername(s.user.username))
    );
  }, []);

  if (published) {
    const url = getUnlockUrl(username || "player", slug);
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="retro-panel p-8 animate-pulse-glow">
          <h1 className="font-display text-3xl text-retro-success glow-text">YOUR UNLOCK IS READY!</h1>
          <p className="mt-4 font-mono text-sm text-retro-glow break-all">{url}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <RetroButton onClick={() => navigator.clipboard.writeText(url)}>COPY LINK</RetroButton>
            <RetroButton variant="secondary" onClick={() => window.open(url, "_blank")}>
              VIEW PAGE
            </RetroButton>
          </div>
          <p className="mt-6 font-display text-sm text-retro-glow">★ YOUR UNLOCK IS LIVE ★</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl tracking-wider mb-2">CREATE UNLOCK</h1>
      <p className="text-sm text-retro-text-dim mb-8">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

      <RetroProgressBar value={step + 1} max={STEPS.length} showPercent={false} className="mb-8" />

      {step === 0 && (
        <div>
          <h2 className="font-display text-lg mb-6">WHAT ARE YOU GIVING AWAY?</h2>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {CONTENT_TYPES.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setContentType(type)}
                className={`retro-panel p-6 text-center transition-all hover:-translate-y-1 ${
                  contentType === type ? "border-retro-glow shadow-[0_0_20px_rgba(0,229,255,0.3)]" : ""
                }`}
              >
                <Icon size={32} className="mx-auto mb-3 text-retro-glow" />
                <p className="font-display text-sm">{label}</p>
                {contentType === type && <Check size={16} className="mx-auto mt-2 text-retro-success" />}
              </button>
            ))}
          </div>

          {contentType === "URL" && (
            <RetroInput label="URL" placeholder="https://..." value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
          )}
          {contentType === "TEXT" && (
            <RetroTextarea label="CONTENT" rows={6} value={textBody} onChange={(e) => setTextBody(e.target.value)} />
          )}
          {contentType === "FILE" && (
            <RetroInput label="FILE URL" placeholder="Upload URL or paste link" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
          )}

          <div className="mt-8 flex justify-end">
            <RetroButton onClick={handleContentNext} loading={loading}>CONTINUE</RetroButton>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="font-display text-lg mb-6">HOW SHOULD PEOPLE UNLOCK IT?</h2>
          <div className="flex flex-col gap-3 mb-8">
            {ACTION_TYPES.map(({ type, label, desc }) => (
              <button
                key={type}
                onClick={() => toggleAction(type)}
                className={`retro-panel p-4 text-left flex items-center gap-4 transition-all hover:-translate-y-0.5 ${
                  selectedActions.includes(type) ? "border-retro-glow shadow-[0_0_15px_rgba(0,229,255,0.2)]" : ""
                }`}
              >
                <div className={`h-5 w-5 border-2 flex items-center justify-center ${
                  selectedActions.includes(type) ? "border-retro-success bg-retro-success/20" : "border-retro-border-dim"
                }`}>
                  {selectedActions.includes(type) && <Check size={12} className="text-retro-success" />}
                </div>
                <div>
                  <p className="font-display text-sm">{label}</p>
                  <p className="text-xs text-retro-text-dim">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          {selectedActions.includes("VISIT") && (
            <RetroInput
              label="VISIT URL"
              placeholder="https://..."
              value={actionConfigs.VISIT || ""}
              onChange={(e) => setActionConfigs({ ...actionConfigs, VISIT: e.target.value })}
              className="mb-4"
            />
          )}

          <div className="mt-8 flex justify-between">
            <RetroButton variant="ghost" onClick={() => setStep(0)}>BACK</RetroButton>
            <RetroButton onClick={handleActionsNext} loading={loading}>CONTINUE</RetroButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-display text-lg mb-6">CUSTOMIZE YOUR UNLOCK</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <RetroInput label="TITLE" value={title} onChange={(e) => setTitle(e.target.value)} />
              <RetroTextarea label="DESCRIPTION" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              <RetroInput label="BUTTON TEXT" value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
            </div>
            <div className="retro-panel p-4">
              <p className="font-display text-xs text-retro-text-dim mb-4 text-center">LIVE PREVIEW</p>
              <div className="text-center">
                <p className="font-display text-xs text-retro-glow mb-2">★ YOUR LOGO ★</p>
                <h3 className="font-display text-lg">{title || "YOUR TITLE"}</h3>
                <p className="mt-2 text-sm text-retro-text-dim">{description || "Description here"}</p>
                <div className="mt-4 inline-block">
                  <RetroButton size="sm">{buttonText}</RetroButton>
                </div>
                <p className="mt-4 font-display text-xs text-retro-warning">STATUS: LOCKED</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <RetroButton variant="ghost" onClick={() => setStep(1)}>BACK</RetroButton>
            <RetroButton onClick={handleCustomizeNext} loading={loading}>CONTINUE</RetroButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <h2 className="font-display text-lg mb-6">READY TO PUBLISH?</h2>
          <div className="retro-panel p-8 mb-8">
            <h3 className="font-display text-xl">{title}</h3>
            <p className="mt-2 text-sm text-retro-text-dim">{description}</p>
            <p className="mt-4 text-sm">{selectedActions.length} action(s) required</p>
          </div>
          <RetroButton size="lg" onClick={handlePublish} loading={loading}>
            PUBLISH UNLOCK
          </RetroButton>
          <div className="mt-4">
            <RetroButton variant="ghost" onClick={() => setStep(2)}>BACK</RetroButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateUnlockPage() {
  return (
    <Suspense fallback={<RetroLoading message="INITIALIZING..." />}>
      <CreateUnlockWizard />
    </Suspense>
  );
}
