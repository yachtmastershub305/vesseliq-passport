import Link from "next/link";

export function ArchivedBand({
  slug,
  isSample = false,
  demoEnabled = false,
}: {
  slug: string;
  isSample?: boolean;
  demoEnabled?: boolean;
}) {
  const demoSuffix = demoEnabled ? "&demo=1" : "";
  return (
    <section
      className="border-t border-b py-9"
      style={{
        borderColor: "var(--brand-line-strong)",
        backgroundColor: "rgba(12, 17, 23, 0.025)",
      }}
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-start">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-baseline gap-3">
            <span className="font-serif-italic text-[15px] text-muted">§</span>
            <span className="label-ink">Status</span>
          </div>
          <h2 className="mt-3 display text-[34px] sm:text-[44px] leading-[1.04] text-ink max-w-2xl">
            Archived record{" "}
            <span className="display-italic">from a prior owner.</span>
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.6] text-ink/75 max-w-xl">
            This Passport was closed when ownership transferred. It remains readable as the
            historical record of the prior holder. The vessel may have a current Passport under a
            new holder, look it up by HIN to find the active record.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <dl
            className="border p-5"
            style={{ borderColor: "var(--brand-line-strong)", backgroundColor: "var(--brand-paper-2)" }}
          >
            <Row k="Status" v="Archived, read only" />
            <Row k="Closed at" v="2026-05-12" />
            <Row k="Reason" v="Ownership transfer completed" />
            <Row k="Successor" v="See current Passport for this HIN" mono />
          </dl>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 no-print">
            <Link href="/" className="cta-secondary">
              Look up the current Passport
              <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
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
            <Link
              href={`/passport/${slug}?view=full${demoSuffix}`}
              className="label hover:text-ink transition-colors"
            >
              ← View as full record
            </Link>
          </div>
          {isSample && (
            <p className="mt-3 text-[11px] text-muted leading-[1.5]">
              Sample, dates and parties illustrative only.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3 border-b py-2"
      style={{ borderColor: "var(--brand-line)" }}
    >
      <dt className="label">{k}</dt>
      <dd className={`text-ink text-[13.5px] ${mono ? "font-mono text-[12.5px]" : ""}`}>{v}</dd>
    </div>
  );
}
