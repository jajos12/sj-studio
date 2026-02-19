"use client";

import Slider from "@/components/ui/Slider";
import type { StyleConfig } from "@/lib/types";

interface GlitchControlsProps {
  config: StyleConfig;
  onConfigChange: (key: string, value: string | number) => void;
}

export default function GlitchControls({ config, onConfigChange }: GlitchControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Slider
        label="Glitch Intensity"
        value={(config.glitch as number) ?? 50}
        min={0}
        max={100}
        onChange={(v) => onConfigChange("glitch", v)}
      />
      <Slider
        label="Noise"
        value={(config.noise as number) ?? 30}
        min={0}
        max={100}
        onChange={(v) => onConfigChange("noise", v)}
      />
      <Slider
        label="RGB Split"
        value={(config.rgbsplit as number) ?? 8}
        min={0}
        max={30}
        onChange={(v) => onConfigChange("rgbsplit", v)}
      />
    </div>
  );
}
