import type { ReactNode } from "react";
import { SectionTitle } from "./Primitives";

export type TeaserStat = { label: string; value: string };

export function LockedSection({
  numeral,
  eyebrow,
  title,
  blurb,
  stats,
  preview,
}: {
  numeral: string;
  eyebrow: string;
  title: string;
  blurb: string;
  stats: TeaserStat[];
  preview?: ReactNode;
}) {
  return (
    <div>
      <SectionTitle numeral={numeral} eyebrow={eyebrow} title={title} />

      <p className="max-w-2xl text-[15.5px] leading-[1.6] text-ink/80 mb-10">{blurb}</p>

      <div className="grid grid-cols-12 gap-x-10 gap-y-10">
        <div className="col-span-12 lg:col-span-5">
          <div className="border-t pt-5" style={{ borderColor: "var(--brand-line-strong)" }}>
            <div className="label">Summary</div>
            <dl className="mt-4 space-y-1">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between gap-3 border-b py-2"
                  style={{ borderColor: "var(--brand-line)" }}
                >
                  <dt className="text-[13.5px] text-ink/85">{s.label}</dt>
                  <dd className="font-mono text-[13px] text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="relative">
            {preview && (
              <div
                aria-hidden="true"
                className="select-none pointer-events-none rounded-sm overflow-hidden"
                style={{
                  filter: "blur(6px)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 100%)",
                  maskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 100%)",
                  maxHeight: 240,
                  opacity: 0.55,
                }}
              >
                {preview}
              </div>
            )}

            <div
              className="border p-7 sm:p-8"
              style={{
                borderColor: "var(--brand-line-strong)",
                backgroundColor: "var(--brand-paper-2)",
                marginTop: preview ? -120 : 0,
                position: "relative",
              }}
            >
              <div className="flex items-center gap-3">
                <LockGlyph />
                <span className="label-ink">Locked</span>
              </div>
              <h4 className="mt-4 font-serif-italic text-[24px] leading-[1.2] text-ink max-w-md">
                Unlock the full Passport to view this section.
              </h4>
              <p className="mt-3 text-[14px] leading-[1.6] text-ink/75 max-w-md">
                The full record opens to the buyer on transfer. Pricing and the transfer flow are
                shown above.
              </p>
              <div className="mt-5">
                <a href="#acquire" className="cta-secondary">
                  See the acquire offer
                  <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="3.5" y="7.5" width="11" height="8.5" rx="1" fill="none" stroke="var(--brand-ink)" strokeWidth="1.2" />
      <path d="M6 7.5V5.25a3 3 0 0 1 6 0V7.5" fill="none" stroke="var(--brand-ink)" strokeWidth="1.2" />
      <circle cx="9" cy="11.7" r="0.9" fill="var(--brand-ink)" />
      <rect x="8.55" y="11.7" width="0.9" height="2.2" fill="var(--brand-ink)" />
    </svg>
  );
}
