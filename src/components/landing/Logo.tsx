export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect width="26" height="26" rx="4" className="fill-primary" />
        <path
          d="M7.5 14.5L11 18L18.5 8.5"
          stroke="white"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`font-display text-sm font-bold tracking-tight ${
          onDark ? "text-surface-structural-foreground" : "text-foreground"
        }`}
      >
        Skill&nbsp;Up
      </span>
    </span>
  );
}
