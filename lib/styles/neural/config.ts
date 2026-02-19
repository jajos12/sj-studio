/* ══════════════════════════════════════════════════════
   Node Graph Style — Config
   ══════════════════════════════════════════════════════ */

import type { Template, Theme, StyleConfig } from "@/lib/types";

export const TEMPLATES: Template[] = [
  { id: "network", name: "Neural Network" },
  { id: "constellation", name: "Constellation" },
];

export const THEMES: Theme[] = [
  { id: "violet", name: "Violet Pulse", fg: "#e0d4ff", dim: "#6d5aab", glow: "rgba(167,139,250,", bg: "#0c0a1a" },
  { id: "cyan", name: "Cyan Synapse", fg: "#ccfbf1", dim: "#2dd4bf", glow: "rgba(34,211,238,", bg: "#051014" },
  { id: "ember", name: "Ember Core", fg: "#ffe4cc", dim: "#f97316", glow: "rgba(249,115,22,", bg: "#140a04" },
  { id: "ghost", name: "Ghost Signal", fg: "#e8e8e8", dim: "#666666", glow: "rgba(200,200,200,", bg: "#0a0a0a" },
];

export interface NodePalette {
  bg: string;
  node: string;
  edge: string;
  glow: string;
  text: string;
  dim: string;
}

export const PALETTES: Record<string, NodePalette> = {
  violet: { bg: "#0c0a1a", node: "#a78bfa", edge: "#6d5aab", glow: "#a78bfa", text: "#e0d4ff", dim: "#5b4d8a" },
  cyan:   { bg: "#051014", node: "#22d3ee", edge: "#0e7490", glow: "#22d3ee", text: "#ccfbf1", dim: "#157a7a" },
  ember:  { bg: "#140a04", node: "#f97316", edge: "#9a3412", glow: "#f97316", text: "#ffe4cc", dim: "#a34e14" },
  ghost:  { bg: "#0a0a0a", node: "#a0a0a0", edge: "#444444", glow: "#c0c0c0", text: "#e8e8e8", dim: "#555555" },
};

export const DEFAULTS: StyleConfig = {
  template: "network",
  theme: "violet",
  headline: "",
  subtitle: "",
  tag: "",
  brand: "sudo jajos",
};

export function getFieldVisibility(templateId: string) {
  return {
    headline: true,
    subtitle: templateId === "network",
    tag: true,
  };
}
