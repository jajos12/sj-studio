"use client";

import type { Template, Theme, StyleConfig } from "@/lib/types";

interface ControlPanelProps {
  title: string;
  icon: string;
  iconColor?: string;
  templates: Template[];
  themes: Theme[];
  config: StyleConfig;
  fieldVisibility: {
    headline: boolean;
    subtitle: boolean;
    tag: boolean;
  };
  onConfigChange: (key: string, value: string | number) => void;
  onExport: () => void;
  canvasSize: { width: number; height: number };
  children?: React.ReactNode; // style-specific controls slot
}

export default function ControlPanel({
  title,
  icon,
  iconColor = "#00ff88",
  templates,
  themes,
  config,
  fieldVisibility,
  onConfigChange,
  onExport,
  canvasSize,
  children,
}: ControlPanelProps) {
  return (
    <aside className="w-[var(--controls-w)] min-w-[var(--controls-w)] bg-bg-surface border-r border-border-default overflow-y-auto p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-border-default">
        <span
          className="font-mono text-[16px] font-bold"
          style={{ color: iconColor }}
        >
          {icon}
        </span>
        <span className="text-[15px] font-semibold text-fg">{title}</span>
      </div>

      {/* Template picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-fg-3 uppercase tracking-[1px]">
          Template
        </label>
        <div className="flex flex-wrap gap-1.5">
          {templates.map((t) => (
            <button
              key={t.id}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 cursor-pointer border ${
                config.template === t.id
                  ? "bg-accent-bg border-accent/30 text-accent"
                  : "bg-bg-raised border-border-default text-fg-3 hover:bg-bg-hover hover:text-fg hover:border-border-hover"
              }`}
              onClick={() => onConfigChange("template", t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Theme picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-fg-3 uppercase tracking-[1px]">
          Color Theme
        </label>
        <div className="flex flex-col gap-1">
          {themes.map((t) => (
            <button
              key={t.id}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs transition-all duration-200 cursor-pointer border ${
                config.theme === t.id
                  ? "bg-bg-raised border-border-hover text-fg"
                  : "bg-transparent border-transparent text-fg-3 hover:bg-bg-hover hover:text-fg"
              }`}
              onClick={() => onConfigChange("theme", t.id)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: t.fg }}
              />
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content fields */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-fg-3 uppercase tracking-[1px]">
          Brand / Handle
        </label>
        <input
          className="w-full bg-bg-surface border border-border-default rounded-sm text-fg text-[13px] px-3 py-2 outline-none focus:border-border-focus transition-colors duration-200"
          type="text"
          placeholder="Your brand name..."
          maxLength={40}
          value={(config.brand as string) || ""}
          onChange={(e) => onConfigChange("brand", e.target.value)}
        />
      </div>

      {fieldVisibility.headline && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-fg-3 uppercase tracking-[1px]">
            Headline
          </label>
          <input
            className="w-full bg-bg-surface border border-border-default rounded-sm text-fg text-[13px] px-3 py-2 outline-none focus:border-border-focus transition-colors duration-200"
            type="text"
            placeholder="Your headline..."
            maxLength={80}
            value={config.headline}
            onChange={(e) => onConfigChange("headline", e.target.value)}
          />
        </div>
      )}

      {fieldVisibility.subtitle && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-fg-3 uppercase tracking-[1px]">
            Subtitle / Body
          </label>
          <textarea
            className="w-full bg-bg-surface border border-border-default rounded-sm text-fg text-[13px] px-3 py-2 outline-none focus:border-border-focus transition-colors duration-200 resize-y"
            rows={3}
            placeholder="Additional text..."
            maxLength={200}
            value={config.subtitle}
            onChange={(e) => onConfigChange("subtitle", e.target.value)}
          />
        </div>
      )}

      {fieldVisibility.tag && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-fg-3 uppercase tracking-[1px]">
            Tag
          </label>
          <input
            className="w-full bg-bg-surface border border-border-default rounded-sm text-fg text-[13px] px-3 py-2 outline-none focus:border-border-focus transition-colors duration-200"
            type="text"
            placeholder="#AI #BuildInPublic"
            maxLength={40}
            value={config.tag}
            onChange={(e) => onConfigChange("tag", e.target.value)}
          />
        </div>
      )}

      {/* Divider before style-specific controls */}
      {children && (
        <>
          <div className="h-px bg-border-default my-1" />
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-fg-3 uppercase tracking-[1px]">
              Effects
            </label>
          </div>
          {children}
        </>
      )}

      {/* Export */}
      <div className="mt-auto pt-4 border-t border-border-default flex flex-col gap-2">
        <button
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-[13px] font-semibold bg-accent text-black hover:opacity-85 hover:shadow-glow transition-all duration-200 cursor-pointer border-none"
          onClick={onExport}
        >
          ⬇ Export PNG
        </button>
        <p className="text-center text-[11px] text-fg-mute">
          {canvasSize.width}×{canvasSize.height} px
        </p>
      </div>
    </aside>
  );
}
