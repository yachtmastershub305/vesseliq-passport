"use client";

import { useState, type ReactNode } from "react";

const TAB_KEYS = ["identity", "equipment", "maintenance", "telemetry", "provenance"] as const;
export type TabKey = (typeof TAB_KEYS)[number];

const ENTRIES: { key: TabKey; numeral: string; label: string }[] = [
  { key: "identity", numeral: "I", label: "Identity" },
  { key: "equipment", numeral: "II", label: "Equipment" },
  { key: "maintenance", numeral: "III", label: "Maintenance" },
  { key: "telemetry", numeral: "IV", label: "Telemetry" },
  { key: "provenance", numeral: "V", label: "Provenance" },
];

export function PassportTabs({
  panels,
  lockedTabs,
}: {
  panels: Record<TabKey, ReactNode>;
  lockedTabs?: TabKey[];
}) {
  const [active, setActive] = useState<TabKey>("identity");
  const lockedSet = new Set(lockedTabs ?? []);

  return (
    <div>
      <div
        className="sticky top-0 z-20 backdrop-blur-md border-b no-print"
        style={{
          backgroundColor: "rgba(239,233,218,0.88)",
          borderColor: "var(--brand-line-strong)",
        }}
      >
        <div className="py-3 overflow-x-auto">
          <div role="tablist" aria-label="Passport sections" className="flex items-baseline gap-x-7 sm:gap-x-10 whitespace-nowrap">
            <span className="label hidden sm:inline">Table of contents</span>
            {ENTRIES.map((entry) => {
              const isActive = active === entry.key;
              const isLocked = lockedSet.has(entry.key);
              return (
                <button
                  key={entry.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(entry.key)}
                  className={`group inline-flex items-baseline gap-2 pb-1 transition-colors ${
                    isActive ? "text-ink" : "text-ink/50 hover:text-ink/85"
                  }`}
                >
                  <span className={`font-serif-italic text-[14px] ${isActive ? "text-ink" : "text-muted-2"}`}>
                    § {entry.numeral}
                  </span>
                  <span
                    className={`text-[14.5px] tracking-tight relative inline-flex items-baseline gap-1.5 ${
                      isActive ? "toc-active" : ""
                    }`}
                  >
                    {entry.label}
                    {isLocked && <TabLock />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="pt-12 pb-6" role="tabpanel">
        {panels[active]}
      </div>
    </div>
  );
}

function TabLock() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 14 14"
      aria-hidden="true"
      style={{ transform: "translateY(1px)" }}
    >
      <rect x="3" y="6" width="8" height="6" rx="0.75" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5 6V4.5a2 2 0 0 1 4 0V6" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
