import Link from "next/link";
import type { PassportLifecycleResult } from "@/lib/backend";
import { fmtDate } from "@/lib/format";
import type { Passport } from "@/lib/passport-types";

export function RevokedBand({
  slug,
  passport,
  isSample = false,
  demoEnabled = false,
  lifecycle = null,
}: {
  slug: string;
  passport: Passport;
  lifecycle?: PassportLifecycleResult | null;
  isSample?: boolean;
  demoEnabled?: boolean;
}) {
  const demoSuffix = demoEnabled ? "&demo=1" : "";
  return (
    <section
      className="border-t border-b py-9"
      style={{
        borderColor: "rgb(150, 25, 25)",
        backgroundColor: "rgba(180, 30, 30, 0.04)",
      }}
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-start">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-baseline gap-3">
            <span
              className="font-serif-italic text-[15px]"
              style={{ color: "rgb(150, 25, 25)" }}
            >
              §
            </span>
            <span
              className="label-ink"
              style={{ color: "rgb(150, 25, 25)" }}
            >
              Withdrawn
            </span>
          </div>
          <h2 className="mt-3 display text-[34px] sm:text-[44px] leading-[1.04] text-ink max-w-2xl">
            This Passport was <span className="display-italic">invalidated and withdrawn.</span>
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.6] text-ink/80 max-w-xl">
            VesselIQ revoked this record. The cryptographic signature is preserved for audit, but the public data should no longer be relied on. Public verification of this Passport returns 410 Gone.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <dl
            className="border p-5"
            style={{
              borderColor: "rgb(150, 25, 25)",
              backgroundColor: "var(--brand-paper-3)",
            }}
          >
            <Row k="Status" v="Revoked" />
            <Row k="Revoked at" v={fmtDate(lifecycle?.revoked_at)} />
            <Row k="Reason" v={lifecycle?.revoked_reason ?? "Withdrawn from active use"} />
            <Row k="Public endpoint" v="Returns 410 Gone" mono />
          </dl>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 no-print">
            <Link href="/" className="cta-secondary">
              Look up another HIN
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
              href={`/passport/${slug}?view=preview${demoSuffix}`}
              className="label hover:text-ink transition-colors"
            >
              ← Return to preview
            </Link>
          </div>
          {isSample && (
            <p className="mt-3 text-[11px] text-muted leading-[1.5]">
              Sample, the revocation is illustrative only.
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
      style={{ borderColor: "rgba(150, 25, 25, 0.18)" }}
    >
      <dt className="label">{k}</dt>
      <dd className={`text-ink text-[13.5px] ${mono ? "font-mono text-[12.5px]" : ""}`}>{v}</dd>
    </div>
  );
}
