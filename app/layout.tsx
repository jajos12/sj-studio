"use client";

import { useState } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>SJ Studio</title>
        <meta
          name="description"
          content="Premium terminal-aesthetic content creation studio for Telegram"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex h-screen">
        {/* Mobile hamburger button */}
        <button
          className="fixed top-3 left-3 z-50 md:hidden w-10 h-10 flex items-center justify-center rounded-md bg-bg-surface border border-border-default text-fg-3 hover:text-fg hover:bg-bg-hover transition-colors duration-200 cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <span className="text-lg">{sidebarOpen ? "✕" : "☰"}</span>
        </button>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
