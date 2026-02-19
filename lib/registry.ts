/* ══════════════════════════════════════════════════════
   Style Registry — Content Studio
   ══════════════════════════════════════════════════════ */

import type { StyleEngine } from "./types";
import { terminalEngine } from "./styles/terminal/engine";
import { glassEngine } from "./styles/glass/engine";
import { glitchEngine } from "./styles/glitch/engine";
import { gradientEngine } from "./styles/gradient/engine";
import { notebookEngine } from "./styles/notebook/engine";
import { blueprintEngine } from "./styles/blueprint/engine";
import { neuralEngine } from "./styles/neural/engine";
import { polaroidEngine } from "./styles/polaroid/engine";

const engines: Record<string, StyleEngine> = {
  terminal: terminalEngine,
  glass: glassEngine,
  glitch: glitchEngine,
  gradient: gradientEngine,
  notebook: notebookEngine,
  blueprint: blueprintEngine,
  neural: neuralEngine,
  polaroid: polaroidEngine,
};

/** Get a style engine by slug. Returns null if not found. */
export function getEngine(slug: string): StyleEngine | null {
  return engines[slug] ?? null;
}

/** Check if a style engine exists */
export function hasEngine(slug: string): boolean {
  return slug in engines;
}
