/* ══════════════════════════════════════════════════════
   Utility Functions — Content Studio
   ══════════════════════════════════════════════════════ */

/** Wrap text into lines of maxChars width */
export function wrapText(text: string, maxChars: number): string[] {
  if (!text) return [];
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur += " " + w;
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

/** ISO timestamp string */
export function timestamp(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

/** Export canvas to PNG download */
export function exportPNG(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement("a");
  link.download = `${filename}_${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/** Copy canvas to clipboard */
export async function copyToClipboard(
  canvas: HTMLCanvasElement,
): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) return false;
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}
