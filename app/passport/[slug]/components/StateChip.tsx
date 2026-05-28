import type { ViewState } from "@/lib/passport-view";

export function StateChip({ state }: { state: ViewState }) {
  if (state === "full") {
    return (
      <span className="stamp-chip stamp-chip-teal">
        <CheckMark />
        Certified
      </span>
    );
  }
  if (state === "transfer") {
    return (
      <span
        className="stamp-chip"
        style={{ borderStyle: "dashed", borderColor: "var(--brand-ink)" }}
      >
        <PulseDot />
        Transfer pending
      </span>
    );
  }
  return (
    <span className="stamp-chip">
      <LockMark />
      Preview, locked
    </span>
  );
}

function CheckMark() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
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
  );
}

function LockMark() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="3" y="6" width="8" height="6" rx="0.75" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5 6V4.5a2 2 0 0 1 4 0V6" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function PulseDot() {
  return (
    <span className="relative inline-flex items-center" aria-hidden="true">
      <span className="block h-1.5 w-1.5 rounded-full bg-ink" />
    </span>
  );
}
