/* ══════════════════════════════════════════════════════
   Terminal Style — Config (data only, no rendering)
   ══════════════════════════════════════════════════════ */

import type { Template, Theme, StyleConfig } from "@/lib/types";

export const TEMPLATES: Template[] = [
  { id: "pfp", name: "Profile Picture" },
  { id: "post-announce", name: "Announcement" },
  { id: "post-article", name: "Article / Thread" },
  { id: "post-quote", name: "Quote Card" },
  { id: "post-minimal", name: "Minimal" },
];

export const THEMES: Theme[] = [
  {
    id: "matrix",
    name: "Matrix Green",
    fg: "#00ff88",
    dim: "#00aa55",
    glow: "rgba(0,255,136,",
    bg: "#0a0e0a",
  },
  {
    id: "amber",
    name: "Amber CRT",
    fg: "#ffb347",
    dim: "#aa7730",
    glow: "rgba(255,179,71,",
    bg: "#0e0a06",
  },
  {
    id: "cyan",
    name: "Cyan Frost",
    fg: "#00e5ff",
    dim: "#0090aa",
    glow: "rgba(0,229,255,",
    bg: "#060a0e",
  },
  {
    id: "purple",
    name: "Synthwave",
    fg: "#bf5fff",
    dim: "#7a3aaa",
    glow: "rgba(191,95,255,",
    bg: "#0c060e",
  },
  {
    id: "red",
    name: "Red Alert",
    fg: "#ff4444",
    dim: "#aa2222",
    glow: "rgba(255,68,68,",
    bg: "#0e0606",
  },
  {
    id: "white",
    name: "Ghost White",
    fg: "#e8e8e8",
    dim: "#888888",
    glow: "rgba(232,232,232,",
    bg: "#0a0a0a",
  },
];

export const DEFAULTS: StyleConfig = {
  template: "pfp",
  theme: "matrix",
  headline: "",
  subtitle: "",
  tag: "",
  brand: "sudo jajos",
  scanlines: 30,
  curvature: 8,
  glow: 40,
};

/** Get field visibility based on template */
export function getFieldVisibility(templateId: string) {
  const isPfp = templateId === "pfp";
  const isMinimal = templateId === "post-minimal";
  return {
    headline: !isPfp,
    subtitle: !isPfp && !isMinimal,
    tag: !isPfp,
  };
}

// ── ASCII Art Assets ──
export const HACKER_ART = [
  "               ▄▄▄▄▄▄▄               ",
  "           ▄██████████████▄           ",
  "         ▄████████████████████▄         ",
  "        ██████████████████████████        ",
  "       ████████████████████████████       ",
  "      ██████████████████████████████      ",
  '      ██████▀▀▀▀▀▀▀▀▀▀▀▀▀▀██████      ',
  "      █████   ▄▄▄    ▄▄▄   █████      ",
  "      █████  █░░░█  █░░░█  █████      ",
  "      █████  █░░░█  █░░░█  █████      ",
  "      ██████  ▀▀▀    ▀▀▀  ██████      ",
  "      ██████▄    ▄▄▄▄    ▄██████      ",
  "       ████████▄▄▄▄▄▄▄████████       ",
  "        ▀██████████████████████▀        ",
  "    ▄▄▄▄▄▄████████████████████▄▄▄▄▄▄    ",
  "   ██░░░░░░████████████████████░░░░░░██   ",
  "   ██░░░░░░██████████████████░░░░░░██   ",
  "    ██░░░░░░████████████████░░░░░░██    ",
  "     ▀██░░░░░░░░░░░░░░░░░░░░░░░██▀     ",
  "       ▀▀████████████████████▀▀       ",
];

export const BRAIN_ART = [
  "          ▄▄▄████████▄▄▄          ",
  "       ▄██▀▀░░░░░░░░░░▀▀██▄       ",
  "     ▄█▀░░▄▄██▄░░░░▄██▄▄░░▀█▄     ",
  "    █▀░░▄██▀▀▀██░░██▀▀▀██▄░░▀█    ",
  "   █░░▄██░░░░░░█░░█░░░░░░██▄░░█   ",
  "  █░░██░░░▄▄░░░█░░█░░░▄▄░░░██░░█  ",
  "  █░░█░░░█▀▀█░░█░░█░░█▀▀█░░░█░░█  ",
  "  █░░█░░░█▄▄█░░█░░█░░█▄▄█░░░█░░█  ",
  "  █░░██░░░▀▀░░░█░░█░░░▀▀░░░██░░█  ",
  "   █░░▀██░░░░░██░░██░░░░░██▀░░█   ",
  "    █▄░░▀██▄▄██▀░░▀██▄▄██▀░░▄█    ",
  "     ▀█▄░░▀▀▀▀░░░░░░▀▀▀▀░░▄█▀     ",
  "       ▀██▄▄░░░░░░░░░░▄▄██▀       ",
  "          ▀▀▀████████▀▀▀          ",
];

export const LOGO_ART = [
  "   ┌─────────────────────────────┐   ",
  "   │    ▄▄▄▄▄  ▄▄▄▄▄  ▄▄▄▄▄     │   ",
  "   │   ▐█   █▌▐█   █▌▐█   █▌    │   ",
  "   │   ▐█▀▀▀▘ ▐█▀▀█▄ ▐█▀▀▀▘     │   ",
  "   │   ▐█     ▐█   █▌▐█         │   ",
  "   │    ▀      ▀▀▀▀▀  ▀         │   ",
  "   │      ░▒▓ CONTENT STUDIO ▓▒░ │   ",
  "   └─────────────────────────────┘   ",
];

export const ALERT_ART = [
  "      ▄▄▄▄▄▄▄      ",
  "     ██░░░░░██     ",
  "    ██░░███░░██    ",
  "    ██░░███░░██    ",
  "    ██░░░░░░░██    ",
  "    ██░░███░░██    ",
  "     ██░░░░░██     ",
  "      ▀▀▀▀▀▀▀      ",
];

export const DIVIDER_THIN = "─".repeat(50);
export const DIVIDER_DOUBLE = "═".repeat(50);
export const DIVIDER_DOTS = "· ".repeat(25);
