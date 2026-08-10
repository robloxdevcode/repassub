"use client";

export function LiveFeed({ items }: { items: string[] }) {
  const feed = items.length > 0 ? items : ["Linklock unlock links — live stats from real creators"];
  const row = [...feed, ...feed];

  return (
    <section className="home-live-feed border-b-[3px] border-retro-ink overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-retro-ink/20 max-w-6xl mx-auto">
        <span className="live-pill">LIVE</span>
        <p className="font-display text-[7px] text-retro-yellow tracking-widest">RECENT UNLOCKS</p>
      </div>
      <div className="marquee-wrap py-3">
        <div className="live-feed-track">
          {row.map((text, i) => (
            <span key={i} className="live-feed-item">
              <span className="text-retro-accent mr-2">◆</span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
