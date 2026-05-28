import type { Passport } from "@/lib/passport-types";
import { fmtDate, fmtNumber } from "@/lib/format";
import { Chip, VerifiedMark } from "./Primitives";
import { ConfidenceRing } from "@/app/components/ConfidenceRing";

export function PassportHeader({ data }: { data: Passport }) {
  const v = data.vessel;
  return (
    <section className="rounded-2xl bg-paper border hairline overflow-hidden shadow-[0_1px_0_rgba(12,17,23,0.04),0_24px_60px_-30px_rgba(12,17,23,0.18)]">
      <div className="px-6 py-3 border-b hairline flex items-center justify-between bg-canvas">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-muted">
          <span className="h-2 w-2 rounded-full bg-teal" />
          <span>{data._meta.passport_id}</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted">
          <span>schema {data._meta.schema_version}</span>
          <span aria-hidden="true">·</span>
          <span>issued {data._meta.issued}</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-8">
          <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Vessel</div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-4">
            <h1 className="text-[40px] sm:text-[48px] leading-[1.05] tracking-[-0.02em] text-ink">
              {v.name}
            </h1>
            <span className="text-[18px] text-muted">
              {v.make} <span className="font-serif-italic">{v.model}</span>, {v.model_year}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
            <Stat label="HIN" value={v.hin} mono />
            <Stat label="Catalog" value={v.catalog_id} mono />
            <Stat label="MMSI" value={v.mmsi ?? "—"} mono />
            <Stat label="Off. no." value={v.official_number_us ?? "—"} mono />
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {v.verification_status === "verified" && <VerifiedMark />}
            {v.flag_state && <Chip>{v.flag_state}</Chip>}
            {v.classification_society && <Chip>Class, {v.classification_society}</Chip>}
            {v.doc_status === "active" && v.doc_type && (
              <Chip>Documented, {v.doc_type}</Chip>
            )}
            {v.doc_expiration_date && (
              <Chip>Doc expires {fmtDate(v.doc_expiration_date)}</Chip>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-xl border hairline bg-canvas p-5 flex items-center gap-5">
            <ConfidenceRing pct={Math.round(v.confidence_pct)} />
            <div>
              <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted">
                Confidence score
              </div>
              <div className="mt-1 text-[15px] text-ink">
                {fmtNumber(v.confidence_pct, { maximumFractionDigits: 0 })} of 100
              </div>
              <p className="mt-1 text-[12px] text-muted leading-snug max-w-[180px]">
                Weighted across identity, equipment, maintenance, provenance, documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted">{label}</div>
      <div className={`mt-1 text-ink text-[14px] ${mono ? "font-mono text-[13px]" : ""}`}>
        {value}
      </div>
    </div>
  );
}
