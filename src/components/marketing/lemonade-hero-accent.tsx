"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "one unlock at a time",
  "into real followers",
  "without the hassle",
  "on every platform",
];

export function LemonadeHeroAccent() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="llv2-title-accent llv2-title-accent--cycle" key={index}>
      {PHRASES[index]}
    </span>
  );
}
