"use client";

import Link from "next/link";
import { STYLES } from "@/lib/styles";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function GalleryPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      {/* Hero */}
      <header className="relative mb-8 md:mb-12 py-4 md:py-8">
        {/* Glow */}
        <div
          className="absolute -top-16 left-1/2 w-[400px] h-[200px] -translate-x-1/2 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,255,136,0.15), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <h1 className="relative text-[28px] md:text-[40px] font-extrabold tracking-tight text-fg mb-2.5 pl-8 md:pl-0">
          Content Studio
        </h1>
        <p className="relative text-[14px] md:text-[15px] text-fg-3 max-w-[480px] leading-relaxed pl-8 md:pl-0">
          Generate premium post images for Telegram. Pick a style, customize,
          export.
        </p>

        <div className="relative flex items-center gap-3 mt-4 pl-8 md:pl-0">
          <Badge variant="green">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            {STYLES.filter((s) => s.ready).length} available
          </Badge>
          <span className="text-xs text-fg-mute">
            {STYLES.filter((s) => !s.ready).length} coming soon
          </span>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {STYLES.map((s, i) => (
          <Card
            key={s.slug}
            href={`/editor/${s.slug}`}
            accent={s.accent}
            disabled={!s.ready}
            index={i}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span
                className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-border-default rounded-md text-[16px] font-mono"
                style={{ color: s.accent }}
              >
                {s.icon}
              </span>
              {s.ready ? (
                <Badge variant="green">Available</Badge>
              ) : (
                <Badge variant="muted">Coming Soon</Badge>
              )}
            </div>

            {/* Content */}
            <h3 className="text-[16px] font-semibold text-fg -tracking-tight">
              {s.name}
            </h3>
            <p className="text-[13px] text-fg-3 leading-relaxed flex-1">
              {s.description}
            </p>

            {/* Meta */}
            <div className="flex gap-1.5 text-[11px] font-mono text-fg-mute">
              <span>{s.templateCount} templates</span>
              <span>·</span>
              <span>{s.themeCount} themes</span>
            </div>

            {/* CTA */}
            {s.ready && (
              <div className="text-[13px] font-medium text-fg-3 flex items-center gap-1.5 group-hover:text-accent transition-colors duration-200 mt-1">
                Open Editor <span>→</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
