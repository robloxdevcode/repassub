"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Command } from "lucide-react";
import { downloadCsv } from "@/lib/admin-csv-export";

type CmdItem = {
  id: string;
  label: string;
  hint?: string;
  href: string;
};

export function AdminCommandMenu({
  navLinks,
}: {
  navLinks: { href: string; label: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items: CmdItem[] = useMemo(
    () => [
      ...navLinks.map((l) => ({ id: l.href, label: l.label, href: l.href })),
      { id: "dash", label: "Back to dashboard", hint: "Exit admin", href: "/dashboard" },
      { id: "home", label: "Marketing home", href: "/" },
    ],
    [navLinks]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setActive(0);
      }
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[active]) {
        e.preventDefault();
        go(filtered[active].href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, go]);

  return (
    <>
      <button
        type="button"
        className="admin-v2-toolbar-btn"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Command size={14} aria-hidden />
        Command
        <span className="admin-v2-kbd">Ctrl K</span>
      </button>

      {open ? (
        <div
          className="admin-cmd-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Admin command menu"
          onClick={() => setOpen(false)}
        >
          <div className="admin-cmd-panel" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              className="admin-cmd-input"
              placeholder="Jump to a page…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
            />
            <div className="admin-cmd-list" role="listbox">
              {filtered.length === 0 ? (
                <p className="admin-v2-empty text-sm py-6">No matches.</p>
              ) : (
                filtered.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    className={`admin-cmd-item ${index === active ? "admin-cmd-item--active" : ""}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item.href)}
                  >
                    <span>{item.label}</span>
                    {item.hint ? <span className="admin-v2-muted text-xs">{item.hint}</span> : null}
                  </button>
                ))
              )}
            </div>
            <p className="admin-cmd-foot">↑↓ navigate · Enter open · Esc close</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function AdminExportButton({
  filename,
  headers,
  rows,
  label = "Export CSV",
}: {
  filename: string;
  headers: string[];
  rows: string[][];
  label?: string;
}) {
  return (
    <button
      type="button"
      className="admin-v2-toolbar-btn admin-v2-toolbar-btn--primary"
      onClick={() => downloadCsv(filename, [headers, ...rows])}
    >
      <Download size={14} aria-hidden />
      {label}
    </button>
  );
}
