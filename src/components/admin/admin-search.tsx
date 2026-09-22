"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Search } from "lucide-react";

export function AdminSearchBar({
  placeholder = "Search username, email…",
  param = "q",
  instant = true,
}: {
  placeholder?: string;
  param?: string;
  instant?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(param) ?? "");
  const [pending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pushQuery(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = next.trim();
    if (trimmed) params.set(param, trimmed);
    else params.delete(param);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  useEffect(() => {
    if (!instant) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const current = searchParams.get(param) ?? "";
      if (value === current) return;
      pushQuery(value);
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync URL when typing
  }, [value, instant]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    pushQuery(value);
  }

  return (
    <form onSubmit={onSubmit} className="admin-v2-search" data-pending={pending || undefined}>
      <Search className="admin-v2-search-icon" size={16} aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="admin-v2-search-input"
        aria-label="Search"
        autoComplete="off"
      />
      <button type="submit" className="admin-v2-search-btn">
        {pending ? "…" : "Go"}
      </button>
      {value ? (
        <button
          type="button"
          className="admin-v2-search-clear"
          onClick={() => setValue("")}
          aria-label="Clear search"
        >
          Clear
        </button>
      ) : null}
    </form>
  );
}
