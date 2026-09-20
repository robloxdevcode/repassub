"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RetroButton } from "@/components/retro";

const GRID = 16;
const TICK_MS = 120;

type Point = { x: number; y: number };

function randFood(snake: Point[]): Point {
  for (let i = 0; i < 40; i++) {
    const p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
  return { x: 0, y: 0 };
}

export function NotFoundSnakeGame() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState<Point[]>([{ x: 8, y: 8 }]);
  const [food, setFood] = useState<Point>({ x: 4, y: 4 });
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>(food);
  foodRef.current = food;
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reset = useCallback(() => {
    const start = [{ x: 8, y: 8 }];
    setSnake(start);
    setFood(randFood(start));
    setScore(0);
    dirRef.current = { x: 1, y: 0 };
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;

    const id = window.setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const next = {
          x: (head.x + dirRef.current.x + GRID) % GRID,
          y: (head.y + dirRef.current.y + GRID) % GRID,
        };
        if (prev.some((s) => s.x === next.x && s.y === next.y)) {
          window.setTimeout(() => {
            setPlaying(false);
            reset();
          }, 0);
          return prev;
        }
        const ate = next.x === foodRef.current.x && next.y === foodRef.current.y;
        const body = [next, ...prev];
        if (!ate) body.pop();
        else {
          setScore((s) => s + 1);
          const nextFood = randFood(body);
          foodRef.current = nextFood;
          setFood(nextFood);
        }
        return body;
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [playing, reset, reducedMotion]);

  useEffect(() => {
    if (!playing) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPlaying(false);
        reset();
        return;
      }
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d.y !== 1) dirRef.current = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && d.y !== -1) dirRef.current = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && d.x !== 1) dirRef.current = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && d.x !== -1) dirRef.current = { x: 1, y: 0 };
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, reset]);

  function startGame() {
    if (reducedMotion) return;
    reset();
    setPlaying(true);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-retro-bg">
      <div className="text-center max-w-md w-full">
        <button
          type="button"
          onClick={startGame}
          disabled={reducedMotion}
          className="font-display text-6xl font-bold text-retro-accent hover:text-retro-neon transition-colors ui-instant disabled:opacity-60"
          aria-label="404 — click to play snake"
        >
          404
        </button>
        <h1 className="font-display text-xl font-bold mt-4 text-retro-text">Page not found</h1>
        <p className="text-retro-text-dim mt-2 text-sm">
          {reducedMotion
            ? "This page does not exist."
            : playing
              ? `Snake — score ${score}. Arrow keys · Esc to quit`
              : "Click 404 for a quick snake game, or head home."}
        </p>

        {playing && !reducedMotion ? (
          <div
            className="mx-auto mt-6 grid gap-px bg-retro-border border border-retro-border rounded-lg overflow-hidden"
            style={{
              width: GRID * 14,
              height: GRID * 14,
              gridTemplateColumns: `repeat(${GRID}, 1fr)`,
            }}
            role="img"
            aria-label="Snake minigame board"
          >
            {Array.from({ length: GRID * GRID }, (_, i) => {
              const x = i % GRID;
              const y = Math.floor(i / GRID);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;
              let bg = "bg-retro-surface";
              if (isFood) bg = "bg-retro-accent";
              else if (isHead) bg = "bg-white";
              else if (isBody) bg = "bg-retro-surface-3";
              return <div key={i} className={`${bg} min-h-0 min-w-0`} />;
            })}
          </div>
        ) : null}

        <Link href="/" className="inline-block mt-8">
          <RetroButton>Back to home</RetroButton>
        </Link>
      </div>
    </div>
  );
}
