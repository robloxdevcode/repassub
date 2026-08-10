"use client";

import { useEffect, useState } from "react";
import { getNotificationSettings, updateNotificationSettings } from "@/lib/actions/settings";
import { useToast } from "@/components/retro";

export function NotificationSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [notifyUnlockEmail, setNotifyUnlockEmail] = useState(true);
  const [notifyWeeklyEmail, setNotifyWeeklyEmail] = useState(false);
  const [notifySecurityEmail, setNotifySecurityEmail] = useState(true);

  useEffect(() => {
    getNotificationSettings()
      .then((s) => {
        setEmail(s.email);
        setEmailConfigured(s.emailConfigured);
        setNotifyUnlockEmail(s.notifyUnlockEmail);
        setNotifyWeeklyEmail(s.notifyWeeklyEmail);
        setNotifySecurityEmail(s.notifySecurityEmail);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(patch: {
    notifyUnlockEmail?: boolean;
    notifyWeeklyEmail?: boolean;
    notifySecurityEmail?: boolean;
  }) {
    setSaving(true);
    try {
      await updateNotificationSettings(patch);
      toast("Notification settings saved", "success");
    } catch {
      toast("Could not save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-retro-text-dim">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-retro-text-dim mb-2">
        Alerts go to <strong>{email || "your account email"}</strong>
      </p>

      {!emailConfigured && (
        <div className="brutal-border bg-retro-yellow/40 p-4 text-sm text-retro-text-dim">
          Email alerts need a Resend API key in your server settings. Unlock alerts are saved but won&apos;t send until{" "}
          <code className="text-xs">RESEND_API_KEY</code> is set.
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer brutal-border bg-retro-surface-2 p-4">
        <input
          type="checkbox"
          className="h-4 w-4 mt-0.5 accent-retro-accent"
          checked={notifyUnlockEmail}
          disabled={saving}
          onChange={(e) => {
            setNotifyUnlockEmail(e.target.checked);
            save({ notifyUnlockEmail: e.target.checked });
          }}
        />
        <span>
          <span className="font-body text-sm font-bold block">Unlock alerts</span>
          <span className="text-xs text-retro-text-dim">Email me when someone completes all steps and unlocks.</span>
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-not-allowed opacity-50 brutal-border bg-retro-surface-2 p-4">
        <input type="checkbox" disabled checked={notifyWeeklyEmail} className="h-4 w-4 mt-0.5 accent-retro-accent" />
        <span>
          <span className="font-body text-sm font-bold block">Weekly summary</span>
          <span className="text-xs text-retro-text-dim">Coming soon</span>
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer brutal-border bg-retro-surface-2 p-4">
        <input
          type="checkbox"
          className="h-4 w-4 mt-0.5 accent-retro-accent"
          checked={notifySecurityEmail}
          disabled={saving}
          onChange={(e) => {
            setNotifySecurityEmail(e.target.checked);
            save({ notifySecurityEmail: e.target.checked });
          }}
        />
        <span>
          <span className="font-body text-sm font-bold block">Security alerts</span>
          <span className="text-xs text-retro-text-dim">Login and account changes (when available).</span>
        </span>
      </label>
    </div>
  );
}
