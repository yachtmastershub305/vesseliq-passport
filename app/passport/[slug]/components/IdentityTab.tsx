import type { Passport } from "@/lib/passport-types";
import { getFactMeta } from "@/lib/passport-data";
import { fmtDate, fmtNumber, titleCase } from "@/lib/format";
import { LedgerRow, SectionTitle, ScoreBar, Subhead } from "./Primitives";

export function IdentityTab({ data }: { data: Passport }) {
  const v = data.vessel;
  const b = data.scoring.breakdown;
  const m = (path: string) => getFactMeta(data, path);

  return (
    <div>
      <SectionTitle
        numeral="I"
        eyebrow="Identity"
        title="Who, what, and under whose flag."
      />

      <div className="grid grid-cols-12 gap-x-10 gap-y-12">
        <div className="col-span-12 lg:col-span-7 space-y-12">
          <div>
            <Subhead numeral="i.a" label="Core identity" />
            <dl>
              <LedgerRow k="Vessel name" v={v.name} />
              <LedgerRow k="Builder" v={v.builder} meta={m("vessel.builder")} />
              <LedgerRow k="Make" v={v.make} meta={m("vessel.make")} />
              <LedgerRow k="Model" v={v.model} meta={m("vessel.model")} />
              <LedgerRow k="Model year" v={fmtNumber(v.model_year)} meta={m("vessel.model_year")} />
              <LedgerRow k="Vessel type" v={titleCase(v.vessel_type)} meta={m("vessel.vessel_type")} />
              <LedgerRow k="Hull material" v={v.hull_material} meta={m("vessel.hull_material")} />
            </dl>
          </div>

          <div>
            <Subhead numeral="i.b" label="Identifiers" />
            <dl>
              <LedgerRow k="HIN" v={v.hin} mono meta={m("vessel.hin")} />
              <LedgerRow k="MMSI" v={v.mmsi} mono meta={m("vessel.mmsi")} />
              <LedgerRow k="Official no., US" v={v.official_number_us} mono meta={m("vessel.official_number_us")} />
              <LedgerRow k="Manufacturer MIC" v={v.manufacturer_mic} mono meta={m("vessel.manufacturer_mic")} />
              <LedgerRow k="Catalog ID" v={v.catalog_id} mono meta={m("vessel.catalog_id")} />
              <LedgerRow k="Vessel ID" v={v.vessel_id} mono meta={m("vessel.vessel_id")} />
              {v.vessel_version_id && (
                <LedgerRow
                  k="Vessel version"
                  v={v.vessel_version_id}
                  mono
                  meta={m("vessel.vessel_id")}
                />
              )}
            </dl>
          </div>

          <div>
            <Subhead numeral="i.c" label="Dimensions" />
            <dl>
              <LedgerRow k="LOA" v={`${fmtNumber(v.loa_m, { maximumFractionDigits: 2 })} m`} meta={m("vessel.loa_m")} />
              <LedgerRow k="Beam" v={`${fmtNumber(v.beam_m, { maximumFractionDigits: 2 })} m`} meta={m("vessel.beam_m")} />
              <LedgerRow k="Draft" v={`${fmtNumber(v.draft_m, { maximumFractionDigits: 2 })} m`} meta={m("vessel.draft_m")} />
              <LedgerRow k="Depth" v={`${fmtNumber(v.depth_m, { maximumFractionDigits: 2 })} m`} meta={m("vessel.depth_m")} />
            </dl>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-12">
          <div>
            <Subhead numeral="i.d" label="Regulatory" />
            <dl>
              <LedgerRow k="Flag state" v={v.flag_state} meta={m("vessel.flag_state")} />
              <LedgerRow k="Class society" v={v.classification_society} meta={m("vessel.classification_society")} />
              <LedgerRow k="Documented" v={v.documented ? titleCase(v.documented) : "—"} meta={m("vessel.documented")} />
              <LedgerRow k="Doc status" v={v.doc_status ? titleCase(v.doc_status) : "—"} meta={m("vessel.doc_status")} />
              <LedgerRow k="Doc type" v={v.doc_type} meta={m("vessel.doc_type")} />
              <LedgerRow k="Doc issued" v={fmtDate(v.doc_issued_date)} meta={m("vessel.doc_issued_date")} />
              <LedgerRow k="Doc expires" v={fmtDate(v.doc_expiration_date)} meta={m("vessel.doc_expiration_date")} />
              <LedgerRow k="Service status" v={v.service_status ? titleCase(v.service_status) : "—"} meta={m("vessel.service_status")} />
              <LedgerRow k="Detail" v={v.service_status_detail} meta={m("vessel.service_status_detail")} />
            </dl>
          </div>

          <div>
            <Subhead numeral="i.e" label="Confidence breakdown" />
            <p className="text-[13.5px] text-ink/70 leading-[1.6] mb-5 max-w-md">
              The score is weighted across five facets. Each facet is graded against the available
              evidence on this hull. Per-fact tier pills appear in the right column of each ledger
              row, T1 government registry through T4 owner submitted.
            </p>
            <div>
              <ScoreBar label="Identity" value={b.identity} />
              <ScoreBar label="Equipment" value={b.equipment} />
              <ScoreBar label="Maintenance" value={b.maintenance} />
              <ScoreBar label="Provenance" value={b.provenance} />
              <ScoreBar label="Documents" value={b.documents} />
            </div>

            <TierLegend />
          </div>
        </div>
      </div>
    </div>
  );
}

function TierLegend() {
  const entries: { tier: 1 | 2 | 3 | 4; label: string }[] = [
    { tier: 1, label: "Government registry" },
    { tier: 2, label: "OEM commissioning" },
    { tier: 3, label: "Verified partner" },
    { tier: 4, label: "Owner submitted" },
  ];
  return (
    <div
      className="mt-7 pt-5 border-t"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="label">Tier legend</div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
        {entries.map((e) => (
          <div key={e.tier} className="flex items-center gap-2">
            <span className={`tier-pill tier-${e.tier}`}>
              <span className="tier-dot" aria-hidden="true" />
              <span className="tier-num">T{e.tier}</span>
            </span>
            <span className="text-ink/75">{e.label}</span>
          </div>
        ))}
      </dl>
    </div>
  );
}
