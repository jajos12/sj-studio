/* ══════════════════════════════════════════════════════
   Terminal Style — Canvas Render Engine
   ══════════════════════════════════════════════════════ */

import type { StyleConfig, StyleEngine, Theme } from "@/lib/types";
import { wrapText, timestamp } from "@/lib/utils";
import {
  TEMPLATES,
  THEMES,
  DEFAULTS,
  HACKER_ART,
  BRAIN_ART,
  LOGO_ART,
  ALERT_ART,
  DIVIDER_THIN,
  DIVIDER_DOUBLE,
  DIVIDER_DOTS,
} from "./config";

// ── Canvas helpers ──

function setFont(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
): void {
  ctx.font = `${size}px 'JetBrains Mono', 'Fira Code', monospace`;
  ctx.fillStyle = color;
}

function drawTermChrome(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  t: Theme,
  brand: string,
): void {
  ctx.strokeStyle = t.dim;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = t.glow + "0.06)";
  ctx.fillRect(x, y, w, 30);

  const dotY = y + 15;
  (["#ff5f57", "#febc2e", "#28c840"] as string[]).forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(x + 20 + i * 22, dotY, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });

  setFont(ctx, 11, t.dim);
  ctx.textAlign = "center";
  ctx.fillText(`${brand} — terminal`, x + w / 2, dotY + 4);
  ctx.textAlign = "left";
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  _W: number,
  t: Theme,
  tag: string,
  brand: string,
): void {
  if (tag) {
    setFont(ctx, 13, t.fg);
    ctx.textAlign = "center";
    ctx.fillText(tag, cx, y);
    y += 25;
  }
  setFont(ctx, 11, t.dim);
  ctx.textAlign = "center";
  ctx.fillText(
    `[${timestamp()}]  @${brand}  ·  Navigating the Latent Space`,
    cx,
    y + 8,
  );
}

// ═══════════════════════════════════════
//  Template renderers
// ═══════════════════════════════════════

function drawPfp(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: Theme,
  brand: string,
): void {
  const cx = W / 2;
  let y = 60;

  drawTermChrome(ctx, 30, 20, W - 60, H - 40, t, brand);
  y = 70;

  setFont(ctx, 13, t.dim);
  ctx.textAlign = "left";
  ctx.fillText(`${brand}@latent-space:~$ neofetch`, 60, y);
  y += 30;

  setFont(ctx, 11, t.fg);
  ctx.textAlign = "center";
  for (const line of HACKER_ART) {
    ctx.fillText(line, cx, y);
    y += 16;
  }
  y += 14;

  setFont(ctx, 13, t.fg);
  ctx.fillStyle = t.fg;
  ctx.shadowColor = t.glow + "0.6)";
  ctx.shadowBlur = 12;
  const bannerLines = [
    "╔═══════════════════════════════╗",
    "║     s u d o   j a j o s      ║",
    "╚═══════════════════════════════╝",
  ];
  for (const line of bannerLines) {
    ctx.fillText(line, cx, y);
    y += 20;
  }
  ctx.shadowBlur = 0;
  y += 10;

  setFont(ctx, 10, t.dim);
  ctx.fillText(DIVIDER_THIN, cx, y);
  y += 22;

  const infoLines: [string, string][] = [
    ["OS", "Latent Space v∞"],
    ["Kernel", "transformer-7B-instruct"],
    ["Shell", "bash 5.2.21 --ai-augmented"],
    ["CPU", "Neural Engine @ ∞ TOPS"],
    ["Uptime", "100% human-in-the-loop"],
    ["Perms", "rwx (Read/Write/Execute)"],
  ];
  setFont(ctx, 12, t.fg);
  ctx.textAlign = "left";
  for (const [key, val] of infoLines) {
    ctx.fillStyle = t.fg;
    ctx.fillText(`  ${key}:`, cx - 200, y);
    ctx.fillStyle = t.dim;
    ctx.fillText(val, cx - 60, y);
    y += 20;
  }

  y += 10;
  const colors = [
    "#ff4444",
    "#ffaa00",
    "#00ff88",
    "#00bbff",
    "#bf5fff",
    "#ff66aa",
    "#ffffff",
    "#888888",
  ];
  const bw = 30,
    bh = 18;
  const startX = cx - (colors.length * (bw + 6)) / 2;
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(startX + i * (bw + 6), y, bw, bh);
  }
  y += bh + 20;

  setFont(ctx, 12, t.dim);
  ctx.textAlign = "center";
  ctx.fillStyle = t.dim;
  ctx.fillText(
    `$ ${brand} --verbose  |  Real-time inference on the AI frontier`,
    cx,
    y,
  );
}

function drawPostAnnounce(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: Theme,
  headline: string,
  body: string,
  tag: string,
  brand: string,
): void {
  const cx = W / 2;
  let y = 50;

  drawTermChrome(ctx, 30, 20, W - 60, H - 40, t, brand);
  y = 75;

  setFont(ctx, 11, t.dim);
  ctx.textAlign = "left";
  ctx.fillText(`${brand}@frontier:~$ broadcast --urgent`, 60, y);
  y += 40;

  setFont(ctx, 11, t.fg);
  ctx.textAlign = "center";
  const topBorder = "╔" + "═".repeat(46) + "╗";
  const botBorder = "╚" + "═".repeat(46) + "╝";
  ctx.fillText(topBorder, cx, y);
  y += 22;

  setFont(ctx, 12, t.fg);
  ctx.shadowColor = t.glow + "0.5)";
  ctx.shadowBlur = 8;
  for (const line of ALERT_ART) {
    ctx.fillText(line, cx, y);
    y += 16;
  }
  ctx.shadowBlur = 0;
  y += 10;

  if (headline) {
    setFont(ctx, 28, t.fg);
    ctx.shadowColor = t.glow + "0.4)";
    ctx.shadowBlur = 15;
    const hLines = wrapText(headline.toUpperCase(), 26);
    for (const hl of hLines) {
      ctx.fillText(hl, cx, y);
      y += 38;
    }
    ctx.shadowBlur = 0;
  }
  y += 5;

  setFont(ctx, 11, t.fg);
  ctx.fillText(botBorder, cx, y);
  y += 30;

  if (body) {
    setFont(ctx, 14, t.dim);
    const bLines = wrapText(body, 55);
    for (const bl of bLines) {
      ctx.fillText(bl, cx, y);
      y += 22;
    }
    y += 10;
  }

  setFont(ctx, 10, t.dim);
  ctx.fillText(DIVIDER_DOTS, cx, y);
  y += 20;

  drawFooter(ctx, cx, y, W, t, tag, brand);
}

function drawPostArticle(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: Theme,
  headline: string,
  body: string,
  tag: string,
  brand: string,
): void {
  const cx = W / 2;
  let y = 50;

  drawTermChrome(ctx, 30, 20, W - 60, H - 40, t, brand);
  y = 75;

  setFont(ctx, 11, t.dim);
  ctx.textAlign = "left";
  ctx.fillText(`${brand}@frontier:~$ cat article.md | less`, 60, y);
  y += 30;

  setFont(ctx, 10, t.dim);
  ctx.textAlign = "center";
  ctx.fillText(DIVIDER_DOUBLE, cx, y);
  y += 25;

  setFont(ctx, 12, t.fg);
  ctx.shadowColor = t.glow + "0.4)";
  ctx.shadowBlur = 8;
  for (const line of BRAIN_ART) {
    ctx.fillText(line, cx, y);
    y += 16;
  }
  ctx.shadowBlur = 0;
  y += 20;

  if (headline) {
    setFont(ctx, 26, t.fg);
    ctx.shadowColor = t.glow + "0.3)";
    ctx.shadowBlur = 10;
    const hLines = wrapText(headline, 30);
    for (const hl of hLines) {
      ctx.fillText(hl, cx, y);
      y += 35;
    }
    ctx.shadowBlur = 0;
    y += 8;
  }

  setFont(ctx, 10, t.dim);
  ctx.fillText(DIVIDER_THIN, cx, y);
  y += 22;

  if (body) {
    setFont(ctx, 14, t.dim);
    const bLines = wrapText(body, 60);
    for (const bl of bLines) {
      ctx.fillText(bl, cx, y);
      y += 22;
    }
    y += 10;
  }

  drawFooter(ctx, cx, y, W, t, tag, brand);
}

function drawPostQuote(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: Theme,
  headline: string,
  body: string,
  tag: string,
  brand: string,
): void {
  const cx = W / 2;
  let y = 50;

  drawTermChrome(ctx, 30, 20, W - 60, H - 40, t, brand);
  y = 90;

  setFont(ctx, 11, t.dim);
  ctx.textAlign = "left";
  ctx.fillText(`${brand}@frontier:~$ fortune | cowsay -e "@@"`, 60, y);
  y += 50;

  setFont(ctx, 120, t.glow + "0.12)");
  ctx.textAlign = "center";
  ctx.fillText("\u201C", cx - 320, y + 60);
  ctx.fillText("\u201D", cx + 320, y + 60);

  if (headline) {
    setFont(ctx, 24, t.fg);
    ctx.shadowColor = t.glow + "0.3)";
    ctx.shadowBlur = 10;
    const hLines = wrapText(headline, 34);
    for (const hl of hLines) {
      ctx.fillText(hl, cx, y);
      y += 34;
    }
    ctx.shadowBlur = 0;
    y += 15;
  }

  if (body) {
    setFont(ctx, 14, t.dim);
    ctx.fillText(`— ${body}`, cx, y);
    y += 30;
  }

  setFont(ctx, 10, t.dim);
  ctx.fillText("· · · · · · ·", cx, y);
  y += 30;

  setFont(ctx, 10, t.fg);
  for (const line of LOGO_ART) {
    ctx.fillText(line, cx, y);
    y += 14;
  }
  y += 20;

  drawFooter(ctx, cx, y, W, t, tag, brand);
}

function drawPostMinimal(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: Theme,
  headline: string,
  tag: string,
  brand: string,
): void {
  const cx = W / 2;
  let y = 50;

  drawTermChrome(ctx, 30, 20, W - 60, H - 40, t, brand);
  y = 80;

  setFont(ctx, 11, t.dim);
  ctx.textAlign = "left";
  ctx.fillText(`${brand}@frontier:~$ echo $SIGNAL`, 60, y);
  y += 60;

  setFont(ctx, 12, t.fg);
  ctx.textAlign = "center";
  ctx.shadowColor = t.glow + "0.4)";
  ctx.shadowBlur = 10;
  for (const line of LOGO_ART) {
    ctx.fillText(line, cx, y);
    y += 16;
  }
  ctx.shadowBlur = 0;
  y += 40;

  if (headline) {
    setFont(ctx, 36, t.fg);
    ctx.shadowColor = t.glow + "0.4)";
    ctx.shadowBlur = 18;
    const hLines = wrapText(headline.toUpperCase(), 22);
    for (const hl of hLines) {
      ctx.fillText(hl, cx, y);
      y += 48;
    }
    ctx.shadowBlur = 0;
    y += 20;
  }

  if (tag) {
    setFont(ctx, 14, t.dim);
    ctx.fillText(tag, cx, y);
    y += 30;
  }

  setFont(ctx, 11, t.dim);
  ctx.fillText(`[${timestamp()}]  ${brand}`, cx, H - 60);
}

// ═══════════════════════════════════════
//  Main render function
// ═══════════════════════════════════════

function renderTerminal(
  canvas: HTMLCanvasElement,
  config: StyleConfig,
): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  const themeObj = THEMES.find((t) => t.id === config.theme) || THEMES[0];
  const isPfp = config.template === "pfp";
  const W = isPfp ? 1000 : 1200;
  const H = isPfp ? 1000 : 800;
  canvas.width = W;
  canvas.height = H;

  // Background
  ctx.fillStyle = themeObj.bg;
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = themeObj.glow + "0.03)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Template dispatch
  const brand = (config.brand as string) || "sudo jajos";
  switch (config.template) {
    case "pfp":
      drawPfp(ctx, W, H, themeObj, brand);
      break;
    case "post-announce":
      drawPostAnnounce(
        ctx, W, H, themeObj,
        config.headline, config.subtitle, config.tag, brand,
      );
      break;
    case "post-article":
      drawPostArticle(
        ctx, W, H, themeObj,
        config.headline, config.subtitle, config.tag, brand,
      );
      break;
    case "post-quote":
      drawPostQuote(
        ctx, W, H, themeObj,
        config.headline, config.subtitle, config.tag, brand,
      );
      break;
    case "post-minimal":
    default:
      drawPostMinimal(ctx, W, H, themeObj, config.headline, config.tag, brand);
      break;
  }

  // Scanlines
  const scanAlpha = (config.scanlines as number) / 100;
  if (scanAlpha > 0) {
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = `rgba(0,0,0,${scanAlpha * 0.25})`;
      ctx.fillRect(0, y, W, 1);
    }
  }

  // CRT vignette
  const curvature = config.curvature as number;
  if (curvature > 0) {
    const grad = ctx.createRadialGradient(
      W / 2, H / 2, Math.min(W, H) * 0.35,
      W / 2, H / 2, Math.max(W, H) * 0.75,
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, `rgba(0,0,0,${curvature / 30})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // Glow bloom
  const glowPct = (config.glow as number) / 100;
  if (glowPct > 0) {
    const grd = ctx.createRadialGradient(
      W / 2, H / 2, 0,
      W / 2, H / 2, W * 0.5,
    );
    grd.addColorStop(0, themeObj.glow + (0.06 * glowPct) + ")");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  return { width: W, height: H };
}

// ═══════════════════════════════════════
//  Export StyleEngine
// ═══════════════════════════════════════

export const terminalEngine: StyleEngine = {
  templates: TEMPLATES,
  themes: THEMES,
  defaults: DEFAULTS,
  render: renderTerminal,
};
