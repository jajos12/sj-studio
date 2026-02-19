/* ══════════════════════════════════════════════════════
   Terminal Style — Custom Controls
   ══════════════════════════════════════════════════════ */

"use client";

import type { StyleConfig } from "@/lib/types";
import Slider from "@/components/ui/Slider";

interface TerminalControlsProps {
  config: StyleConfig;
  onChange: (key: string, value: number) => void;
}

export default function TerminalControls({
  config,
  onChange,
}: TerminalControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Slider
        label="Scanlines"
        value={config.scanlines as number}
        min={0}
        max={100}
        suffix="%"
        onChange={(v) => onChange("scanlines", v)}
      />
      <Slider
        label="Curvature"
        value={config.curvature as number}
        min={0}
        max={20}
        onChange={(v) => onChange("curvature", v)}
      />
      <Slider
        label="Glow"
        value={config.glow as number}
        min={0}
        max={100}
        suffix="%"
        onChange={(v) => onChange("glow", v)}
      />
    </div>
  );
}
