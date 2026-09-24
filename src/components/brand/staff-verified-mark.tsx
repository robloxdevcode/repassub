/** Inline verified mark for Linklock staff — no emoji, no external icon font. */
export function StaffVerifiedMark({ className = "", title = "Verified Linklock staff" }: { className?: string; title?: string }) {
  return (
    <span
      className={`staff-verified-mark inline-flex shrink-0 items-center justify-center ${className}`}
      title={title}
      aria-label={title}
      role="img"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="9" cy="9" r="8" fill="currentColor" />
        <path
          d="M5.5 9.2 7.8 11.5 12.5 6.8"
          stroke="#fff"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function StaffRoleBadge({ label }: { label: string }) {
  return (
    <span className="profile-badge profile-badge--staff inline-flex items-center gap-1.5">
      <StaffVerifiedMark className="h-4 w-4" />
      <span>{label}</span>
    </span>
  );
}
