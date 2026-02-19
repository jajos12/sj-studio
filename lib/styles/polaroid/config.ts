/* ══════════════════════════════════════════════════════
   Polaroid Style — Config
   ══════════════════════════════════════════════════════ */

import type { Template, Theme, StyleConfig } from "@/lib/types";

export const TEMPLATES: Template[] = [
  { id: "single", name: "Single Frame" },
  { id: "collage", name: "Photo Wall" },
];

export const THEMES: Theme[] = [
  { id: "warm", name: "Warm Vintage", fg: "#4a3728", dim: "#a0896e", glow: "rgba(255,179,71,", bg: "#f5efe6" },
  { id: "cool", name: "Cool Fade", fg: "#2c3e50", dim: "#7f8c8d", glow: "rgba(52,152,219,", bg: "#ecf0f1" },
  { id: "dark", name: "Darkroom", fg: "#e0e0e0", dim: "#666666", glow: "rgba(200,200,200,", bg: "#1a1a1a" },
];

export interface PolaroidPalette {
  bg: string;
  frame: string;
  frameShadow: string;
  photo: string;
  ink: string;
  dim: string;
  accent: string;
  tint: string;
}

export const PALETTES: Record<string, PolaroidPalette> = {
  warm: {
    bg: "#f5efe6", frame: "#fefefa", frameShadow: "rgba(60,40,20,0.2)",
    photo: "#d4c5a0", ink: "#4a3728", dim: "#a0896e", accent: "#d4763a", tint: "rgba(180,140,80,0.12)",
  },
  cool: {
    bg: "#ecf0f1", frame: "#ffffff", frameShadow: "rgba(44,62,80,0.15)",
    photo: "#b0c4d8", ink: "#2c3e50", dim: "#7f8c8d", accent: "#3498db", tint: "rgba(52,152,219,0.08)",
  },
  dark: {
    bg: "#1a1a1a", frame: "#2a2a2a", frameShadow: "rgba(0,0,0,0.5)",
    photo: "#333333", ink: "#e0e0e0", dim: "#666666", accent: "#ffb347", tint: "rgba(255,179,71,0.06)",
  },
};

export const DEFAULTS: StyleConfig = {
  template: "single",
  theme: "warm",
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
