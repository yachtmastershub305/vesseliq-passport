import type { ReactNode } from "react";

export function DataRow({
  k,
  v,
  mono,
}: {
  k: string;
  v: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 items-baseline py-2.5 border-b hairline">
      <dt className="font-mono text-[10.5px] tracking-wider uppercase text-muted">{k}</dt>
      <dd className={`text-ink text-[14px] ${mono ? "font-mono text-[13px]" : ""}`}>
        {v ?? <span className="text-muted">—</span>}
      </dd>
    </div>
  );
}

export function SectionBlock({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border hairline bg-paper p-6 sm:p-7">
      <div className="font-mono text-[10.5px] tracking-wider uppercase text-teal-deep">{eyebrow}</div>
      {title && <h3 className="mt-2 text-[19px] tracking-tight text-ink">{title}</h3>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "teal" }) {
  const cls =
    tone === "teal"
      ? "bg-teal/8 text-teal-deep border-teal/20"
      : "bg-canvas text-ink/75 border-line";
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full text-[11.5px] tracking-tight border ${cls}`}
    >
      {children}
    </span>
  );
}

export function VerifiedMark() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-teal-deep"
      title="Verified at commissioning"
    >
      <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="var(--brand-teal)" />
        <path
          d="M4.5 7.2l1.6 1.6 3.4-3.6"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Verified
    </span>
  );
}

export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10.5px] tracking-wider uppercase text-muted">{label}</span>
        <span className="font-mono text-[12px] text-ink">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-soft overflow-hidden">
        <div
          className="h-full bg-teal"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
