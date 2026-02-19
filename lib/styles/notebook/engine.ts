/* ══════════════════════════════════════════════════════
   Notebook Style — Canvas Render Engine
   ══════════════════════════════════════════════════════ */

import type { StyleConfig, StyleEngine } from "@/lib/types";
import { wrapText, timestamp } from "@/lib/utils";
import { TEMPLATES, THEMES, DEFAULTS, PALETTES, type NotebookPalette } from "./config";

const W = 1200, H = 800;

// ── Helpers ──

function drawPaper(ctx: CanvasRenderingContext2D, pal: NotebookPalette, isGrid: boolean) {
  // Paper background
  ctx.fillStyle = pal.paper;
  ctx.fillRect(0, 0, W, H);

  // Subtle paper texture noise
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;

  if (isGrid) {
    // Graph paper grid
    ctx.strokeStyle = pal.lines;
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }
    // Major grid lines
    ctx.strokeStyle = pal.lines;
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }
  } else {
    // Ruled lines
    ctx.strokeStyle = pal.lines;
    ctx.lineWidth = 0.8;
    for (let y = 80; y < H; y += 32) {
      ctx.beginPath();
      ctx.moveTo(90, y); ctx.lineTo(W - 50, y);
      ctx.stroke();
    }

    // Red margin line
    ctx.strokeStyle = pal.margin;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(90, 0); ctx.lineTo(90, H);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Hole punches (left side)
  const holeColor = pal.paper === "#1a1a2e" ? "#0f0f1e" : "#d4cbb8";
  ctx.fillStyle = holeColor;
  for (const hy of [150, 400, 650]) {
    ctx.beginPath();
    ctx.arc(35, hy, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = pal.lines;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawTapeStrip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, angle: number) {
  ctx.save();
  ctx.translate(x + w / 2, y + 10);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = "rgba(255,235,180,0.5)";
  ctx.fillRect(-w / 2, -10, w, 20);
  ctx.strokeStyle = "rgba(200,180,130,0.4)";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(-w / 2, -10, w, 20);
  // Tape dashes
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "rgba(200,180,130,0.3)";
  ctx.beginPath();
  ctx.moveTo(-w / 2 + 3, 0);
  ctx.lineTo(w / 2 - 3, 0);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawMarkerUnderline(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = color;
  // Rough rectangle simulating marker stroke
  ctx.fillRect(x - 3, y - 4, w + 6, 12);
  ctx.globalAlpha = 0.15;
  ctx.fillRect(x - 1, y - 6, w + 2, 16);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCircleAnnotation(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, -0.1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;

  // Curved line
  const cpx = (x1 + x2) / 2 + (y2 - y1) * 0.3;
  const cpy = (y1 + y2) / 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cpx, cpy, x2, y2);
  ctx.stroke();

  // Arrowhead
  const angle = Math.atan2(y2 - cpy, x2 - cpx);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(angle - 0.4), y2 - 10 * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(angle + 0.4), y2 - 10 * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.restore();
}

// ═══ Templates ═══

function drawBraindump(ctx: CanvasRenderingContext2D, pal: NotebookPalette, headline: string, body: string, tag: string, brand: string, isGrid: boolean) {
  drawPaper(ctx, pal, isGrid);

  // Tape strips at top
  drawTapeStrip(ctx, 200, 8, 100, -2);
  drawTapeStrip(ctx, W - 340, 5, 110, 1.5);

  // Date stamp in top-right
  ctx.font = '400 13px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.ink;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "right";
  ctx.fillText(timestamp().toUpperCase(), W - 70, 55);
  ctx.globalAlpha = 1;

  // Brand as margin scribble (rotated)
  ctx.save();
  ctx.translate(55, 300);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '400 11px "Caveat", cursive';
  ctx.fillStyle = pal.accent;
  ctx.globalAlpha = 0.6;
  ctx.textAlign = "center";
  ctx.fillText(`@${brand}`, 0, 0);
  ctx.globalAlpha = 1;
  ctx.restore();

  let y = 110;

  // Headline
  if (headline) {
    ctx.font = '700 36px "Caveat", cursive';
    ctx.fillStyle = pal.ink;
    ctx.textAlign = "left";
    const hLines = wrapText(headline, 35);
    for (const hl of hLines) {
      ctx.fillText(hl, 110, y);
      // Marker underline on first line
      if (hl === hLines[0]) {
        const tw = ctx.measureText(hl).width;
        drawMarkerUnderline(ctx, 108, y + 4, tw, pal.accent);
      }
      y += 46;
    }
    y += 10;
  }

  // Body text
  if (body) {
    ctx.font = '400 22px "Caveat", cursive';
    ctx.fillStyle = pal.ink;
    ctx.globalAlpha = 0.85;
    ctx.textAlign = "left";
    const bLines = wrapText(body, 50);
    for (const bl of bLines) {
      ctx.fillText(bl, 110, y);
      y += 34;
    }
    ctx.globalAlpha = 1;
    y += 15;
  }

  // Doodle annotations
  drawCircleAnnotation(ctx, W - 200, 200, 60, 40, pal.accent);
  ctx.font = '400 16px "Caveat", cursive';
  ctx.fillStyle = pal.accent;
  ctx.textAlign = "center";
  ctx.fillText("important!", W - 200, 205);

  drawArrow(ctx, W - 250, 230, W - 350, 280, pal.accent);

  // Star doodle
  ctx.font = "20px serif";
  ctx.fillText("★", W - 120, 350);
  ctx.fillText("☆", W - 100, 380);

  // Tag as sticky-note
  if (tag) {
    const stickyX = W - 280;
    const stickyY = H - 220;
    const stickyW = 210;
    const stickyH = 80;

    ctx.save();
    ctx.translate(stickyX + stickyW / 2, stickyY + stickyH / 2);
    ctx.rotate(0.03);
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = "#fff9c4";
    ctx.fillRect(-stickyW / 2, -stickyH / 2, stickyW, stickyH);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = '400 18px "Caveat", cursive';
    ctx.fillStyle = "#5d4037";
    ctx.textAlign = "center";
    ctx.fillText(tag, 0, 8);
    ctx.restore();
  }

  // Bottom scribble
  ctx.font = '400 14px "Caveat", cursive';
  ctx.fillStyle = pal.ink;
  ctx.globalAlpha = 0.35;
  ctx.textAlign = "center";
  ctx.fillText(`— ${brand} · ${timestamp()} —`, W / 2, H - 40);
  ctx.globalAlpha = 1;
}

function drawChecklist(ctx: CanvasRenderingContext2D, pal: NotebookPalette, headline: string, body: string, tag: string, brand: string, isGrid: boolean) {
  drawPaper(ctx, pal, isGrid);

  // Tape strip
  drawTapeStrip(ctx, W / 2 - 60, 6, 120, -1);

  // Date
  ctx.font = '400 13px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.ink;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "right";
  ctx.fillText(timestamp().toUpperCase(), W - 70, 55);
  ctx.globalAlpha = 1;

  let y = 100;

  // Title
  ctx.font = '700 32px "Caveat", cursive';
  ctx.fillStyle = pal.ink;
  ctx.textAlign = "left";
  ctx.fillText(headline || "To-Do List", 110, y);
  const titleW = ctx.measureText(headline || "To-Do List").width;
  drawMarkerUnderline(ctx, 108, y + 4, titleW, pal.accent);
  y += 55;

  // Parse checklist items from body
  const items = body
    ? body.split("\n").filter(l => l.trim())
    : ["Build something amazing", "Ship it fast", "Iterate & improve", "Share with the world"];

  const totalItems = items.length;
  const checkedCount = Math.ceil(totalItems * 0.6); // 60% done for visual

  for (let i = 0; i < items.length; i++) {
    const checked = i < checkedCount;
    const itemText = items[i].replace(/^[-*•]\s*/, "").replace(/^\[.\]\s*/, "");

    // Checkbox
    const cbx = 110;
    const cby = y - 10;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cbx, cby, 18, 18);

    if (checked) {
      // Checkmark
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cbx + 3, cby + 10);
      ctx.lineTo(cbx + 7, cby + 14);
      ctx.lineTo(cbx + 15, cby + 4);
      ctx.stroke();
    }

    // Item text
    ctx.font = '400 22px "Caveat", cursive';
    ctx.fillStyle = pal.ink;
    ctx.globalAlpha = checked ? 0.5 : 0.9;
    ctx.textAlign = "left";

    if (checked) {
      // Strikethrough
      ctx.fillText(itemText, 140, y);
      const tw = ctx.measureText(itemText).width;
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(140, y - 5);
      ctx.lineTo(140 + tw, y - 5);
      ctx.stroke();
    } else {
      ctx.fillText(itemText, 140, y);
    }

    ctx.globalAlpha = 1;
    y += 42;
  }

  // Progress indicator
  y += 20;
  const barX = 110;
  const barW = 300;
  const barH = 8;
  const progress = checkedCount / totalItems;

  ctx.fillStyle = pal.lines;
  ctx.fillRect(barX, y, barW, barH);
  ctx.fillStyle = pal.accent;
  ctx.fillRect(barX, y, barW * progress, barH);

  ctx.font = '400 16px "Caveat", cursive';
  ctx.fillStyle = pal.accent;
  ctx.textAlign = "left";
  ctx.fillText(`${Math.round(progress * 100)}% done!`, barX + barW + 12, y + 8);

  // Margin annotation
  drawArrow(ctx, W - 200, 200, W - 150, 160, pal.accent);
  ctx.font = '400 16px "Caveat", cursive';
  ctx.fillStyle = pal.accent;
  ctx.globalAlpha = 0.7;
  ctx.textAlign = "center";
  ctx.fillText("almost there!", W - 180, 220);
  ctx.globalAlpha = 1;

  // Tag
  if (tag) {
    ctx.font = '400 16px "Caveat", cursive';
    ctx.fillStyle = pal.accent;
    ctx.globalAlpha = 0.6;
    ctx.textAlign = "left";
    ctx.fillText(tag, 110, H - 70);
    ctx.globalAlpha = 1;
  }

  // Brand footer
  ctx.font = '400 14px "Caveat", cursive';
  ctx.fillStyle = pal.ink;
  ctx.globalAlpha = 0.35;
  ctx.textAlign = "center";
  ctx.fillText(`— ${brand} · ${timestamp()} —`, W / 2, H - 40);
  ctx.globalAlpha = 1;
}

// ═══ Main Render ═══

function renderNotebook(canvas: HTMLCanvasElement, config: StyleConfig): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  canvas.width = W;
  canvas.height = H;

  const pal = PALETTES[config.theme] || PALETTES.cream;
  const brand = (config.brand as string) || "sudo jajos";
  const isGrid = config.theme === "grid";

  switch (config.template) {
    case "braindump":
      drawBraindump(ctx, pal, config.headline, config.subtitle, config.tag, brand, isGrid);
      break;
    case "checklist":
    default:
      drawChecklist(ctx, pal, config.headline, config.subtitle, config.tag, brand, isGrid);
      break;
  }

  return { width: W, height: H };
}

export const notebookEngine: StyleEngine = {
  templates: TEMPLATES,
  themes: THEMES,
  defaults: DEFAULTS,
  render: renderNotebook,
};
