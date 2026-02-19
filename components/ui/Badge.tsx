interface BadgeProps {
  variant?: "green" | "muted";
  children: React.ReactNode;
}

const variants = {
  green:
    "bg-accent-bg text-accent border border-accent/10",
  muted:
    "bg-white/[0.03] text-fg-mute border border-transparent",
};

export default function Badge({
  variant = "muted",
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
