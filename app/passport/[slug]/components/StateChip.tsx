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
      <span className="stamp-chip stamp-chip-amber" style={{ borderStyle: "dashed" }}>
        <PulseDot />
        Transfer pending
      </span>
    );
  }
  if (state === "archived") {
    return (
      <span className="stamp-chip stamp-chip-muted">
        <ArchiveGlyph />
        Archived
      </span>
    );
  }
  if (state === "revoked") {
    return (
      <span className="stamp-chip stamp-chip-rust">
        <CrossGlyph />
        Revoked
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

function ArchiveGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="2" y="3" width="10" height="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="3" y="5.5" width="8" height="6.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="5.5" y1="8.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M4.6 4.6l4.8 4.8M9.4 4.6l-4.8 4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
