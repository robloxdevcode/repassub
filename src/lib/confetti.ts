export function burstConfetti(origin?: { x: number; y: number }) {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const ox = origin?.x ?? canvas.width / 2;
  const oy = origin?.y ?? canvas.height / 2;
  const colors = ["#6366f1", "#818cf8", "#c4b5fd", "#22c55e", "#fbbf24", "#ffffff"];

  const particles = Array.from({ length: 120 }, () => ({
    x: ox,
    y: oy,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 1.2) * 14,
    color: colors[Math.floor(Math.random() * colors.length)]!,
    w: Math.random() * 7 + 4,
    h: Math.random() * 4 + 3,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    life: 1,
  }));

  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.rot += p.vr;
      p.life -= 0.014;
      if (p.life <= 0) continue;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    frame += 1;
    if (frame < 110) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(animate);
}
