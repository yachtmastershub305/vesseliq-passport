import { lookupHinAction } from "@/app/lookup-actions";
import { REGISTRY_DEMO_COUNT } from "@/lib/hin-registry";

export function HinLookup() {
  return (
    <div className="border-t pt-6" style={{ borderColor: "var(--brand-line-strong)" }}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="label-ink">Find a Passport by HIN</span>
        <span className="label">Start here</span>
      </div>
      <form action={lookupHinAction} className="mt-5">
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
          <label className="flex-1">
            <span className="sr-only">Hull identification number</span>
            <input
              name="hin"
              type="text"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder="Hull identification number, e.g. FCM44021J526"
              className="uinput font-mono text-[17px] tracking-wide"
              style={{ paddingTop: 12, paddingBottom: 12 }}
            />
          </label>
          <button type="submit" className="cta-primary cta-primary-lg justify-center">
            Look up Passport
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
      <p className="mt-4 text-[11.5px] text-muted leading-[1.5] max-w-md">
        Demonstration lookup, will connect to the live registry of{" "}
        <span className="font-mono text-ink/80">{REGISTRY_DEMO_COUNT}</span> demo vessel
        {REGISTRY_DEMO_COUNT === 1 ? "" : "s"} when wired. Try{" "}
        <span className="font-mono text-ink/80">FCM44021J526</span> for the demo Passport, or any
        other HIN to see the claim path.
      </p>
    </div>
  );
}
