"use client";

import { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { getEngine } from "@/lib/registry";
import { STYLES } from "@/lib/styles";
import { useCanvas } from "@/hooks/useCanvas";
import { exportPNG } from "@/lib/utils";
import type { StyleConfig } from "@/lib/types";

// Field visibility resolvers per style
import { getFieldVisibility as terminalFieldVis } from "@/lib/styles/terminal/config";
import { getFieldVisibility as glassFieldVis } from "@/lib/styles/glass/config";
import { getFieldVisibility as glitchFieldVis } from "@/lib/styles/glitch/config";
import { getFieldVisibility as gradientFieldVis } from "@/lib/styles/gradient/config";
import { getFieldVisibility as notebookFieldVis } from "@/lib/styles/notebook/config";
import { getFieldVisibility as blueprintFieldVis } from "@/lib/styles/blueprint/config";
import { getFieldVisibility as neuralFieldVis } from "@/lib/styles/neural/config";
import { getFieldVisibility as polaroidFieldVis } from "@/lib/styles/polaroid/config";

// Style-specific controls
import Topbar from "@/components/layout/Topbar";
import ControlPanel from "@/components/editor/ControlPanel";
import CanvasPreview from "@/components/editor/CanvasPreview";
import TerminalControls from "@/lib/styles/terminal/controls";
import GlitchControls from "@/lib/styles/glitch/controls";
import GradientControls from "@/lib/styles/gradient/controls";

const fieldVisMap: Record<string, (tpl: string) => { headline: boolean; subtitle: boolean; tag: boolean }> = {
  terminal: terminalFieldVis,
  glass: glassFieldVis,
  glitch: glitchFieldVis,
  gradient: gradientFieldVis,
  notebook: notebookFieldVis,
  blueprint: blueprintFieldVis,
  neural: neuralFieldVis,
  polaroid: polaroidFieldVis,
};

interface EditorPageProps {
  params: Promise<{ style: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const { style } = use(params);
  const router = useRouter();
  const engine = getEngine(style);
  const meta = STYLES.find((s) => s.slug === style);

  // Redirect if engine not found
  if (!engine || !meta) {
    router.replace("/");
    return null;
  }

  return <EditorContent engine={engine} meta={meta} style={style} />;
}

// Separate component to use hooks properly after guard
function EditorContent({
  engine,
  meta,
  style,
}: {
  engine: NonNullable<ReturnType<typeof getEngine>>;
  meta: NonNullable<(typeof STYLES)[number]>;
  style: string;
}) {
  const [config, setConfig] = useState<StyleConfig>({ ...engine.defaults });
  const { canvasRef, size } = useCanvas(engine, config);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  const handleChange = useCallback(
    (key: string, value: string | number) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleExport = useCallback(() => {
    if (!canvasRef.current) return;
    exportPNG(canvasRef.current, `sudo_jajos_${style}`);
  }, [canvasRef, style]);

  const getFieldVis = fieldVisMap[style] || (() => ({ headline: true, subtitle: true, tag: true }));
  const fieldVis = getFieldVis(config.template);

  // Resolve style-specific controls
  let styleControls: React.ReactNode = null;
  if (style === "terminal") {
    styleControls = <TerminalControls config={config} onChange={handleChange} />;
  } else if (style === "glitch") {
    styleControls = <GlitchControls config={config} onConfigChange={handleChange} />;
  } else if (style === "gradient") {
    styleControls = <GradientControls config={config} onConfigChange={handleChange} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar
        breadcrumbs={[
          { label: "Gallery", href: "/" },
          { label: meta.name },
        ]}
      >
        <span className="text-xs font-mono text-fg-mute bg-bg-elevated px-2.5 py-1 rounded-sm border border-border-default hidden sm:inline">
          {size.width}×{size.height} px
        </span>
        <button
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-semibold bg-transparent text-fg-2 border border-border-default hover:bg-bg-hover hover:text-fg hover:border-border-hover transition-all duration-200 cursor-pointer"
          onClick={handleExport}
        >
          ⬇ Export PNG
        </button>
      </Topbar>

      {/* Mobile tab bar */}
      <div className="flex md:hidden border-b border-border-default bg-bg-surface">
        <button
          className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors duration-200 cursor-pointer border-b-2 ${
            mobileTab === "edit"
              ? "text-accent border-b-accent bg-accent-bg"
              : "text-fg-3 border-b-transparent hover:text-fg"
          }`}
          onClick={() => setMobileTab("edit")}
        >
          ✎ Edit
        </button>
        <button
          className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors duration-200 cursor-pointer border-b-2 ${
            mobileTab === "preview"
              ? "text-accent border-b-accent bg-accent-bg"
              : "text-fg-3 border-b-transparent hover:text-fg"
          }`}
          onClick={() => setMobileTab("preview")}
        >
          ◉ Preview
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Controls — full width on mobile, fixed on desktop */}
        <div className={`${mobileTab === "edit" ? "flex" : "hidden"} md:flex w-full md:w-auto`}>
          <ControlPanel
            title={meta.name}
            icon={meta.icon}
            iconColor={meta.accent}
            templates={engine.templates}
            themes={engine.themes}
            config={config}
            fieldVisibility={fieldVis}
            onConfigChange={handleChange}
            onExport={handleExport}
            canvasSize={size}
          >
            {styleControls}
          </ControlPanel>
        </div>

        {/* Canvas — full width on mobile, flex-1 on desktop */}
        <div className={`${mobileTab === "preview" ? "flex" : "hidden"} md:flex flex-1`}>
          <CanvasPreview canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}
