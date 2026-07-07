import { Search, X } from "lucide-react";
import type { ReactNode } from "react";

/* ---------- shared visual primitives for module pages ---------- */

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        {eyebrow && (
          <div className="text-[10.5px] font-medium uppercase tracking-[0.09em] text-muted-foreground/80">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 text-[24px] font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`card-surface shadow-elegant overflow-hidden ${className}`}>{children}</section>
  );
}

export function Toolbar({
  search,
  onSearch,
  placeholder = "Search…",
  left,
  right,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap px-4 pt-4 pb-3">
      <label className="group flex min-w-[220px] flex-1 max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition">
        <Search className="h-4 w-4" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70 text-foreground"
        />
        {search && (
          <button onClick={() => onSearch("")} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>
      {left}
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  );
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  onRowClick,
  empty,
}: {
  rows: T[];
  columns: { key: string; label: string; className?: string; render: (row: T) => ReactNode }[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground border-y border-border bg-surface/40">
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-2.5 font-medium ${c.className ?? ""}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center text-muted-foreground">
                {empty ?? "No records found."}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr
                key={rowKey(r)}
                onClick={() => onRowClick?.(r)}
                className={`border-b border-border last:border-b-0 hover:bg-surface-2/60 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const toneMap: Record<string, string> = {
  success: "text-success ring-[oklch(0.72_0.16_158_/_0.25)] bg-[oklch(0.72_0.16_158_/_0.09)]",
  warning: "text-warning ring-[oklch(0.78_0.15_78_/_0.25)] bg-[oklch(0.78_0.15_78_/_0.09)]",
  danger: "text-danger ring-[oklch(0.66_0.22_20_/_0.25)] bg-[oklch(0.66_0.22_20_/_0.09)]",
  info: "text-info ring-[oklch(0.72_0.13_235_/_0.25)] bg-[oklch(0.72_0.13_235_/_0.09)]",
  primary: "text-primary ring-[oklch(0.62_0.18_278_/_0.30)] bg-[oklch(0.62_0.18_278_/_0.10)]",
  muted: "text-muted-foreground ring-border bg-surface-2",
};

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "info" | "primary" | "muted";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[oklch(0.28_0.02_278)] text-[11px] font-semibold text-foreground ring-1 ring-border ${className}`}
    >
      {initials}
    </span>
  );
}

export function Kpi({
  label,
  value,
  hint,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "success" | "warning" | "danger" | "info" | "primary" | "muted";
}) {
  const color: Record<string, string> = {
    success: "oklch(0.72 0.16 158)",
    warning: "oklch(0.78 0.15 78)",
    danger: "oklch(0.66 0.22 20)",
    info: "oklch(0.72 0.13 235)",
    primary: "oklch(0.62 0.18 278)",
    muted: "oklch(0.65 0.014 265)",
  };
  return (
    <div className="card-surface shadow-elegant px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color[tone] }} />
        <div className="text-[12px] text-muted-foreground">{label}</div>
      </div>
      <div className="mt-1.5 text-[24px] font-semibold tabular-nums tracking-tight text-foreground">{value}</div>
      {hint && <div className="mt-0.5 text-[11.5px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function EmptyHint({ text }: { text: string }) {
  return <span className="text-muted-foreground text-[12px]">{text}</span>;
}
