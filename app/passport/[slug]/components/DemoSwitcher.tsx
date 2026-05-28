"use client";

import Link from "next/link";
import { VIEW_STATES, type ViewState } from "@/lib/passport-view";

const SHORT_LABELS: Record<ViewState, string> = {
  preview: "Preview",
  full: "Certified",
  transfer: "Transfer",
  archived: "Archived",
  revoked: "Revoked",
};

export function DemoSwitcher({
  slug,
  active,
  liftedForStickyBar = false,
}: {
  slug: string;
  active: ViewState;
  liftedForStickyBar?: boolean;
}) {
  return (
    <div
      className={`fixed right-5 z-40 no-print ${liftedForStickyBar ? "bottom-24" : "bottom-5"}`}
      aria-label="Demo state switcher"
    >
      <div
        className="border shadow-[0_8px_30px_-12px_rgba(12,17,23,0.25)] max-w-[min(94vw,560px)]"
        style={{ borderColor: "var(--brand-line-strong)", backgroundColor: "var(--brand-paper-3)" }}
      >
        <div
          className="px-3 pt-2.5 pb-1.5 flex items-baseline justify-between gap-3 border-b"
          style={{ borderColor: "var(--brand-line)" }}
        >
          <span className="label">Demo view</span>
          <span className="font-mono text-[10px] text-muted">internal</span>
        </div>
        <div className="flex flex-wrap">
          {VIEW_STATES.map((state) => {
            const isActive = state === active;
            return (
              <Link
                key={state}
                href={`/passport/${slug}?view=${state}&demo=1`}
                className={`px-2.5 py-2 text-[12.5px] tracking-tight transition-colors ${
                  isActive ? "text-ink" : "text-ink/55 hover:text-ink/85"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={isActive ? "border-b border-ink pb-0.5" : ""}>
                  {SHORT_LABELS[state]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
