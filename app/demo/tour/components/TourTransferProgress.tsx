const STEPS = [
  "Request submitted",
  "Broker authorization",
  "Payment",
  "Transfer complete",
];

export function TourTransferProgress({ currentStep = 3 }: { currentStep?: number }) {
  return (
    <div
      className="border-t border-b"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="py-2.5 flex items-center justify-between gap-3 sm:gap-4">
        <span className="label-ink shrink-0">Transfer in progress</span>

        {/* Mobile compressed */}
        <div className="sm:hidden flex items-center gap-2 min-w-0">
          <StepDot done={false} current={true} />
          <span className="text-[12px] text-ink truncate">
            <span className="font-mono text-muted-2">{currentStep + 1}/4</span>{" "}
            {STEPS[currentStep]}
          </span>
        </div>

        {/* sm and up full trail */}
        <ol className="hidden sm:flex items-center gap-x-2 gap-y-2 flex-wrap">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            const labelClass = isDone
              ? "text-ink/70"
              : isCurrent
              ? "text-ink"
              : "text-muted-2";
            return (
              <li key={step} className="flex items-center gap-1.5">
                <StepDot done={isDone} current={isCurrent} />
                <span className={`text-[12.5px] ${labelClass}`}>{step}</span>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="text-muted-2 px-1.5 text-[10px]"
                  >
                    →
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function StepDot({ done, current }: { done: boolean; current: boolean }) {
  if (done) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
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
  if (current) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle
          cx="7"
          cy="7"
          r="6"
          fill="none"
          stroke="var(--brand-ink)"
          strokeWidth="1.4"
          strokeDasharray="2 2"
        />
        <circle cx="7" cy="7" r="2" fill="var(--brand-ink)" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="var(--brand-line-strong)"
        strokeWidth="1"
      />
    </svg>
  );
}
