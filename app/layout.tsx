import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "SJ Studio",
  description:
    "Premium terminal-aesthetic content creation studio for Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
