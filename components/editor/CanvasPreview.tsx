"use client";

import type { RefObject } from "react";

interface CanvasPreviewProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export default function CanvasPreview({ canvasRef }: CanvasPreviewProps) {
  return (
    <div
      className="flex-1 flex items-center justify-center bg-bg-root p-4 md:p-8 overflow-auto"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="rounded-lg overflow-hidden shadow-lg border border-border-default leading-[0]"
        style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.4)" }}
      >
        <canvas
          ref={canvasRef}
          className="block max-w-full max-h-[calc(100vh-var(--topbar-h)-120px)] md:max-h-[calc(100vh-var(--topbar-h)-80px)] h-auto"
        />
      </div>
    </div>
  );
}
