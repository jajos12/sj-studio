/* ══════════════════════════════════════════════════════
   Shared TypeScript Types — Content Studio
   ══════════════════════════════════════════════════════ */

/** Metadata shown in the gallery card */
export interface StyleMeta {
  slug: string;
  name: string;
  icon: string;
  description: string;
  ready: boolean;
  accent: string;
  templateCount: number;
  themeCount: number;
}

/** A single color theme */
export interface Theme {
  id: string;
  name: string;
  fg: string;
  dim: string;
  glow: string; // rgba prefix like "rgba(0,255,136,"
  bg: string;
}

/** A template variant */
export interface Template {
  id: string;
  name: string;
}

/** Config passed to style render function */
export interface StyleConfig {
  template: string;
  theme: string;
  headline: string;
  subtitle: string;
  tag: string;
  [key: string]: string | number | boolean;
}

/** Interface every style engine must implement */
export interface StyleEngine {
  templates: Template[];
  themes: Theme[];
  defaults: StyleConfig;
  render: (
    canvas: HTMLCanvasElement,
    config: StyleConfig,
  ) => { width: number; height: number };
}

/** Field visibility rules */
export interface FieldVisibility {
  headline: boolean;
  subtitle: boolean;
  tag: boolean;
}
