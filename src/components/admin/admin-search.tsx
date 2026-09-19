"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

export function AdminSearchBar({
  placeholder = "Search username, email…",
  param = "q",
}: {
  placeholder?: string;
  param?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(param) ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();
    if (trimmed) params.set(param, trimmed);
    else params.delete(param);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <form onSubmit={onSubmit} className="admin-v2-search">
      <Search className="admin-v2-search-icon" size={16} aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="admin-v2-search-input"
        aria-label="Search"
      />
      <button type="submit" className="admin-v2-search-btn">
        Search
      </button>
    </form>
  );
}
