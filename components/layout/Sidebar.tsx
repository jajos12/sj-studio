"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { STYLES } from "@/lib/styles";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <nav
        className={`
          h-screen bg-bg-surface border-r border-border-default flex flex-col overflow-y-auto z-50
          fixed top-0 left-0 w-[260px] transition-transform duration-300 ease-in-out
          md:static md:w-[var(--sidebar-w)] md:min-w-[var(--sidebar-w)] md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-border-default no-underline"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
          <span className="text-[15px] font-bold text-fg tracking-wide">
            Studio
          </span>
        </Link>

        {/* Browse section */}
        <div className="pt-3 px-2 pb-1 flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-fg-mute uppercase tracking-[1.5px] px-3 pb-2">
            Browse
          </span>
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-2.5 py-2 px-3 rounded-sm text-[13px] no-underline ml-1 border-l-2 transition-all duration-200 ${
              pathname === "/"
                ? "bg-accent-bg text-accent border-l-accent font-medium"
                : "text-fg-3 border-l-transparent hover:bg-bg-hover hover:text-fg-2"
            }`}
          >
            <span className="w-5 text-center font-mono text-sm">⊞</span>
            <span>Gallery</span>
          </Link>
        </div>

        {/* Styles section */}
        <div className="pt-3 px-2 pb-1 flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-fg-mute uppercase tracking-[1.5px] px-3 pb-2">
            Styles
          </span>
          {STYLES.map((s) => {
            const href = `/editor/${s.slug}`;
            const isActive = pathname === href;
            return (
              <Link
                key={s.slug}
                href={s.ready ? href : "#"}
                onClick={(e) => {
                  if (!s.ready) e.preventDefault();
                  else onClose?.();
                }}
                className={`flex items-center gap-2.5 py-2 px-3 rounded-sm text-[13px] no-underline ml-1 border-l-2 transition-all duration-200 ${
                  isActive
                    ? "bg-accent-bg text-accent border-l-accent font-medium"
                    : s.ready
                      ? "text-fg-3 border-l-transparent hover:bg-bg-hover hover:text-fg-2"
                      : "text-fg-3 border-l-transparent opacity-40 cursor-not-allowed"
                }`}
              >
                <span className="w-5 text-center font-mono text-sm">
                  {s.icon}
                </span>
                <span>{s.name}</span>
                {!s.ready && (
                  <span className="ml-auto text-[9px] font-semibold text-fg-mute bg-white/[0.03] px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-border-default flex items-center justify-between">
          <span className="text-xs font-mono text-fg-mute">sudo jajos</span>
          <span className="text-[10px] font-mono text-fg-mute opacity-60">
            v0.1.0
          </span>
        </div>
      </nav>
    </>
  );
}
