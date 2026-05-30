import Link from "next/link";
import type { ReactNode } from "react";

export function TourChrome({
  step,
  totalSteps,
  stepLabel,
  annotationEyebrow,
  annotationBody,
  children,
}: {
  step: number;
  totalSteps: number;
  stepLabel: string;
  annotationEyebrow: string;
  annotationBody: string;
  children: ReactNode;
}) {
  const isFirst = step === 1;
  const isLast = step === totalSteps;
  const prevHref = `/demo/tour?step=${Math.max(1, step - 1)}`;
  const nextHref = `/demo/tour?step=${Math.min(totalSteps, step + 1)}`;

  return (
    <div className="relative">
      {/* Progress dots, sticky top */}
      <div
        className="sticky top-0 z-30 border-t border-b backdrop-blur-md no-print"
        style={{
          backgroundColor: "rgba(245, 240, 227, 0.94)",
          borderColor: "var(--brand-line-strong)",
        }}
      >
        <div className="container-doc py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="label-ink shrink-0">Tour</span>
            <span className="text-[12.5px] text-ink/85 truncate">
              <span className="font-mono text-muted-2">{step}/{totalSteps}</span>{" "}
              {stepLabel}
            </span>
          </div>
          <ol className="hidden sm:flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const idx = i + 1;
              const isDone = idx < step;
              const isCurrent = idx === step;
              return (
                <li key={idx}>
                  <Link
                    href={`/demo/tour?step=${idx}`}
                    aria-label={`Go to step ${idx}`}
                    aria-current={isCurrent ? "step" : undefined}
                    className="block w-2.5 h-2.5"
                    style={{
                      borderRadius: 9999,
                      backgroundColor: isDone
                        ? "var(--brand-ink)"
                        : isCurrent
                        ? "var(--brand-teal)"
                        : "transparent",
                      border: isCurrent
                        ? "1px solid var(--brand-teal-deep)"
                        : isDone
                        ? "1px solid var(--brand-ink)"
                        : "1px solid var(--brand-line-strong)",
                    }}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Two-column body: content + margin annotation */}
      <div className="container-doc pt-6 sm:pt-10 pb-32 sm:pb-36">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-8">{children}</div>
          <aside className="col-span-12 lg:col-span-4">
            <div
              className="lg:sticky lg:top-24 border-t pt-5"
              style={{ borderColor: "var(--brand-line-strong)" }}
            >
              <div className="label">{annotationEyebrow}</div>
              <p className="mt-4 font-serif-italic text-[22px] sm:text-[26px] text-ink leading-[1.2]">
                {annotationBody}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom navigation, sticky */}
      <div
        className="fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-md no-print"
        style={{
          backgroundColor: "rgba(245, 240, 227, 0.94)",
          borderColor: "var(--brand-line-strong)",
          boxShadow: "0 -4px 20px -10px rgba(12, 17, 23, 0.18)",
        }}
      >
        <div className="container-doc py-3 flex items-center justify-between gap-4">
          {isFirst ? (
            <Link href="/" className="cta-quiet">
              ← Exit tour
            </Link>
          ) : (
            <Link href={prevHref} className="cta-quiet">
              ← Previous
            </Link>
          )}

          <span className="hidden sm:inline label">
            <span className="font-mono">{step}</span> of{" "}
            <span className="font-mono">{totalSteps}</span> · {stepLabel}
          </span>

          {!isLast ? (
            <Link href={nextHref} className="cta-primary">
              Next
              <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            // Step 5 has the closer form with its own filled cta-primary
            // submit ("Have your Passport created"). Surfacing another
            // identical CTA in the nav duplicates the action and confuses
            // mobile especially. Show a quiet "Use the form below" hint
            // instead, the conversion lives in the form.
            <span className="label hidden sm:inline">
              The form is the close
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
