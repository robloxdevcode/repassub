"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "linklock-admin-speed-note-dismissed-v1";

export function AdminUpdateAnnouncement() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="admin-v2-update-banner" role="status">
      <p className="admin-v2-update-banner-text">
        <strong>Update:</strong> All the staff buttons and tabs load faster now — suspend, roles, search, and navigation should feel snappier.
      </p>
      <button type="button" className="admin-v2-update-banner-dismiss" onClick={dismiss}>
        Got it
      </button>
    </div>
  );
}
