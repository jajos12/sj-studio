/* ══════════════════════════════════════════════════════
   Glassmorphism Style — Canvas Render Engine
   ══════════════════════════════════════════════════════ */

import type { StyleConfig, StyleEngine } from "@/lib/types";
import { wrapText, timestamp } from "@/lib/utils";
import { TEMPLATES, THEMES, DEFAULTS, PALETTES } from "./config";

const W = 1200, H = 800;

// ── Helpers ──

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawGlass(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r = 12, alpha = 0.06) {
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawBackground(ctx: CanvasRenderingContext2D, c1: string, c2: string) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#08090d");
  bg.addColorStop(1, "#0c0e16");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const blobs = [
    { x: W * 0.2, y: H * 0.3, r: 250, c: c1 },
    { x: W * 0.8, y: H * 0.6, r: 300, c: c2 },
    { x: W * 0.5, y: H * 0.8, r: 200, c: c1 },
    { x: W * 0.7, y: H * 0.15, r: 175, c: c2 },
  ];
  for (const b of blobs) {
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    grad.addColorStop(0, b.c + "18");
    grad.addColorStop(0.5, b.c + "08");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  ctx.fillStyle = "rgba(255,255,255,0.015)";
  for (let x = 0; x < W; x += 20) {
    for (let y = 0; y < H; y += 20) {
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawFooter(ctx: CanvasRenderingContext2D, c1: string, tag: string, brand: string) {
  const y = H - 40;
  if (tag) {
    ctx.font = '500 13px Inter';
    ctx.fillStyle = c1;
    ctx.textAlign = "center";
    ctx.fillText(tag, W / 2, y);
  }
  ctx.font = '400 11px "JetBrains Mono"';
  ctx.fillStyle = "#4b5060";
  ctx.textAlign = "center";
  ctx.fillText(`${timestamp()}  ·  @${brand}`, W / 2, y + 20);
}

// ═══ Templates ═══

function drawUpdate(ctx: CanvasRenderingContext2D, c1: string, c2: string, headline: string, body: string, tag: string, brand: string) {
  drawGlass(ctx, 30, 25, W - 60, 40, 10, 0.04);
  ctx.font = "600 14px Inter";
  ctx.fillStyle = c1;
  ctx.textAlign = "left";
  ctx.fillText(`⬡ ${brand}`, 50, 51);
  ctx.font = '400 12px "JetBrains Mono"';
  ctx.fillStyle = "#6b7280";
  ctx.textAlign = "right";
  ctx.fillText("build log", W - 50, 51);

  drawGlass(ctx, 50, 100, W - 100, H - 180, 16, 0.07);

  roundRect(ctx, 50, 100, W - 100, 3, 1.5);
  const accentGrad = ctx.createLinearGradient(50, 0, W - 50, 0);
  accentGrad.addColorStop(0, c1);
  accentGrad.addColorStop(1, c2);
  ctx.fillStyle = accentGrad;
  ctx.fill();

  ctx.font = "32px Inter";
  ctx.textAlign = "left";
  ctx.fillText("🛠️", 80, 165);

  if (headline) {
    ctx.font = "800 28px Inter";
    ctx.fillStyle = "#e8eaf0";
    ctx.textAlign = "left";
    const hLines = wrapText(headline, 30);
    let y = 165;
    for (const hl of hLines) { ctx.fillText(hl, 130, y); y += 34; }
  }

  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 200); ctx.lineTo(W - 130, 200); ctx.stroke();

  if (body) {
    ctx.font = "400 15px Inter";
    ctx.fillStyle = "#8b91a0";
    ctx.textAlign = "left";
    const bLines = wrapText(body, 55);
    let y = 230;
    for (const bl of bLines) { ctx.fillText(bl, 80, y); y += 22; }
  }

  const pillY = H - 150;
  const pills = [
    { icon: "🟢", text: "In Progress" },
    { icon: "📦", text: "v0.1-alpha" },
    { icon: "⚡", text: "Updated today" },
  ];
  let px = 80;
  for (const p of pills) {
    const tw = ctx.measureText(p.text).width + 40;
    drawGlass(ctx, px, pillY, tw + 10, 28, 14, 0.08);
    ctx.font = "12px Inter";
    ctx.fillStyle = "#e8eaf0";
    ctx.textAlign = "left";
    ctx.fillText(`${p.icon}  ${p.text}`, px + 10, pillY + 19);
    px += tw + 18;
  }

  drawFooter(ctx, c1, tag, brand);
}

function drawStats(ctx: CanvasRenderingContext2D, c1: string, c2: string, headline: string, body: string, tag: string, brand: string) {
  drawGlass(ctx, 30, 25, W - 60, 40, 10, 0.04);
  ctx.font = "600 14px Inter";
  ctx.fillStyle = c1;
  ctx.textAlign = "left";
  ctx.fillText(`⬡ ${brand}`, 50, 51);
  ctx.font = "700 14px Inter";
  ctx.fillStyle = "#e8eaf0";
  ctx.textAlign = "center";
  ctx.fillText(headline || "Progress Report", W / 2, 51);
  ctx.font = '400 12px "JetBrains Mono"';
  ctx.fillStyle = "#6b7280";
  ctx.textAlign = "right";
  ctx.fillText(timestamp().slice(0, 10), W - 50, 51);

  const stats = [
    { label: "Days Coding", value: "23", icon: "🔥", color: c1 },
    { label: "Commits", value: "147", icon: "📦", color: c2 },
    { label: "Labs Built", value: "4", icon: "🧪", color: c1 },
    { label: "Lines of Code", value: "12.4K", icon: "💻", color: c2 },
  ];
  const gapX = 20, gapY = 20;
  const cardW = (W - 100 - gapX) / 2;
  const cardH = 140;
  const startY = 100;

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 50 + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    const s = stats[i];

    drawGlass(ctx, x, y, cardW, cardH, 12, 0.06);
    ctx.font = "24px Inter";
    ctx.textAlign = "left";
    ctx.fillText(s.icon, x + 20, y + 35);
    ctx.font = "500 12px Inter";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(s.label.toUpperCase(), x + 20, y + 60);
    ctx.font = "900 40px Inter";
    ctx.fillStyle = s.color;
    ctx.shadowColor = s.color + "44";
    ctx.shadowBlur = 10;
    ctx.fillText(s.value, x + 20, y + 114);
    ctx.shadowBlur = 0;
  }

  if (body) {
    drawGlass(ctx, 50, startY + 2 * (cardH + gapY) + 10, W - 100, 60, 10, 0.04);
    ctx.font = "400 14px Inter";
    ctx.fillStyle = "#8b91a0";
    ctx.textAlign = "center";
    ctx.fillText(body || "", W / 2, startY + 2 * (cardH + gapY) + 45);
  }

  drawFooter(ctx, c1, tag, brand);
}

function drawStack(ctx: CanvasRenderingContext2D, c1: string, c2: string, headline: string, body: string, tag: string, brand: string) {
  drawGlass(ctx, 30, 25, W - 60, 40, 10, 0.04);
  ctx.font = "600 14px Inter";
  ctx.fillStyle = c1;
  ctx.textAlign = "left";
  ctx.fillText(`⬡ ${brand}`, 50, 51);

  ctx.font = "800 26px Inter";
  ctx.fillStyle = "#e8eaf0";
  ctx.textAlign = "center";
  ctx.fillText(headline || "My Tech Stack", W / 2, 125);

  const stackItems = [
    { name: "Python", icon: "🐍", cat: "Language" },
    { name: "PyTorch", icon: "🔥", cat: "ML Framework" },
    { name: "Next.js", icon: "▲", cat: "Frontend" },
    { name: "FastAPI", icon: "⚡", cat: "Backend" },
    { name: "Docker", icon: "🐳", cat: "DevOps" },
    { name: "PostgreSQL", icon: "🐘", cat: "Database" },
    { name: "Redis", icon: "🔴", cat: "Cache" },
    { name: "W&B", icon: "📊", cat: "MLOps" },
  ];

  const cols = 4, gapX = 15, gapY = 15;
  const itemW = (W - 100 - (cols - 1) * gapX) / cols;
  const itemH = 100;
  const startY = 165;

  for (let i = 0; i < stackItems.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 50 + col * (itemW + gapX);
    const y = startY + row * (itemH + gapY);
    const item = stackItems[i];

    drawGlass(ctx, x, y, itemW, itemH, 10, 0.06);
    ctx.font = "22px Inter";
    ctx.textAlign = "center";
    ctx.fillText(item.icon, x + itemW / 2, y + 35);
    ctx.font = "600 14px Inter";
    ctx.fillStyle = "#e8eaf0";
    ctx.fillText(item.name, x + itemW / 2, y + 60);
    ctx.font = "400 10px Inter";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(item.cat, x + itemW / 2, y + 78);
  }

  if (body) {
    ctx.font = "400 14px Inter";
    ctx.fillStyle = "#8b91a0";
    ctx.textAlign = "center";
    const by = startY + 2 * (itemH + gapY) + 20;
    const bLines = wrapText(body, 60);
    for (let i = 0; i < bLines.length; i++) {
      ctx.fillText(bLines[i], W / 2, by + i * 20);
    }
  }

  drawFooter(ctx, c1, tag, brand);
}

// ═══ Main Render ═══

function renderGlass(canvas: HTMLCanvasElement, config: StyleConfig): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  canvas.width = W;
  canvas.height = H;

  const pal = PALETTES[config.theme] || PALETTES.cyber;
  drawBackground(ctx, pal.c1, pal.c2);

  const brand = (config.brand as string) || "sudo jajos";

  switch (config.template) {
    case "update":
      drawUpdate(ctx, pal.c1, pal.c2, config.headline, config.subtitle, config.tag, brand);
      break;
    case "stats":
      drawStats(ctx, pal.c1, pal.c2, config.headline, config.subtitle, config.tag, brand);
      break;
    case "stack":
    default:
      drawStack(ctx, pal.c1, pal.c2, config.headline, config.subtitle, config.tag, brand);
      break;
  }

  return { width: W, height: H };
}

export const glassEngine: StyleEngine = {
  templates: TEMPLATES,
  themes: THEMES,
  defaults: DEFAULTS,
  render: renderGlass,
};
