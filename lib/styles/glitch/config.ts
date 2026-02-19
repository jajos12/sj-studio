/* ══════════════════════════════════════════════════════
   VHS / Glitch Style — Config
   ══════════════════════════════════════════════════════ */

import type { Template, Theme, StyleConfig } from "@/lib/types";

export const TEMPLATES: Template[] = [
  { id: "hottake", name: "Hot Take" },
  { id: "warning", name: "Warning / Alert" },
  { id: "versus", name: "X vs Y" },
];

// Glitch only has one "theme" — VHS red
export const THEMES: Theme[] = [
  { id: "vhs", name: "VHS Red", fg: "#ff4444", dim: "#ff0000", glow: "rgba(255,68,68,", bg: "#08090d" },
];

export const DEFAULTS: StyleConfig = {
  template: "hottake",
  theme: "vhs",
  headline: "",
  subtitle: "",
  tag: "",
  brand: "sudo jajos",
  glitch: 50,
  noise: 30,
  rgbsplit: 8,
};

export function getFieldVisibility(templateId: string) {
  return {
    headline: true,
    subtitle: true,
    tag: true,
  };
}
