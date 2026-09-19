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
    <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-2">
      <div className="relative flex flex-1 items-center">
        <Search className="absolute left-3 text-stone-400" size={16} aria-hidden />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full rounded-xl border-2 border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          aria-label="Search"
        />
      </div>
      <button
        type="submit"
        className="min-h-11 shrink-0 rounded-xl border-2 border-orange-600 bg-gradient-to-br from-orange-500 to-orange-600 px-4 text-sm font-bold text-white shadow-md shadow-orange-500/30 hover:brightness-105"
      >
        Search
      </button>
    </form>
  );
}
