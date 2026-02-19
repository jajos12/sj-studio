"use client";

import Link from "next/link";

interface CardProps {
  href?: string;
  accent?: string;
  disabled?: boolean;
  index?: number;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Card({
  href,
  accent,
  disabled = false,
  index = 0,
  children,
  onClick,
}: CardProps) {
  const baseClasses = `
    group relative flex flex-col gap-3 p-6
    bg-bg-raised border border-border-default rounded-lg
    transition-all duration-200 ease-out overflow-hidden
    animate-fade-in
  `;

  const hoverClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "hover:border-border-hover hover:-translate-y-0.5 hover:shadow-lg";

  const style = {
    animationDelay: `${index * 60}ms`,
    "--card-accent": accent,
  } as React.CSSProperties;

  const content = (
    <>
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: accent }}
      />
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${hoverClasses} no-underline`}
        style={style}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`${baseClasses} ${hoverClasses}`}
      style={style}
      onClick={disabled ? undefined : onClick}
    >
      {content}
    </div>
  );
}
