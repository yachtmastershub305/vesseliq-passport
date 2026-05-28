"use client";

import { useState, type ReactNode } from "react";

const TAB_KEYS = ["identity", "equipment", "maintenance", "telemetry", "provenance"] as const;
export type TabKey = (typeof TAB_KEYS)[number];

const LABELS: Record<TabKey, string> = {
  identity: "Identity",
  equipment: "Equipment",
  maintenance: "Maintenance",
  telemetry: "Telemetry",
  provenance: "Provenance",
};

export function PassportTabs({
  panels,
}: {
  panels: Record<TabKey, ReactNode>;
}) {
  const [active, setActive] = useState<TabKey>("identity");

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-6 px-6 bg-[rgba(246,244,239,0.88)] backdrop-blur-md border-b hairline">
        <div role="tablist" aria-label="Passport sections" className="flex gap-1 overflow-x-auto">
          {TAB_KEYS.map((key) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(key)}
                className={`relative h-12 px-4 text-[13.5px] tracking-tight whitespace-nowrap transition-colors ${
                  isActive ? "text-ink" : "text-ink/55 hover:text-ink/80"
                }`}
              >
                {LABELS[key]}
                <span
                  className={`absolute left-3 right-3 -bottom-px h-[2px] rounded-full transition-colors ${
                    isActive ? "bg-teal" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="pt-8 pb-4" role="tabpanel">
        {panels[active]}
      </div>
    </div>
  );
}
