"use client";

import Link from "next/link";
import { VIEW_LABELS, VIEW_STATES, type ViewState } from "@/lib/passport-view";

export function DemoSwitcher({ slug, active }: { slug: string; active: ViewState }) {
  return (
    <div
      className="fixed bottom-5 right-5 z-40 no-print"
      aria-label="Demo state switcher"
    >
      <div
        className="border shadow-[0_8px_30px_-12px_rgba(12,17,23,0.25)]"
        style={{ borderColor: "var(--brand-line-strong)", backgroundColor: "var(--brand-paper-3)" }}
      >
        <div className="px-3 pt-2.5 pb-1.5 flex items-baseline justify-between gap-3 border-b" style={{ borderColor: "var(--brand-line)" }}>
          <span className="label">Demo view</span>
          <span className="font-mono text-[10px] text-muted">internal</span>
        </div>
        <div className="flex">
          {VIEW_STATES.map((state) => {
            const isActive = state === active;
            return (
              <Link
                key={state}
                href={`/passport/${slug}?view=${state}`}
                className={`px-3 py-2.5 text-[12.5px] tracking-tight transition-colors ${
                  isActive ? "text-ink" : "text-ink/55 hover:text-ink/85"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={isActive ? "border-b border-ink pb-0.5" : ""}>
                  {VIEW_LABELS[state]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
