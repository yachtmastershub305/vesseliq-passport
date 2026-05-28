import type { Passport } from "@/lib/passport-types";
import type { ViewState } from "@/lib/passport-view";
import { fmtDate } from "@/lib/format";
import { SealStamp } from "@/app/components/SealStamp";
import { StateChip } from "./StateChip";

export function PassportHeader({
  data,
  view,
}: {
  data: Passport;
  view: ViewState;
}) {
  const v = data.vessel;
  const provenanceCount = data.provenance.length;

  return (
    <section className="relative">
      <div className="border-t border-b py-2" style={{ borderColor: "var(--brand-line-strong)" }}>
        <div className="flex items-center justify-between gap-4 text-[10.5px]">
          <span className="folio">Passport no. {data._meta.passport_id}</span>
          <span className="folio hidden sm:inline">Schema {data._meta.schema_version}</span>
          <span className="folio">Issued {data._meta.issued}</span>
        </div>
      </div>

      <div className="pt-12 pb-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="label">Vessel of record</span>
              <StateChip state={view} />
            </div>
            <h1 className="mt-4 display text-[68px] sm:text-[96px] text-ink leading-[0.92]">
              {v.name}
            </h1>
            <div className="mt-4 font-serif-italic text-[24px] sm:text-[28px] text-ink/85">
              {v.make} {v.model} <span className="text-muted">,</span> {v.model_year}
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5">
              <Field label="HIN" value={v.hin} mono />
              <Field label="Catalog" value={v.catalog_id} mono />
              <Field label="MMSI" value={v.mmsi ?? "—"} mono />
              <Field label="Off. no." value={v.official_number_us ?? "—"} mono />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              {v.verification_status === "verified" && view !== "transfer" && (
                <span className="stamp-chip stamp-chip-teal">Verified</span>
              )}
              {v.flag_state && <span className="stamp-chip">{v.flag_state}</span>}
              {v.classification_society && (
                <span className="stamp-chip">Class · {v.classification_society}</span>
              )}
              {v.doc_status === "active" && v.doc_type && (
                <span className="stamp-chip">Doc · {v.doc_type}</span>
              )}
              {v.doc_expiration_date && (
                <span className="stamp-chip">Expires {fmtDate(v.doc_expiration_date)}</span>
              )}
              <span className="stamp-chip">{provenanceCount} verified sources</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="flex flex-col items-start lg:items-end">
              <SealStamp pct={Math.round(v.confidence_pct)} size={184} />
              <div className="mt-5 max-w-[260px] lg:text-right">
                <div className="label">Score weighting</div>
                <p className="mt-2 text-[12px] leading-[1.6] text-ink/70">
                  Accuracy {data.scoring.weights.accuracy}, provenance{" "}
                  {data.scoring.weights.provenance}, completeness{" "}
                  {data.scoring.weights.completeness}, consistency{" "}
                  {data.scoring.weights.consistency}, timeliness{" "}
                  {data.scoring.weights.timeliness}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="rule-strong" />
    </section>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className={`mt-2 text-ink ${mono ? "font-mono text-[13px]" : "text-[15px]"}`}>
        {value}
      </div>
    </div>
  );
}
