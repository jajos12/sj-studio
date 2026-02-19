"use client";

import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "icon";
  size?: "sm" | "md";
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-all duration-200 ease-out cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-accent text-black hover:opacity-85 hover:shadow-glow border-none",
  ghost:
    "bg-transparent text-fg-2 border border-border-default hover:bg-bg-hover hover:text-fg hover:border-border-hover",
  icon: "bg-transparent text-fg-3 border-none hover:text-fg hover:bg-bg-hover rounded-md",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs tracking-wide",
  md: "px-5 py-2.5 text-[13px] tracking-wide",
};

export default function Button({
  variant = "ghost",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
