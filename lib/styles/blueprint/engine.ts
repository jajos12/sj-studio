/* ══════════════════════════════════════════════════════
   Blueprint Style — Canvas Render Engine
   ══════════════════════════════════════════════════════ */

import type { StyleConfig, StyleEngine } from "@/lib/types";
import { wrapText, timestamp } from "@/lib/utils";
import { TEMPLATES, THEMES, DEFAULTS, PALETTES, type BlueprintPalette } from "./config";

const W = 1200, H = 800;

// ── Helpers ──

function drawGrid(ctx: CanvasRenderingContext2D, pal: BlueprintPalette) {
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, W, H);

  // Minor grid
  ctx.strokeStyle = pal.gridMinor;
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Major grid
  ctx.strokeStyle = pal.gridMajor;
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 100) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 100) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

function drawCornerMarks(ctx: CanvasRenderingContext2D, pal: BlueprintPalette) {
  const m = 25; // margin
  const l = 15; // line length
  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 1;

  // Top-left
  ctx.beginPath(); ctx.moveTo(m, m + l); ctx.lineTo(m, m); ctx.lineTo(m + l, m); ctx.stroke();
  // Top-right
  ctx.beginPath(); ctx.moveTo(W - m - l, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + l); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(m, H - m - l); ctx.lineTo(m, H - m); ctx.lineTo(m + l, H - m); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(W - m - l, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - l); ctx.stroke();
}

function drawTitleBlock(ctx: CanvasRenderingContext2D, pal: BlueprintPalette, brand: string, tag: string) {
  const bw = 340, bh = 90;
  const bx = W - bw - 40;
  const by = H - bh - 40;

  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx, by, bw, bh);

  // Horizontal dividers
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(bx, by + 30); ctx.lineTo(bx + bw, by + 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx, by + 60); ctx.lineTo(bx + bw, by + 60); ctx.stroke();

  // Vertical divider
  ctx.beginPath(); ctx.moveTo(bx + bw / 2, by + 30); ctx.lineTo(bx + bw / 2, by + 60); ctx.stroke();

  // Title
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.text;
  ctx.textAlign = "center";
  ctx.fillText(brand.toUpperCase(), bx + bw / 2, by + 20);

  // Fields
  ctx.font = '400 10px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.dim;
  ctx.textAlign = "left";
  ctx.fillText("DATE", bx + 8, by + 44);
  ctx.fillText("REV", bx + bw / 2 + 8, by + 44);
  ctx.fillText("SCALE", bx + 8, by + 74);

  ctx.fillStyle = pal.text;
  ctx.font = '400 11px "JetBrains Mono", monospace';
  ctx.fillText(timestamp().slice(0, 10), bx + 50, by + 44);
  ctx.fillText("01", bx + bw / 2 + 40, by + 44);
  ctx.fillText("1:1", bx + 55, by + 74);

  if (tag) {
    ctx.fillStyle = pal.dim;
    ctx.font = '400 10px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.fillText("TAG", bx + bw / 2 + 8, by + 74);
    ctx.fillStyle = pal.accent;
    ctx.fillText(tag, bx + bw / 2 + 40, by + 74);
  }
}

function drawDashedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}

function drawDimLine(ctx: CanvasRenderingContext2D, x1: number, y: number, x2: number, label: string, pal: BlueprintPalette) {
  ctx.strokeStyle = pal.dim;
  ctx.fillStyle = pal.dim;
  ctx.lineWidth = 0.8;
  ctx.setLineDash([2, 2]);

  // Horizontal line
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();

  // Ticks
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x1, y - 4); ctx.lineTo(x1, y + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y - 4); ctx.lineTo(x2, y + 4); ctx.stroke();

  // Arrows
  ctx.beginPath();
  ctx.moveTo(x1, y); ctx.lineTo(x1 + 6, y - 3); ctx.lineTo(x1 + 6, y + 3);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x2, y); ctx.lineTo(x2 - 6, y - 3); ctx.lineTo(x2 - 6, y + 3);
  ctx.closePath(); ctx.fill();

  // Label
  ctx.font = '400 9px "JetBrains Mono", monospace';
  ctx.textAlign = "center";
  ctx.fillText(label, (x1 + x2) / 2, y - 6);
}

function drawVDimLine(ctx: CanvasRenderingContext2D, x: number, y1: number, y2: number, label: string, pal: BlueprintPalette) {
  ctx.strokeStyle = pal.dim;
  ctx.fillStyle = pal.dim;
  ctx.lineWidth = 0.8;
  ctx.setLineDash([2, 2]);

  ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();

  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x - 4, y1); ctx.lineTo(x + 4, y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 4, y2); ctx.lineTo(x + 4, y2); ctx.stroke();

  ctx.save();
  ctx.translate(x - 6, (y1 + y2) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '400 9px "JetBrains Mono", monospace';
  ctx.textAlign = "center";
  ctx.fillText(label, 0, 0);
  ctx.restore();
}

function drawConnector(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, pal: BlueprintPalette) {
  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);

  const midX = (x1 + x2) / 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(midX, y1);
  ctx.lineTo(midX, y2);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Arrow at end
  ctx.fillStyle = pal.line;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 7, y2 - 4);
  ctx.lineTo(x2 - 7, y2 + 4);
  ctx.closePath();
  ctx.fill();
}

// ═══ Templates ═══

function drawSpec(ctx: CanvasRenderingContext2D, pal: BlueprintPalette, headline: string, body: string, tag: string, brand: string) {
  drawGrid(ctx, pal);
  drawCornerMarks(ctx, pal);

  // Revision stamp
  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.accent;
  ctx.textAlign = "left";
  ctx.fillText("◆ REV 01 — DRAFT", 50, 55);

  // Main spec title
  ctx.font = '700 28px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.text;
  ctx.textAlign = "center";
  ctx.fillText(headline ? headline.toUpperCase() : "PROJECT SPECIFICATION", W / 2, 100);

  // Center divider
  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 200, 115);
  ctx.lineTo(W / 2 + 200, 115);
  ctx.stroke();

  // Main component box
  const boxX = 100, boxY = 150, boxW = 440, boxH = 280;
  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Component label
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.text;
  ctx.textAlign = "center";
  ctx.fillText("MAIN MODULE", boxX + boxW / 2, boxY + 30);

  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(boxX + 20, boxY + 45);
  ctx.lineTo(boxX + boxW - 20, boxY + 45);
  ctx.stroke();

  // Body spec lines
  if (body) {
    ctx.font = '400 13px "JetBrains Mono", monospace';
    ctx.fillStyle = pal.dim;
    ctx.textAlign = "left";
    const specLines = wrapText(body, 40);
    let sy = boxY + 70;
    for (const sl of specLines) {
      ctx.fillText(`▸ ${sl}`, boxX + 25, sy);
      sy += 22;
    }
  } else {
    // Default spec items
    const specs = [
      "▸ TYPE: Content Generation Engine",
      "▸ INPUT: Text, Config, Theme",
      "▸ OUTPUT: 1200×800 Canvas",
      "▸ FORMAT: PNG / WebP",
      "▸ STATUS: Active Development",
    ];
    ctx.font = '400 13px "JetBrains Mono", monospace';
    ctx.fillStyle = pal.dim;
    ctx.textAlign = "left";
    let sy = boxY + 70;
    for (const s of specs) {
      ctx.fillText(s, boxX + 25, sy);
      sy += 24;
    }
  }

  // Side modules (dashed)
  const sideX = 620, sideY1 = 160, sideY2 = 310;
  const sideW = 200, sideH = 100;

  drawDashedRect(ctx, sideX, sideY1, sideW, sideH, pal.line);
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.accent;
  ctx.textAlign = "center";
  ctx.fillText("INPUT HANDLER", sideX + sideW / 2, sideY1 + 25);
  ctx.font = '400 10px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.dim;
  ctx.fillText("Parse & validate", sideX + sideW / 2, sideY1 + 50);
  ctx.fillText("user configuration", sideX + sideW / 2, sideY1 + 66);

  drawDashedRect(ctx, sideX, sideY2, sideW, sideH, pal.line);
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.accent;
  ctx.textAlign = "center";
  ctx.fillText("RENDER ENGINE", sideX + sideW / 2, sideY2 + 25);
  ctx.font = '400 10px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.dim;
  ctx.fillText("Canvas 2D context", sideX + sideW / 2, sideY2 + 50);
  ctx.fillText("compositioning", sideX + sideW / 2, sideY2 + 66);

  // Connectors
  drawConnector(ctx, boxX + boxW, boxY + 80, sideX, sideY1 + 50, pal);
  drawConnector(ctx, boxX + boxW, boxY + 200, sideX, sideY2 + 50, pal);

  // Output box
  const outX = 900, outY = 230, outW = 180, outH = 80;
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(outX, outY, outW, outH);
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.accent;
  ctx.textAlign = "center";
  ctx.fillText("◆ OUTPUT", outX + outW / 2, outY + 30);
  ctx.font = '400 10px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.dim;
  ctx.fillText("PNG / 1200×800", outX + outW / 2, outY + 55);

  drawConnector(ctx, sideX + sideW, sideY2 + 50, outX, outY + 40, pal);

  // Dimension lines
  drawDimLine(ctx, boxX, boxY + boxH + 20, boxX + boxW, `${boxW}px`, pal);
  drawVDimLine(ctx, boxX - 20, boxY, boxY + boxH, `${boxH}px`, pal);

  // Center marker
  ctx.strokeStyle = pal.dim;
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(boxX + boxW / 2, boxY - 10);
  ctx.lineTo(boxX + boxW / 2, boxY + boxH + 10);
  ctx.stroke();
  ctx.setLineDash([]);

  // Title block
  drawTitleBlock(ctx, pal, brand, tag);
}

function drawSystem(ctx: CanvasRenderingContext2D, pal: BlueprintPalette, headline: string, body: string, tag: string, brand: string) {
  drawGrid(ctx, pal);
  drawCornerMarks(ctx, pal);

  // Header
  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.accent;
  ctx.textAlign = "left";
  ctx.fillText("◆ SYSTEM ARCHITECTURE", 50, 55);

  ctx.font = '700 26px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.text;
  ctx.textAlign = "center";
  ctx.fillText(headline ? headline.toUpperCase() : "SYSTEM DIAGRAM", W / 2, 100);

  // Divider
  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 180, 115);
  ctx.lineTo(W / 2 + 180, 115);
  ctx.stroke();

  // Define nodes
  const nodes = body
    ? body.split("\n").filter(l => l.trim()).slice(0, 6).map((l, i) => ({
        label: l.replace(/^[-*•]\s*/, "").trim().toUpperCase().slice(0, 20),
        x: 0, y: 0, w: 180, h: 60,
      }))
    : [
        { label: "CLIENT", x: 0, y: 0, w: 180, h: 60 },
        { label: "API GATEWAY", x: 0, y: 0, w: 180, h: 60 },
        { label: "AUTH SERVICE", x: 0, y: 0, w: 180, h: 60 },
        { label: "CORE ENGINE", x: 0, y: 0, w: 180, h: 60 },
        { label: "DATABASE", x: 0, y: 0, w: 180, h: 60 },
        { label: "CDN / STORAGE", x: 0, y: 0, w: 180, h: 60 },
      ];

  // Layout: top row (1-3), bottom row (4-6)
  const startY1 = 170, startY2 = 380;
  const cols = Math.min(nodes.length, 3);
  const gap = 60;
  const totalW = cols * 180 + (cols - 1) * gap;
  const startX = (W - totalW) / 2;

  for (let i = 0; i < nodes.length; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const rowNodeCount = row === 0 ? Math.min(nodes.length, 3) : nodes.length - 3;
    const rowTotalW = rowNodeCount * 180 + (rowNodeCount - 1) * gap;
    const rowStartX = (W - rowTotalW) / 2;
    nodes[i].x = rowStartX + col * (180 + gap);
    nodes[i].y = row === 0 ? startY1 : startY2;
  }

  // Draw connectors first (behind nodes)
  for (let i = 0; i < Math.min(nodes.length, 3); i++) {
    const topNode = nodes[i];
    const botIdx = i + 3;
    if (botIdx < nodes.length) {
      const botNode = nodes[botIdx];
      ctx.strokeStyle = pal.line;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(topNode.x + topNode.w / 2, topNode.y + topNode.h);
      ctx.lineTo(botNode.x + botNode.w / 2, botNode.y);
      ctx.stroke();

      // Arrow
      const ax = botNode.x + botNode.w / 2;
      const ay = botNode.y;
      ctx.fillStyle = pal.line;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - 5, ay - 8);
      ctx.lineTo(ax + 5, ay - 8);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Horizontal connectors in same row
  for (let row = 0; row < 2; row++) {
    const rowStart = row * 3;
    const rowEnd = Math.min(rowStart + 3, nodes.length);
    for (let i = rowStart; i < rowEnd - 1; i++) {
      const a = nodes[i];
      const b = nodes[i + 1];
      ctx.strokeStyle = pal.dim;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(a.x + a.w, a.y + a.h / 2);
      ctx.lineTo(b.x, b.y + b.h / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];

    // Box
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 2;
    ctx.strokeRect(n.x, n.y, n.w, n.h);

    // Fill (subtle)
    ctx.fillStyle = pal.bg;
    ctx.fillRect(n.x + 1, n.y + 1, n.w - 2, n.h - 2);

    // Index badge
    ctx.fillStyle = pal.accent;
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.fillText(`#${(i + 1).toString().padStart(2, "0")}`, n.x + 8, n.y + 16);

    // Label
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillStyle = pal.text;
    ctx.textAlign = "center";
    ctx.fillText(n.label, n.x + n.w / 2, n.y + 40);
  }

  // Data flow labels
  if (nodes.length >= 4) {
    ctx.font = '400 9px "JetBrains Mono", monospace';
    ctx.fillStyle = pal.dim;
    ctx.textAlign = "center";
    const midY = (startY1 + 60 + startY2) / 2;
    ctx.fillText("▼ DATA FLOW", W / 2, midY);
  }

  // Dimension annotation
  if (nodes.length >= 3) {
    const first = nodes[0];
    const last = nodes[Math.min(2, nodes.length - 1)];
    drawDimLine(ctx, first.x, startY1 + 90 + (nodes.length > 3 ? 250 : 100), last.x + last.w, `${Math.round(last.x + last.w - first.x)}px`, pal);
  }

  // Title block
  drawTitleBlock(ctx, pal, brand, tag);
}

// ═══ Main Render ═══

function renderBlueprint(canvas: HTMLCanvasElement, config: StyleConfig): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  canvas.width = W;
  canvas.height = H;

  const pal = PALETTES[config.theme] || PALETTES.classic;
  const brand = (config.brand as string) || "sudo jajos";

  switch (config.template) {
    case "spec":
      drawSpec(ctx, pal, config.headline, config.subtitle, config.tag, brand);
      break;
    case "system":
    default:
      drawSystem(ctx, pal, config.headline, config.subtitle, config.tag, brand);
      break;
  }

  return { width: W, height: H };
}

export const blueprintEngine: StyleEngine = {
  templates: TEMPLATES,
  themes: THEMES,
  defaults: DEFAULTS,
  render: renderBlueprint,
};
