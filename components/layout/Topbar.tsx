interface TopbarProps {
  breadcrumbs: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export default function Topbar({ breadcrumbs, children }: TopbarProps) {
  return (
    <div className="h-[var(--topbar-h)] min-h-[var(--topbar-h)] bg-bg-surface border-b border-border-default flex items-center justify-between px-4 md:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] pl-10 md:pl-0">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-fg-mute text-[11px]">→</span>
            )}
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-fg-3 no-underline hover:text-fg transition-colors duration-200"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="text-fg font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Actions */}
      {children && (
        <div className="flex items-center gap-2 md:gap-3">{children}</div>
      )}
    </div>
  );
}
