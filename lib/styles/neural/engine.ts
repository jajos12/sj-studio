/* ══════════════════════════════════════════════════════
   Node Graph Style — Canvas Render Engine
   ══════════════════════════════════════════════════════ */

import type { StyleConfig, StyleEngine } from "@/lib/types";
import { timestamp } from "@/lib/utils";
import { TEMPLATES, THEMES, DEFAULTS, PALETTES, type NodePalette } from "./config";

const W = 1200, H = 800;

// ── Seeded random for deterministic layouts ──
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

interface GraphNode {
  x: number;
  y: number;
  r: number;
  label: string;
  active: boolean;
}

// ── Helpers ──

function drawBackground(ctx: CanvasRenderingContext2D, pal: NodePalette) {
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow from center
  const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 500);
  grad.addColorStop(0, pal.glow + "08");
  grad.addColorStop(0.5, pal.glow + "03");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawEdge(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, pal: NodePalette, alpha: number) {
  ctx.save();
  ctx.strokeStyle = pal.edge;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Glow layer
  ctx.strokeStyle = pal.glow;
  ctx.globalAlpha = alpha * 0.3;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawNode(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, pal: NodePalette, active: boolean) {
  ctx.save();

  // Outer glow
  if (active) {
    const glowGrad = ctx.createRadialGradient(x, y, r, x, y, r * 3);
    glowGrad.addColorStop(0, pal.glow + "30");
    glowGrad.addColorStop(0.5, pal.glow + "10");
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y, r * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ring
  ctx.strokeStyle = active ? pal.node : pal.edge;
  ctx.lineWidth = active ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  // Core fill
  ctx.fillStyle = active ? pal.node : pal.edge;
  ctx.globalAlpha = active ? 0.9 : 0.4;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Inner dot
  ctx.fillStyle = pal.text;
  ctx.globalAlpha = active ? 0.8 : 0.3;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, pal: NodePalette, seed: number) {
  const rng = seededRandom(seed);
  ctx.save();
  for (let i = 0; i < 60; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const r = rng() * 1.5 + 0.3;
    ctx.fillStyle = pal.node;
    ctx.globalAlpha = rng() * 0.3 + 0.05;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawHexIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, pal: NodePalette) {
  ctx.save();
  ctx.strokeStyle = pal.node;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ═══ Templates ═══

function drawNetwork(ctx: CanvasRenderingContext2D, pal: NodePalette, headline: string, body: string, tag: string, brand: string) {
  drawBackground(ctx, pal);
  drawParticles(ctx, pal, 42);

  // Background hex pattern
  for (let i = 0; i < 8; i++) {
    const rng = seededRandom(i * 7 + 100);
    drawHexIcon(ctx, rng() * W, rng() * H, 30 + rng() * 40, pal);
  }

  // Generate network nodes
  const rng = seededRandom(123);
  const nodes: GraphNode[] = [];
  const labels = body
    ? body.split("\n").filter(l => l.trim()).map(l => l.replace(/^[-*•]\s*/, "").trim())
    : ["INPUT", "ENCODER", "ATTENTION", "FFN", "DECODER", "OUTPUT", "LOSS", "OPTIM"];

  const numNodes = Math.min(labels.length, 10);
  const mainNodes = Math.min(numNodes, 6);

  // Place main nodes in a structured layout
  const cx = W / 2;
  const cy = H / 2 + 20;
  const layerX = [180, 380, 600, 820, 1020];

  for (let i = 0; i < mainNodes; i++) {
    let x: number, y: number;
    if (mainNodes <= 4) {
      x = 200 + (i / (mainNodes - 1 || 1)) * 800;
      y = cy + (i % 2 === 0 ? -40 : 40);
    } else {
      const col = Math.min(i, layerX.length - 1);
      x = layerX[col] || 600;
      y = cy + (i % 2 === 0 ? -60 : 60);
    }
    nodes.push({ x, y, r: 18 + rng() * 8, label: labels[i] || `N${i}`, active: i < 3 || rng() > 0.4 });
  }

  // Extra ambient nodes
  for (let i = mainNodes; i < numNodes; i++) {
    nodes.push({
      x: 100 + rng() * (W - 200),
      y: 150 + rng() * (H - 300),
      r: 8 + rng() * 6,
      label: labels[i] || "",
      active: false,
    });
  }

  // Draw edges (connect sequential + some cross-connections)
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    drawEdge(ctx, a.x, a.y, b.x, b.y, pal, a.active && b.active ? 0.6 : 0.15);
  }
  // Cross edges
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 2; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (dist < 300 && rng() > 0.5) {
        drawEdge(ctx, nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, pal, 0.08);
      }
    }
  }

  // Draw nodes
  for (const n of nodes) {
    drawNode(ctx, n.x, n.y, n.r, pal, n.active);
    if (n.label && n.r > 12) {
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = n.active ? pal.text : pal.dim;
      ctx.globalAlpha = n.active ? 0.8 : 0.4;
      ctx.textAlign = "center";
      ctx.fillText(n.label, n.x, n.y + n.r + 16);
      ctx.globalAlpha = 1;
    }
  }

  // Headline overlay
  if (headline) {
    ctx.font = '700 36px "Inter", sans-serif';
    ctx.fillStyle = pal.text;
    ctx.textAlign = "center";
    ctx.fillText(headline, cx, 80);

    // Subtle glow
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 20;
    ctx.fillText(headline, cx, 80);
    ctx.shadowBlur = 0;
  }

  // Tag
  if (tag) {
    ctx.font = '500 13px "JetBrains Mono", monospace';
    ctx.fillStyle = pal.node;
    ctx.globalAlpha = 0.6;
    ctx.textAlign = "center";
    ctx.fillText(tag, cx, H - 70);
    ctx.globalAlpha = 1;
  }

  // Brand + timestamp footer
  ctx.font = '400 11px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.dim;
  ctx.globalAlpha = 0.5;
  ctx.textAlign = "center";
  ctx.fillText(`${timestamp()}  ·  @${brand}`, cx, H - 35);
  ctx.globalAlpha = 1;

  // Corner hex badges
  drawHexIcon(ctx, 50, 50, 20, pal);
  drawHexIcon(ctx, W - 50, H - 50, 20, pal);
}

function drawConstellation(ctx: CanvasRenderingContext2D, pal: NodePalette, headline: string, _body: string, tag: string, brand: string) {
  drawBackground(ctx, pal);

  // Star field
  const rng = seededRandom(777);
  ctx.save();
  for (let i = 0; i < 200; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const r = rng() * 1.2 + 0.2;
    ctx.fillStyle = pal.text;
    ctx.globalAlpha = rng() * 0.4 + 0.05;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Constellation points — arranged in a meaningful pattern
  const cx = W / 2;
  const cy = H / 2;
  const points: { x: number; y: number; bright: boolean }[] = [
    { x: cx - 300, y: cy - 120, bright: true },
    { x: cx - 180, y: cy - 200, bright: false },
    { x: cx - 100, y: cy - 80, bright: true },
    { x: cx + 20, y: cy - 160, bright: true },
    { x: cx + 140, y: cy - 60, bright: false },
    { x: cx + 250, y: cy - 180, bright: true },
    { x: cx + 320, y: cy - 100, bright: false },
    { x: cx - 50, y: cy + 60, bright: true },
    { x: cx + 100, y: cy + 120, bright: false },
    { x: cx + 280, y: cy + 40, bright: true },
    { x: cx - 220, y: cy + 100, bright: false },
    { x: cx + 180, y: cy + 180, bright: true },
  ];

  // Draw constellation lines
  const connections = [
    [0, 2], [2, 3], [3, 5], [5, 6], [2, 7], [7, 8], [8, 9],
    [0, 10], [7, 10], [4, 9], [8, 11], [3, 4], [1, 2],
  ];

  for (const [a, b] of connections) {
    const p1 = points[a];
    const p2 = points[b];
    ctx.save();
    ctx.strokeStyle = pal.node;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Draw constellation stars
  for (const p of points) {
    drawNode(ctx, p.x, p.y, p.bright ? 6 : 3.5, pal, p.bright);
  }

  // Center text area (dark backdrop)
  const textBgGrad = ctx.createRadialGradient(cx, cy + 30, 0, cx, cy + 30, 200);
  textBgGrad.addColorStop(0, pal.bg + "ee");
  textBgGrad.addColorStop(1, "transparent");
  ctx.fillStyle = textBgGrad;
  ctx.fillRect(cx - 250, cy - 40, 500, 160);

  // Headline
  if (headline) {
    ctx.font = '300 32px "Inter", sans-serif';
    ctx.fillStyle = pal.text;
    ctx.textAlign = "center";
    ctx.fillText(headline, cx, cy + 20);

    // Glow effect
    ctx.save();
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 15;
    ctx.globalAlpha = 0.5;
    ctx.fillText(headline, cx, cy + 20);
    ctx.restore();
  }

  // Tag as constellation name
  if (tag) {
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = pal.node;
    ctx.globalAlpha = 0.5;
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText(`✦  ${tag.toUpperCase()}  ✦`, cx, cy + 55);
    ctx.globalAlpha = 1;
  }

  // Corner decorations
  ctx.font = '400 12px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.dim;
  ctx.globalAlpha = 0.3;
  ctx.textAlign = "left";
  ctx.fillText(`RA ${(rng() * 24).toFixed(1)}h`, 40, 40);
  ctx.fillText(`DEC +${(rng() * 90).toFixed(1)}°`, 40, 58);
  ctx.textAlign = "right";
  ctx.fillText(timestamp(), W - 40, 40);
  ctx.globalAlpha = 1;

  // Brand footer
  ctx.font = '400 11px "JetBrains Mono", monospace';
  ctx.fillStyle = pal.dim;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "center";
  ctx.fillText(`@${brand}  ·  Navigating the Latent Space`, cx, H - 35);
  ctx.globalAlpha = 1;
}

// ═══ Main Render ═══

function renderNeural(canvas: HTMLCanvasElement, config: StyleConfig): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  canvas.width = W;
  canvas.height = H;

  const pal = PALETTES[config.theme] || PALETTES.violet;
  const brand = (config.brand as string) || "sudo jajos";

  switch (config.template) {
    case "network":
      drawNetwork(ctx, pal, config.headline, config.subtitle, config.tag, brand);
      break;
    case "constellation":
    default:
      drawConstellation(ctx, pal, config.headline, config.subtitle, config.tag, brand);
      break;
  }

  return { width: W, height: H };
}

export const neuralEngine: StyleEngine = {
  templates: TEMPLATES,
  themes: THEMES,
  defaults: DEFAULTS,
  render: renderNeural,
};
