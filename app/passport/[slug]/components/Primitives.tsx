import type { ReactNode } from "react";

export function LedgerRow({
  k,
  v,
  mono,
}: {
  k: string;
  v: ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-[140px_1fr] gap-6 items-baseline py-3 border-b"
      style={{ borderColor: "var(--brand-line)" }}
    >
      <dt className="label">{k}</dt>
      <dd className={`text-ink text-[14.5px] ${mono ? "font-mono text-[13px]" : ""}`}>
        {v ?? <span className="text-muted">—</span>}
      </dd>
    </div>
  );
}

export function SectionTitle({
  numeral,
  eyebrow,
  title,
}: {
  numeral: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="mb-10">
      <div className="flex items-baseline gap-3">
        <span className="font-serif-italic text-[15px] text-muted">§ {numeral}</span>
        <span className="label-ink">{eyebrow}</span>
      </div>
      <h2 className="mt-4 display text-[40px] sm:text-[52px] text-ink leading-[1.02]">{title}</h2>
    </header>
  );
}

export function Subhead({ numeral, label }: { numeral: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b pb-3 mb-6" style={{ borderColor: "var(--brand-line-strong)" }}>
      <span className="font-serif-italic text-[14px] text-muted">{numeral}</span>
      <span className="label-ink">{label}</span>
    </div>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "teal" }) {
  return <span className={`stamp-chip ${tone === "teal" ? "stamp-chip-teal" : ""}`}>{children}</span>;
}

export function VerifiedMark({ note }: { note?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 label-ink text-teal-deep" title="Verified at commissioning">
      <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="var(--brand-teal)" />
        <path d="M4.5 7.2l1.6 1.6 3.4-3.6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Verified{note ? ` · ${note}` : ""}
    </span>
  );
}

export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[110px_1fr_40px] items-center gap-4 py-2 border-b" style={{ borderColor: "var(--brand-line)" }}>
      <span className="label">{label}</span>
      <span
        className="relative h-[3px] block overflow-hidden"
        style={{ backgroundColor: "rgba(12,17,23,0.08)" }}
      >
        <span
          className="absolute inset-y-0 left-0 bg-ink"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </span>
      <span className="font-mono text-[12px] text-ink text-right">{value}</span>
    </div>
  );
}
