"use client";

import type { StyleConfig } from "@/lib/types";
import { FONTS } from "./config";

interface GradientControlsProps {
  config: StyleConfig;
  onConfigChange: (key: string, value: string | number) => void;
}

export default function GradientControls({ config, onConfigChange }: GradientControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-fg-3 uppercase tracking-[1px]">
          Font Family
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FONTS.map((f) => (
            <button
              key={f.id}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 cursor-pointer border ${
                (config.fontFamily || "Outfit") === f.id
                  ? "bg-accent-bg border-accent/30 text-accent"
                  : "bg-bg-raised border-border-default text-fg-3 hover:bg-bg-hover hover:text-fg hover:border-border-hover"
              }`}
              onClick={() => onConfigChange("fontFamily", f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
