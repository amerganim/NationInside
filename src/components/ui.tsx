import { ReactNode } from "react";

export function Panel({
  children,
  className = "",
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={`panel p-5 ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between mb-4 gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-wide text-foreground">{title}</h2>}
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  icon,
  accent = "var(--accent)",
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  icon?: ReactNode;
  accent?: string;
}) {
  return (
    <div className="panel p-5 relative overflow-hidden">
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-xl"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
        {icon && <span style={{ color: accent }}>{icon}</span>}
      </div>
      <div className="mt-3 text-3xl font-bold tabular-nums">{value}</div>
      {delta && (
        <div className="mt-1 text-xs font-medium" style={{ color: accent }}>
          {delta}
        </div>
      )}
    </div>
  );
}

export function Badge({
  children,
  color = "var(--accent)",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: `${color}22`, color }}
    >
      {children}
    </span>
  );
}

/** Colour for an organisational health / activity score. */
export function scoreColor(score: number): string {
  if (score >= 70) return "var(--accent)";
  if (score >= 50) return "var(--warn)";
  return "var(--danger)";
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-[#0c1424] overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${score}%`, background: scoreColor(score) }}
      />
    </div>
  );
}

export function Avatar({
  initials,
  hue,
  size = 40,
  src,
}: {
  initials: string;
  hue: number;
  size?: number;
  src?: string | null;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={initials}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 40) % 360} 70% 35%))`,
      }}
    >
      {initials}
    </div>
  );
}

export function LiveDot({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted">
      <span className="live-dot" />
      {label ?? "LIVE"}
    </span>
  );
}
