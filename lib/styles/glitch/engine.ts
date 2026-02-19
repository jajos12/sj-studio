/* ══════════════════════════════════════════════════════
   VHS / Glitch Style — Canvas Render Engine
   ══════════════════════════════════════════════════════ */

import type { StyleConfig, StyleEngine } from "@/lib/types";
import { wrapText, timestamp } from "@/lib/utils";
import { TEMPLATES, THEMES, DEFAULTS } from "./config";

const W = 1200, H = 800;

// ── Seeded PRNG (mulberry32) ──
// Produces deterministic random values from a seed,
// so glitch patterns stay stable when non-effect params change.

function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Effect Helpers ──

function drawScanlines(ctx: CanvasRenderingContext2D) {
  for (let y = 0; y < H; y += 2) {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, y, W, 1);
  }
}

function drawNoise(ctx: CanvasRenderingContext2D, amount: number, rng: () => number) {
  if (amount <= 0) return;
  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;
  const intensity = amount / 100;
  for (let i = 0; i < data.length; i += 16) {
    const noise = (rng() - 0.5) * 60 * intensity;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);
}

function drawRGBText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, split: number) {
  ctx.font = font;
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = "rgba(255,0,0,0.7)";
  ctx.fillText(text, x - split, y + split / 2);
  ctx.fillStyle = "rgba(0,255,0,0.7)";
  ctx.fillText(text, x, y);
  ctx.fillStyle = "rgba(0,100,255,0.7)";
  ctx.fillText(text, x + split, y - split / 2);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText(text, x, y);
}

function drawGlitchBars(ctx: CanvasRenderingContext2D, intensity: number, rng: () => number) {
  if (intensity <= 0) return;
  const count = Math.floor(intensity / 10);
  for (let i = 0; i < count; i++) {
    const rawY = rng() * H;
    const rawH = 1 + rng() * 10;
    const y = Math.max(0, Math.min(Math.floor(rawY), H - 2));
    const h = Math.max(1, Math.min(Math.floor(rawH), H - y));
    const shift = (rng() - 0.5) * intensity * 1;
    try {
      const strip = ctx.getImageData(0, y, W, h);
      ctx.fillStyle = "#08090d";
      ctx.fillRect(0, y, W, h);
      ctx.putImageData(strip, shift, y);
    } catch { /* skip strip if still out of bounds */ }
    ctx.fillStyle = rng() > 0.5 ? "rgba(255,0,0,0.15)" : "rgba(0,255,255,0.15)";
    ctx.fillRect(0, y, W, h);
  }
}

function drawTracking(ctx: CanvasRenderingContext2D, rng: () => number) {
  for (let i = 0; i < 3; i++) {
    const y = rng() * H;
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(0, y, W, 30 + rng() * 50);
  }
}

function drawVHSChrome(ctx: CanvasRenderingContext2D, brand: string) {
  ctx.font = '700 16px "JetBrains Mono"';
  ctx.fillStyle = "#ff0000";
  ctx.textAlign = "left";
  ctx.fillText("● REC", 40, 40);

  ctx.font = '400 14px "JetBrains Mono"';
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.textAlign = "right";
  ctx.fillText(timestamp(), W - 40, 40);
  ctx.fillText("▶ PLAY", W - 40, H - 30);

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText(`CH: ${brand}`, 40, H - 30);
}

// ═══ Templates ═══

function drawHotTake(ctx: CanvasRenderingContext2D, headline: string, body: string, tag: string, split: number) {
  const cx = W / 2;

  ctx.font = "70px Inter";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,68,68,0.15)";
  ctx.fillText("⚠", cx, 225);

  if (headline) {
    ctx.textAlign = "center";
    const hLines = wrapText(headline.toUpperCase(), 20);
    let y = 325;
    for (const hl of hLines) {
      drawRGBText(ctx, hl, cx, y, "900 50px Inter", split);
      y += 60;
    }
  }

  if (body) {
    ctx.font = '400 16px "JetBrains Mono"';
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "center";
    const bLines = wrapText(body, 50);
    let y = 475;
    for (const bl of bLines) { ctx.fillText(bl, cx, y); y += 22; }
  }

  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([10, 5]);
  ctx.beginPath(); ctx.moveTo(200, 550); ctx.lineTo(W - 200, 550); ctx.stroke();
  ctx.setLineDash([]);

  if (tag) {
    ctx.font = "600 15px Inter";
    ctx.fillStyle = "#ff4444";
    ctx.textAlign = "center";
    ctx.fillText(tag, cx, 590);
  }
}

function drawWarning(ctx: CanvasRenderingContext2D, headline: string, body: string, tag: string, split: number) {
  const cx = W / 2;

  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 3;
  ctx.setLineDash([15, 8]);
  ctx.strokeRect(60, 100, W - 120, H - 200);
  ctx.setLineDash([]);

  ctx.fillStyle = "#ff4444";
  ctx.fillRect(60, 100, W - 120, 50);
  ctx.font = '900 24px "JetBrains Mono"';
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.fillText("⚠ CRITICAL ALERT ⚠", cx, 135);

  if (headline) {
    ctx.textAlign = "center";
    const hLines = wrapText(headline.toUpperCase(), 22);
    let y = 275;
    for (const hl of hLines) {
      drawRGBText(ctx, hl, cx, y, "900 44px Inter", split);
      y += 55;
    }
  }

  if (body) {
    ctx.font = "400 15px Inter";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "center";
    const bLines = wrapText(body, 50);
    let y = 450;
    for (const bl of bLines) { ctx.fillText(bl, cx, y); y += 22; }
  }

  if (tag) {
    ctx.font = "600 14px Inter";
    ctx.fillStyle = "#ff4444";
    ctx.textAlign = "center";
    ctx.fillText(tag, cx, H - 130);
  }
}

function drawVersus(ctx: CanvasRenderingContext2D, headline: string, body: string, tag: string, split: number) {
  const cx = W / 2;

  ctx.fillStyle = "rgba(0,229,255,0.04)";
  ctx.fillRect(0, 0, W / 2, H);
  ctx.fillStyle = "rgba(255,68,68,0.04)";
  ctx.fillRect(W / 2, 0, W / 2, H);

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, 75); ctx.lineTo(cx, H - 75); ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, H / 2, 40, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1a24";
  ctx.fill();
  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 2;
  ctx.stroke();
  drawRGBText(ctx, "VS", cx, H / 2 + 10, "900 32px Inter", split);

  if (headline) {
    ctx.textAlign = "center";
    drawRGBText(ctx, headline.toUpperCase(), cx, 100, "800 28px Inter", split);
  }

  const parts = (body || "Left\nRight").split("\n");
  const left = parts[0] || "";
  const right = parts[1] || "";

  ctx.font = "700 36px Inter";
  ctx.fillStyle = "#00e5ff";
  ctx.textAlign = "center";
  ctx.shadowColor = "#00e5ff44";
  ctx.shadowBlur = 10;
  const lLines = wrapText(left.toUpperCase(), 12);
  let ly = H / 2 - 20 * lLines.length / 2;
  for (const l of lLines) { ctx.fillText(l, W * 0.25, ly); ly += 45; }

  ctx.fillStyle = "#ff4444";
  ctx.shadowColor = "#ff444444";
  const rLines = wrapText(right.toUpperCase(), 12);
  let ry = H / 2 - 20 * rLines.length / 2;
  for (const r of rLines) { ctx.fillText(r, W * 0.75, ry); ry += 45; }
  ctx.shadowBlur = 0;

  if (tag) {
    ctx.font = "600 14px Inter";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "center";
    ctx.fillText(tag, cx, H - 90);
  }
}

// ═══ Main Render ═══

function renderGlitch(canvas: HTMLCanvasElement, config: StyleConfig): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  canvas.width = W;
  canvas.height = H;

  // Seed the PRNG from effect values only —
  // glitch pattern stays stable when text/template/tag change
  const glitch = (config.glitch as number) ?? 50;
  const noise = (config.noise as number) ?? 30;
  const split = (config.rgbsplit as number) ?? 8;
  const brand = (config.brand as string) || "sudo jajos";
  const seed = glitch * 10000 + noise * 100 + split;
  const rng = createRng(seed);

  ctx.fillStyle = "#08090d";
  ctx.fillRect(0, 0, W, H);

  const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5);
  bg.addColorStop(0, "#12141e");
  bg.addColorStop(1, "#08090d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawTracking(ctx, rng);

  switch (config.template) {
    case "hottake":
      drawHotTake(ctx, config.headline, config.subtitle, config.tag, split);
      break;
    case "warning":
      drawWarning(ctx, config.headline, config.subtitle, config.tag, split);
      break;
    case "versus":
    default:
      drawVersus(ctx, config.headline, config.subtitle, config.tag, split);
      break;
  }

  drawScanlines(ctx);
  drawGlitchBars(ctx, glitch, rng);
  drawNoise(ctx, noise, rng);
  drawVHSChrome(ctx, brand);

  return { width: W, height: H };
}

export const glitchEngine: StyleEngine = {
  templates: TEMPLATES,
  themes: THEMES,
  defaults: DEFAULTS,
  render: renderGlitch,
};
