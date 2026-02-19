/* ══════════════════════════════════════════════════════
   Gradient Typography Style — Canvas Render Engine
   ══════════════════════════════════════════════════════ */

import type { StyleConfig, StyleEngine } from "@/lib/types";
import { wrapText, timestamp } from "@/lib/utils";
import { TEMPLATES, THEMES, DEFAULTS, GRADIENTS } from "./config";

const W = 1200, H = 800;

// ── Helpers ──

function makeGradient(ctx: CanvasRenderingContext2D, colors: string[], x1: number, y1: number, x2: number, y2: number) {
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  for (let i = 0; i < colors.length; i++) {
    g.addColorStop(i / (colors.length - 1), colors[i]);
  }
  return g;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBackground(ctx: CanvasRenderingContext2D, colors: string[]) {
  ctx.fillStyle = "#06070a";
  ctx.fillRect(0, 0, W, H);

  const orbs = [
    { x: W * 0.15, y: H * 0.3, r: 350, c: colors[0] },
    { x: W * 0.85, y: H * 0.7, r: 400, c: colors[2] || colors[1] },
    { x: W * 0.5, y: H * 0.1, r: 250, c: colors[1] },
  ];
  for (const o of orbs) {
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0, o.c + "12");
    g.addColorStop(0.6, o.c + "06");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  ctx.fillStyle = "rgba(255,255,255,0.008)";
  for (let x = 0; x < W; x += 15) {
    for (let y = 0; y < H; y += 15) {
      ctx.beginPath();
      ctx.arc(x, y, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ═══ Templates ═══

function drawQuote(ctx: CanvasRenderingContext2D, colors: string[], fontFamily: string, headline: string, body: string, tag: string, brand: string) {
  const cx = W / 2;

  ctx.font = `300 250px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.015)";
  ctx.textAlign = "left";
  ctx.fillText('"', 50, 300);
  ctx.textAlign = "right";
  ctx.fillText('"', W - 50, H - 100);

  ctx.font = '500 13px "JetBrains Mono"';
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.textAlign = "center";
  ctx.fillText(brand, cx, 60);

  const lineGrad = makeGradient(ctx, colors, cx - 50, 0, cx + 50, 0);
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx - 30, 73); ctx.lineTo(cx + 30, 73); ctx.stroke();

  if (headline) {
    const hLines = wrapText(headline, 28);
    const fontSize = hLines.length > 2 ? 40 : 50;
    const lineH = fontSize * 1.25;
    const totalH = hLines.length * lineH;
    let y = (H - totalH) / 2 + fontSize;

    ctx.font = `800 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";

    const gradTop = y - fontSize;
    const gradBottom = y + (hLines.length - 1) * lineH;
    ctx.fillStyle = makeGradient(ctx, colors, 0, gradTop, 0, gradBottom);
    ctx.shadowColor = colors[0] + "22";
    ctx.shadowBlur = 20;

    for (const hl of hLines) { ctx.fillText(hl, cx, y); y += lineH; }
    ctx.shadowBlur = 0;
  }

  if (body) {
    ctx.font = `400 14px ${fontFamily}`;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "center";
    ctx.fillText(`— ${body}`, cx, H - 125);
  }

  if (tag) {
    ctx.font = '500 12px "JetBrains Mono"';
    ctx.fillStyle = colors[0] + "88";
    ctx.textAlign = "center";
    ctx.fillText(tag, cx, H - 70);
  }

  ctx.font = '400 10px "JetBrains Mono"';
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.textAlign = "center";
  ctx.fillText(`${timestamp()}  ·  @${brand}`, cx, H - 40);
}

function drawAnnounce(ctx: CanvasRenderingContext2D, colors: string[], fontFamily: string, headline: string, body: string, tag: string, brand: string) {
  const cx = W / 2;

  ctx.fillStyle = makeGradient(ctx, colors, 0, 0, W, 0);
  ctx.fillRect(0, 0, W, 4);

  ctx.font = '600 14px "JetBrains Mono"';
  ctx.fillStyle = colors[0];
  ctx.textAlign = "left";
  ctx.fillText(`⬡ ${brand}`, 60, 55);

  const badgeGrad = makeGradient(ctx, colors, 0, 0, 100, 0);
  roundRect(ctx, W - 175, 38, 100, 25, 13);
  ctx.fillStyle = badgeGrad;
  ctx.fill();
  ctx.font = "700 11px Inter";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.fillText("NEW POST", W - 125, 54);

  ctx.strokeStyle = makeGradient(ctx, colors, 100, 0, W - 100, 0);
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(60, 90); ctx.lineTo(W - 60, 90); ctx.stroke();

  if (headline) {
    const hLines = wrapText(headline.toUpperCase(), 20);
    const fontSize = hLines.length > 2 ? 45 : 55;
    const lineH = fontSize * 1.15;
    let y = 225;

    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.fillStyle = makeGradient(ctx, colors, 0, y - fontSize, 0, y + (hLines.length - 1) * lineH);
    ctx.shadowColor = colors[0] + "33";
    ctx.shadowBlur = 15;

    for (const hl of hLines) { ctx.fillText(hl, cx, y); y += lineH; }
    ctx.shadowBlur = 0;
  }

  if (body) {
    ctx.font = `400 16px ${fontFamily}`;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "center";
    const bLines = wrapText(body, 50);
    let y = 450;
    for (const bl of bLines) { ctx.fillText(bl, cx, y); y += 23; }
  }

  ctx.fillStyle = makeGradient(ctx, colors, 0, 0, W, 0);
  ctx.fillRect(0, H - 4, W, 4);

  if (tag) {
    ctx.font = '500 13px "JetBrains Mono"';
    ctx.fillStyle = colors[1] + "88";
    ctx.textAlign = "center";
    ctx.fillText(tag, cx, H - 60);
  }
  ctx.font = '400 10px "JetBrains Mono"';
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.textAlign = "center";
  ctx.fillText(`${timestamp()}  ·  @${brand}`, cx, H - 30);
}

function drawLabel(ctx: CanvasRenderingContext2D, colors: string[], fontFamily: string, headline: string, body: string, tag: string, brand: string) {
  const cx = W / 2;

  if (headline) {
    const word = headline.toUpperCase();
    let fontSize = 130;
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    while (ctx.measureText(word).width > W - 150 && fontSize > 30) {
      fontSize -= 5;
      ctx.font = `900 ${fontSize}px ${fontFamily}`;
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.font = `900 ${fontSize * 1.8}px ${fontFamily}`;
    ctx.fillText(word, cx, H / 2);

    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = makeGradient(ctx, colors, 0, H / 2 - fontSize / 2, 0, H / 2 + fontSize / 2);
    ctx.shadowColor = colors[0] + "33";
    ctx.shadowBlur = 20;
    ctx.fillText(word, cx, H / 2);
    ctx.shadowBlur = 0;
    ctx.textBaseline = "alphabetic";
  }

  if (body) {
    ctx.font = `400 16px ${fontFamily}`;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "center";
    ctx.fillText(body, cx, H / 2 + 80);
  }

  ctx.font = '500 12px "JetBrains Mono"';
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.textAlign = "center";
  ctx.fillText(brand, cx, 50);

  ctx.beginPath();
  ctx.arc(cx, 65, 2, 0, Math.PI * 2);
  ctx.fillStyle = colors[0];
  ctx.fill();

  if (tag) {
    ctx.font = '500 12px "JetBrains Mono"';
    ctx.fillStyle = colors[0] + "66";
    ctx.textAlign = "center";
    ctx.fillText(tag, cx, H - 60);
  }
  ctx.font = '400 10px "JetBrains Mono"';
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.textAlign = "center";
  ctx.fillText(`${timestamp()}  ·  @${brand}`, cx, H - 35);
}

// ═══ Main Render ═══

function renderGradient(canvas: HTMLCanvasElement, config: StyleConfig): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  canvas.width = W;
  canvas.height = H;

  const colors = GRADIENTS[config.theme] || GRADIENTS.aurora;
  const fontFamily = (config.fontFamily as string) || "Outfit";
  const brand = (config.brand as string) || "sudo jajos";

  drawBackground(ctx, colors);

  switch (config.template) {
    case "quote":
      drawQuote(ctx, colors, fontFamily, config.headline, config.subtitle, config.tag, brand);
      break;
    case "announce":
      drawAnnounce(ctx, colors, fontFamily, config.headline, config.subtitle, config.tag, brand);
      break;
    case "label":
    default:
      drawLabel(ctx, colors, fontFamily, config.headline, config.subtitle, config.tag, brand);
      break;
  }

  return { width: W, height: H };
}

export const gradientEngine: StyleEngine = {
  templates: TEMPLATES,
  themes: THEMES,
  defaults: DEFAULTS,
  render: renderGradient,
};
