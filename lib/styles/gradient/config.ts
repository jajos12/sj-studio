/* ══════════════════════════════════════════════════════
   Gradient Typography Style — Config
   ══════════════════════════════════════════════════════ */

import type { Template, Theme, StyleConfig } from "@/lib/types";

export const TEMPLATES: Template[] = [
  { id: "quote", name: "Quote / One-liner" },
  { id: "announce", name: "Announcement" },
  { id: "label", name: "Topic Label" },
];

export const THEMES: Theme[] = [
  { id: "aurora",  name: "Aurora",  fg: "#00ff88", dim: "#a78bfa", glow: "rgba(0,255,136,", bg: "#06070a" },
  { id: "sunset",  name: "Sunset",  fg: "#ff6b35", dim: "#a78bfa", glow: "rgba(255,107,53,", bg: "#06070a" },
  { id: "ocean",   name: "Ocean",   fg: "#00e5ff", dim: "#6366f1", glow: "rgba(0,229,255,", bg: "#06070a" },
  { id: "fire",    name: "Fire",    fg: "#fbbf24", dim: "#ef4444", glow: "rgba(251,191,36,", bg: "#06070a" },
  { id: "mono",    name: "Mono",    fg: "#ffffff", dim: "#606060", glow: "rgba(255,255,255,", bg: "#06070a" },
  { id: "neon",    name: "Neon",    fg: "#00ff88", dim: "#f472b6", glow: "rgba(0,255,136,", bg: "#06070a" },
];

export const FONTS = [
  { id: "Outfit", name: "Outfit" },
  { id: "Inter", name: "Inter" },
  { id: "JetBrains Mono", name: "JetBrains Mono" },
];

export const GRADIENTS: Record<string, string[]> = {
  aurora:  ["#00ff88", "#00e5ff", "#a78bfa"],
  sunset:  ["#ff6b35", "#f472b6", "#a78bfa"],
  ocean:   ["#00e5ff", "#3b82f6", "#6366f1"],
  fire:    ["#fbbf24", "#f97316", "#ef4444"],
  mono:    ["#ffffff", "#a0a0a0", "#606060"],
  neon:    ["#00ff88", "#a78bfa", "#f472b6"],
};

export const DEFAULTS: StyleConfig = {
  template: "quote",
  theme: "aurora",
  headline: "",
  subtitle: "",
  tag: "",
  brand: "sudo jajos",
  fontFamily: "Outfit",
};

export function getFieldVisibility(templateId: string) {
  return {
    headline: true,
    subtitle: true,
    tag: true,
  };
}
