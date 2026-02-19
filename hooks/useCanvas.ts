/* ══════════════════════════════════════════════════════
   useCanvas Hook — Content Studio
   ══════════════════════════════════════════════════════ */

"use client";

import { useRef, useEffect, useState } from "react";
import type { StyleConfig, StyleEngine } from "@/lib/types";

interface CanvasSize {
  width: number;
  height: number;
}

export function useCanvas(engine: StyleEngine, config: StyleConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const result = engine.render(canvasRef.current, config);
    setSize(result);
  }, [engine, config]);

  return { canvasRef, size };
}
