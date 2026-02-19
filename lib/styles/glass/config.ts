/* ══════════════════════════════════════════════════════
   Glassmorphism Style — Config
   ══════════════════════════════════════════════════════ */

import type { Template, Theme, StyleConfig } from "@/lib/types";

export const TEMPLATES: Template[] = [
  { id: "update", name: "Build Update" },
  { id: "stats", name: "Stats / Progress" },
  { id: "stack", name: "Tech Stack" },
];

export const THEMES: Theme[] = [
  { id: "cyber", name: "Cyber", fg: "#00ff88", dim: "#00e5ff", glow: "rgba(0,255,136,", bg: "#0a2a1a" },
  { id: "sunset", name: "Sunset", fg: "#ff6b35", dim: "#f472b6", glow: "rgba(255,107,53,", bg: "#2a1510" },
  { id: "neon", name: "Neon", fg: "#a78bfa", dim: "#f472b6", glow: "rgba(167,139,250,", bg: "#1a1030" },
  { id: "ocean", name: "Ocean", fg: "#00e5ff", dim: "#3b82f6", glow: "rgba(0,229,255,", bg: "#0a1a2a" },
  { id: "fire", name: "Fire", fg: "#ff4444", dim: "#ffb347", glow: "rgba(255,68,68,", bg: "#2a0a0a" },
];

export const DEFAULTS: StyleConfig = {
  template: "update",
  theme: "cyber",
  headline: "",
  subtitle: "",
  tag: "",
  brand: "sudo jajos",
};

export function getFieldVisibility(templateId: string) {
  return {
    headline: true,
    subtitle: true,
    tag: true,
  };
}

// Palette helper
export interface GlassPalette {
  c1: string;
  c2: string;
  bg1: string;
  bg2: string;
}

export const PALETTES: Record<string, GlassPalette> = {
  cyber:  { c1: "#00ff88", c2: "#00e5ff", bg1: "#0a2a1a", bg2: "#0a1a2a" },
  sunset: { c1: "#ff6b35", c2: "#f472b6", bg1: "#2a1510", bg2: "#2a1020" },
  neon:   { c1: "#a78bfa", c2: "#f472b6", bg1: "#1a1030", bg2: "#2a1030" },
  ocean:  { c1: "#00e5ff", c2: "#3b82f6", bg1: "#0a1a2a", bg2: "#0a1040" },
  fire:   { c1: "#ff4444", c2: "#ffb347", bg1: "#2a0a0a", bg2: "#2a1a0a" },
};
