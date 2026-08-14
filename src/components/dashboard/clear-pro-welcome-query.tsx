"use client";

import { useEffect } from "react";

/** Strip checkout query params from the URL after the welcome banner renders. */
export function ClearProWelcomeQuery() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (
      !url.searchParams.has("welcome") &&
      !url.searchParams.has("session_id") &&
      !url.searchParams.has("pro_welcome") &&
      !url.searchParams.has("pro_pending")
    ) {
      return;
    }
    url.search = "";
    window.history.replaceState({}, "", url.pathname);
  }, []);

  return null;
}
