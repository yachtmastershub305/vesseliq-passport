import type { Passport } from "@/lib/passport-types";
import { fmtDate, fmtNumber, titleCase } from "@/lib/format";
import { LedgerRow, SectionTitle, ScoreBar, Subhead } from "./Primitives";

export function IdentityTab({ data }: { data: Passport }) {
  const v = data.vessel;
  const b = data.scoring.breakdown;

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
              <LedgerRow k="Builder" v={v.builder} />
              <LedgerRow k="Make" v={v.make} />
              <LedgerRow k="Model" v={v.model} />
              <LedgerRow k="Model year" v={fmtNumber(v.model_year)} />
              <LedgerRow k="Vessel type" v={titleCase(v.vessel_type)} />
              <LedgerRow k="Hull material" v={v.hull_material} />
            </dl>
          </div>

          <div>
            <Subhead numeral="i.b" label="Identifiers" />
            <dl>
              <LedgerRow k="HIN" v={v.hin} mono />
              <LedgerRow k="MMSI" v={v.mmsi} mono />
              <LedgerRow k="Official no., US" v={v.official_number_us} mono />
              <LedgerRow k="Manufacturer MIC" v={v.manufacturer_mic} mono />
              <LedgerRow k="Catalog ID" v={v.catalog_id} mono />
              <LedgerRow k="Vessel ID" v={v.vessel_id} mono />
            </dl>
          </div>

          <div>
            <Subhead numeral="i.c" label="Dimensions" />
            <dl>
              <LedgerRow k="LOA" v={`${fmtNumber(v.loa_m, { maximumFractionDigits: 2 })} m`} />
              <LedgerRow k="Beam" v={`${fmtNumber(v.beam_m, { maximumFractionDigits: 2 })} m`} />
              <LedgerRow k="Draft" v={`${fmtNumber(v.draft_m, { maximumFractionDigits: 2 })} m`} />
              <LedgerRow k="Depth" v={`${fmtNumber(v.depth_m, { maximumFractionDigits: 2 })} m`} />
            </dl>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-12">
          <div>
            <Subhead numeral="i.d" label="Regulatory" />
            <dl>
              <LedgerRow k="Flag state" v={v.flag_state} />
              <LedgerRow k="Class society" v={v.classification_society} />
              <LedgerRow k="Documented" v={v.documented ? titleCase(v.documented) : "—"} />
              <LedgerRow k="Doc status" v={v.doc_status ? titleCase(v.doc_status) : "—"} />
              <LedgerRow k="Doc type" v={v.doc_type} />
              <LedgerRow k="Doc issued" v={fmtDate(v.doc_issued_date)} />
              <LedgerRow k="Doc expires" v={fmtDate(v.doc_expiration_date)} />
              <LedgerRow k="Service status" v={v.service_status ? titleCase(v.service_status) : "—"} />
              <LedgerRow k="Detail" v={v.service_status_detail} />
            </dl>
          </div>

          <div>
            <Subhead numeral="i.e" label="Confidence breakdown" />
            <p className="text-[13.5px] text-ink/70 leading-[1.6] mb-5 max-w-md">
              The score is weighted across five facets. Each facet is graded against the available
              evidence on this hull.
            </p>
            <div>
              <ScoreBar label="Identity" value={b.identity} />
              <ScoreBar label="Equipment" value={b.equipment} />
              <ScoreBar label="Maintenance" value={b.maintenance} />
              <ScoreBar label="Provenance" value={b.provenance} />
              <ScoreBar label="Documents" value={b.documents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
