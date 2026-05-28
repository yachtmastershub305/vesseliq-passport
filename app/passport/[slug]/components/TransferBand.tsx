import Link from "next/link";

export function TransferBand({
  slug,
  fromParty = "Current holder",
  toParty = "Acquiring party",
  demoEnabled = false,
}: {
  slug: string;
  fromParty?: string;
  toParty?: string;
  demoEnabled?: boolean;
}) {
  const demoSuffix = demoEnabled ? "&demo=1" : "";
  const today = new Date();
  const expected = new Date(today);
  expected.setDate(expected.getDate() + 7);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });

  return (
    <section
      className="border-t border-b py-9"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-start">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-baseline gap-3">
            <span className="font-serif-italic text-[15px] text-muted">§</span>
            <span className="label-ink">Status</span>
          </div>
          <h2 className="mt-3 display text-[34px] sm:text-[44px] leading-[1.04] text-ink max-w-2xl">
            Transfer in progress.{" "}
            <span className="display-italic">Ownership moves</span> to the new holder once payment
            clears.
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.6] text-ink/75 max-w-xl">
            The Passport is frozen while settlement completes. New service events, equipment
            additions, and provenance updates resume under the new holder once funds clear and the
            ownership record is reissued.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <dl
            className="border p-5"
            style={{ borderColor: "var(--brand-line-strong)", backgroundColor: "var(--brand-paper-2)" }}
          >
            <Row k="From" v={fromParty} />
            <Row k="To" v={toParty} mono />
            <Row k="Initiated" v={fmt(today)} />
            <Row k="Expected close" v={fmt(expected)} />
            <Row k="Asset" v="Frozen, read only" />
          </dl>
          <p className="mt-3 text-[11.5px] text-muted leading-[1.5] max-w-xs">
            Buyer identity is held in escrow until settlement, this is a placeholder for the
            demo.
          </p>
          <div
            className="mt-5 border-t border-dashed pt-4 no-print"
            style={{ borderColor: "var(--brand-line-strong)" }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="label">Demo affordance</span>
              <span className="font-mono text-[10px] text-muted">internal only</span>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-3">
              <Link
                href={`/passport/${slug}?view=full&from=completion${demoSuffix}`}
                className="inline-flex items-baseline gap-2 text-[13.5px] text-ink/85 border-b border-dashed border-ink/60 hover:border-solid hover:border-ink hover:text-ink pb-0.5 transition-colors"
              >
                Simulate completion, advance to full
              </Link>
              <Link
                href={`/passport/${slug}?view=preview${demoSuffix}`}
                className="inline-flex items-baseline gap-2 label hover:text-ink transition-colors"
              >
                ← Return to preview
              </Link>
            </div>
          </div>
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
