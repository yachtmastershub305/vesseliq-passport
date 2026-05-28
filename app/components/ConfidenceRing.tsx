export function ConfidenceRing({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--brand-line-strong)" strokeWidth="3" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--brand-teal)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[15px] font-medium leading-none">{pct}</span>
        <span className="font-mono text-[8px] tracking-wider uppercase text-muted mt-0.5">conf</span>
      </div>
    </div>
  );
}
