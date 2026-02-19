/* ══════════════════════════════════════════════════════
   Blueprint Style — Config
   ══════════════════════════════════════════════════════ */

import type { Template, Theme, StyleConfig } from "@/lib/types";

export const TEMPLATES: Template[] = [
  { id: "spec", name: "Spec Sheet" },
  { id: "system", name: "System Diagram" },
];

export const THEMES: Theme[] = [
  { id: "classic", name: "Classic Blue", fg: "#c8ddf0", dim: "#4a6d8c", glow: "rgba(59,130,246,", bg: "#0a1628" },
  { id: "white", name: "Whiteboard", fg: "#1e293b", dim: "#64748b", glow: "rgba(30,64,175,", bg: "#f8fafc" },
];

export interface BlueprintPalette {
  bg: string;
  gridMinor: string;
  gridMajor: string;
  line: string;
  text: string;
  dim: string;
  accent: string;
}

export const PALETTES: Record<string, BlueprintPalette> = {
  classic: {
    bg: "#0a1628", gridMinor: "#0f2240", gridMajor: "#1e3a5f",
    line: "#3b82f6", text: "#c8ddf0", dim: "#4a6d8c", accent: "#60a5fa",
  },
  white: {
    bg: "#f8fafc", gridMinor: "#e2e8f0", gridMajor: "#cbd5e1",
    line: "#1e40af", text: "#1e293b", dim: "#64748b", accent: "#3b82f6",
  },
};

export const DEFAULTS: StyleConfig = {
  template: "spec",
  theme: "classic",
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
