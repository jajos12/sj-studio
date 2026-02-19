/* ══════════════════════════════════════════════════════
   Notebook Style — Config
   ══════════════════════════════════════════════════════ */

import type { Template, Theme, StyleConfig } from "@/lib/types";

export const TEMPLATES: Template[] = [
  { id: "braindump", name: "Braindump" },
  { id: "checklist", name: "Checklist" },
];

export const THEMES: Theme[] = [
  { id: "cream", name: "Classic Cream", fg: "#2c2c2c", dim: "#8b7e6a", glow: "rgba(244,114,182,", bg: "#fdf6e3" },
  { id: "dark", name: "Dark Mode", fg: "#e0e0e0", dim: "#7a7a9a", glow: "rgba(167,139,250,", bg: "#1a1a2e" },
  { id: "grid", name: "Graph Paper", fg: "#334155", dim: "#94a3b8", glow: "rgba(59,130,246,", bg: "#f0f4f8" },
];

export interface NotebookPalette {
  paper: string;
  ink: string;
  accent: string;
  lines: string;
  margin: string;
}

export const PALETTES: Record<string, NotebookPalette> = {
  cream: { paper: "#fdf6e3", ink: "#2c2c2c", accent: "#f472b6", lines: "#e6dcc8", margin: "#e57373" },
  dark:  { paper: "#1a1a2e", ink: "#e0e0e0", accent: "#a78bfa", lines: "#2a2a4e", margin: "#6366f1" },
  grid:  { paper: "#f0f4f8", ink: "#334155", accent: "#3b82f6", lines: "#cbd5e1", margin: "#3b82f6" },
};

export const DEFAULTS: StyleConfig = {
  template: "braindump",
  theme: "cream",
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
