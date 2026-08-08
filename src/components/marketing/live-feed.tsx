"use client";

const EVENTS = [
  "@maya unlocked a preset pack",
  "@djflux joined via Discord task",
  "@studio_k hit 500 subs today",
  "@ronix shared an unlock link",
  "@velo got 12 new followers",
  "@alex creator unlocked sample pack",
  "New unlock in Tokyo · 2s ago",
  "847 unlocks in the last hour",
];

export function LiveFeed() {
  const items = [...EVENTS, ...EVENTS];

  return (
    <div className="border-y-4 border-black bg-retro-surface-2 overflow-hidden py-3">
      <div className="live-feed-track">
        {items.map((text, i) => (
          <span key={i} className="live-feed-item font-body text-xs text-retro-text-dim shrink-0">
            <span className="text-retro-accent mr-2">▸</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
