/* ══════════════════════════════════════════════════════
   Polaroid Style — Canvas Render Engine
   ══════════════════════════════════════════════════════ */

import type { StyleConfig, StyleEngine } from "@/lib/types";
import { wrapText, timestamp } from "@/lib/utils";
import { TEMPLATES, THEMES, DEFAULTS, PALETTES, type PolaroidPalette } from "./config";

const W = 1200, H = 800;

// ── Seeded random ──
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// ── Helpers ──

function drawCorkboard(ctx: CanvasRenderingContext2D, pal: PolaroidPalette) {
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle texture noise
  const rng = seededRandom(42);
  ctx.save();
  for (let i = 0; i < 3000; i++) {
    const x = rng() * W;
    const y = rng() * H;
    ctx.fillStyle = pal.bg === "#1a1a1a" ? "#222" : "#e8e0d0";
    ctx.globalAlpha = rng() * 0.15;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  rotation: number,
  pal: PolaroidPalette,
  caption: string,
  photoContent: (ctx: CanvasRenderingContext2D, px: number, py: number, pw: number, ph: number) => void,
) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((rotation * Math.PI) / 180);

  const frameW = w;
  const frameH = h + 60; // Extra bottom for caption
  const fx = -frameW / 2;
  const fy = -frameH / 2;

  // Shadow
  ctx.shadowColor = pal.frameShadow;
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 5;

  // Frame
  ctx.fillStyle = pal.frame;
  ctx.fillRect(fx, fy, frameW, frameH);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Photo area (inset)
  const pad = 15;
  const photoX = fx + pad;
  const photoY = fy + pad;
  const photoW = frameW - pad * 2;
  const photoH = h - pad * 2;

  ctx.fillStyle = pal.photo;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Photo tint overlay
  ctx.fillStyle = pal.tint;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Render photo content
  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();
  photoContent(ctx, photoX, photoY, photoW, photoH);
  ctx.restore();

  // Vignette effect on photo
  const vigGrad = ctx.createRadialGradient(
    photoX + photoW / 2, photoY + photoH / 2, photoW * 0.3,
    photoX + photoW / 2, photoY + photoH / 2, photoW * 0.7,
  );
  vigGrad.addColorStop(0, "transparent");
  vigGrad.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = vigGrad;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Photo border
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // Caption area
  if (caption) {
    ctx.font = '400 16px "Caveat", cursive';
    ctx.fillStyle = pal.ink;
    ctx.textAlign = "center";
    ctx.fillText(caption, 0, fy + frameH - 22);
  }

  ctx.restore();
}

function drawCodePhoto(ctx: CanvasRenderingContext2D, px: number, py: number, pw: number, ph: number, pal: PolaroidPalette, text: string) {
  // Dark code editor background
  const isDark = pal.bg === "#1a1a1a";
  ctx.fillStyle = isDark ? "#1e1e2e" : "#282c34";
  ctx.fillRect(px, py, pw, ph);

  // Code lines
  ctx.font = '400 11px "JetBrains Mono", monospace';
  ctx.textAlign = "left";

  const lines = text ? text.split("\n") : [
    "const studio = new ContentStudio();",
    "studio.setTheme('vintage');",
    "",
    "const frame = studio.capture({",
    "  moment: 'this one',",
    "  filter: 'nostalgic',",
    "});",
    "",
    "await frame.develop();",
    "console.log('✨ Perfect shot');",
  ];

  const colors = ["#e06c75", "#98c379", "#d19a66", "#61afef", "#c678dd", "#56b6c2", "#abb2bf"];
  let ly = py + 24;
  for (let i = 0; i < Math.min(lines.length, 14); i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.85;
    ctx.fillText(lines[i], px + 16, ly);
    ly += 18;
  }
  ctx.globalAlpha = 1;
}

function drawGradientPhoto(ctx: CanvasRenderingContext2D, px: number, py: number, pw: number, ph: number, pal: PolaroidPalette) {
  const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
  grad.addColorStop(0, pal.accent + "cc");
  grad.addColorStop(0.5, pal.photo);
  grad.addColorStop(1, pal.ink + "44");
  ctx.fillStyle = grad;
  ctx.fillRect(px, py, pw, ph);

  // Abstract shapes
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = pal.frame;
  ctx.beginPath();
  ctx.arc(px + pw * 0.7, py + ph * 0.3, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + pw * 0.3, py + ph * 0.7, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawStatsPhoto(ctx: CanvasRenderingContext2D, px: number, py: number, pw: number, ph: number, pal: PolaroidPalette, lines: string[]) {
  ctx.fillStyle = pal.bg === "#1a1a1a" ? "#111" : "#f8f4ee";
  ctx.fillRect(px, py, pw, ph);

  ctx.font = '600 14px "Inter", sans-serif';
  ctx.fillStyle = pal.ink;
  ctx.textAlign = "center";
  ctx.fillText("PROGRESS SNAPSHOT", px + pw / 2, py + 30);

  const stats = lines.length > 0 ? lines : ["Day 42", "1,247 lines", "3 bugs fixed", "∞ to go"];
  let sy = py + 65;
  ctx.font = '400 18px "Caveat", cursive';
  for (const s of stats) {
    ctx.fillStyle = pal.accent;
    ctx.fillText(s, px + pw / 2, sy);
    sy += 30;
  }
}

function drawPin(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  // Pin body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.arc(x - 2, y - 2, 2, 0, Math.PI * 2);
  ctx.fill();
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.arc(x + 1, y + 8, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ═══ Templates ═══

function drawSingle(ctx: CanvasRenderingContext2D, pal: PolaroidPalette, headline: string, body: string, tag: string, brand: string) {
  drawCorkboard(ctx, pal);

  const frameW = 450;
  const frameH = 400;
  const fx = W / 2;
  const fy = H / 2 - 20;

  // Main polaroid
  drawPolaroidFrame(ctx, fx - frameW / 2, fy - frameH / 2, frameW, frameH, -2, pal, headline || "a moment captured", (ctx, px, py, pw, ph) => {
    drawCodePhoto(ctx, px, py, pw, ph, pal, body);
  });

  // Pin on main
  drawPin(ctx, fx - 10, fy - frameH / 2 - 20, pal.accent);

  // Small side photo (decorative)
  drawPolaroidFrame(ctx, 60, 100, 200, 180, 6, pal, "", (ctx, px, py, pw, ph) => {
    drawGradientPhoto(ctx, px, py, pw, ph, pal);
  });
  drawPin(ctx, 160, 90, "#e74c3c");

  // Small bottom-right
  drawPolaroidFrame(ctx, W - 320, H - 340, 220, 200, -4, pal, tag || "", (ctx, px, py, pw, ph) => {
    drawStatsPhoto(ctx, px, py, pw, ph, pal, body ? body.split("\n").filter(l => l.trim()) : []);
  });
  drawPin(ctx, W - 210, H - 350, "#27ae60");

  // Brand stamp
  ctx.font = '400 13px "Caveat", cursive';
  ctx.fillStyle = pal.dim;
  ctx.globalAlpha = 0.5;
  ctx.textAlign = "right";
  ctx.fillText(`@${brand}`, W - 50, H - 30);
  ctx.textAlign = "left";
  ctx.fillText(timestamp(), 50, H - 30);
  ctx.globalAlpha = 1;
}

function drawCollage(ctx: CanvasRenderingContext2D, pal: PolaroidPalette, headline: string, body: string, tag: string, brand: string) {
  drawCorkboard(ctx, pal);

  const rng = seededRandom(99);
  const positions = [
    { x: 80, y: 60, w: 260, h: 240, rot: -5 },
    { x: 420, y: 40, w: 280, h: 250, rot: 3 },
    { x: 780, y: 80, w: 250, h: 230, rot: -2 },
    { x: 160, y: 380, w: 270, h: 240, rot: 4 },
    { x: 520, y: 400, w: 260, h: 220, rot: -3 },
    { x: 850, y: 370, w: 240, h: 230, rot: 6 },
  ];

  const pinColors = ["#e74c3c", "#f39c12", "#27ae60", "#3498db", "#9b59b6", "#e67e22"];
  const bodyLines = body ? body.split("\n").filter(l => l.trim()) : [];

  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const caption = i === 0 && headline ? headline
      : i === positions.length - 1 && tag ? tag
      : bodyLines[i] || "";

    drawPolaroidFrame(ctx, p.x, p.y, p.w, p.h, p.rot, pal, caption, (ctx, px, py, pw, ph) => {
      if (i % 3 === 0) {
        drawCodePhoto(ctx, px, py, pw, ph, pal, "");
      } else if (i % 3 === 1) {
        drawGradientPhoto(ctx, px, py, pw, ph, pal);
      } else {
        drawStatsPhoto(ctx, px, py, pw, ph, pal, []);
      }
    });

    // Pin
    drawPin(ctx, p.x + p.w / 2 + (rng() - 0.5) * 40, p.y - 5, pinColors[i % pinColors.length]);
  }

  // Brand watermark
  ctx.font = '400 14px "Caveat", cursive';
  ctx.fillStyle = pal.dim;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "center";
  ctx.fillText(`${brand}  ·  ${timestamp()}`, W / 2, H - 20);
  ctx.globalAlpha = 1;
}

// ═══ Main Render ═══

function renderPolaroid(canvas: HTMLCanvasElement, config: StyleConfig): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  canvas.width = W;
  canvas.height = H;

  const pal = PALETTES[config.theme] || PALETTES.warm;
  const brand = (config.brand as string) || "sudo jajos";

  switch (config.template) {
    case "single":
      drawSingle(ctx, pal, config.headline, config.subtitle, config.tag, brand);
      break;
    case "collage":
    default:
      drawCollage(ctx, pal, config.headline, config.subtitle, config.tag, brand);
      break;
  }

  return { width: W, height: H };
}

export const polaroidEngine: StyleEngine = {
  templates: TEMPLATES,
  themes: THEMES,
  defaults: DEFAULTS,
  render: renderPolaroid,
};
