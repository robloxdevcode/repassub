"use client";

export function RetroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="unlock-backdrop-stage absolute inset-0" />
      <div className="unlock-backdrop-grid absolute inset-0" />
    </div>
  );
}
