import type { Passport } from "@/lib/passport-types";
import { fmtDate, fmtNumber, titleCase } from "@/lib/format";
import { DataRow, SectionBlock, ScoreBar } from "./Primitives";

export function IdentityTab({ data }: { data: Passport }) {
  const v = data.vessel;
  const b = data.scoring.breakdown;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <SectionBlock eyebrow="Core identity">
          <dl>
            <DataRow k="Vessel name" v={v.name} />
            <DataRow k="Builder" v={v.builder} />
            <DataRow k="Make" v={v.make} />
            <DataRow k="Model" v={v.model} />
            <DataRow k="Model year" v={fmtNumber(v.model_year)} />
            <DataRow k="Vessel type" v={titleCase(v.vessel_type)} />
            <DataRow k="Hull material" v={v.hull_material} />
          </dl>
        </SectionBlock>

        <SectionBlock eyebrow="Identifiers">
          <dl>
            <DataRow k="HIN" v={v.hin} mono />
            <DataRow k="MMSI" v={v.mmsi} mono />
            <DataRow k="Official no., US" v={v.official_number_us} mono />
            <DataRow k="Manufacturer MIC" v={v.manufacturer_mic} mono />
            <DataRow k="Catalog ID" v={v.catalog_id} mono />
            <DataRow k="Vessel ID" v={v.vessel_id} mono />
          </dl>
        </SectionBlock>

        <SectionBlock eyebrow="Dimensions">
          <dl>
            <DataRow k="LOA" v={`${fmtNumber(v.loa_m, { maximumFractionDigits: 2 })} m`} />
            <DataRow k="Beam" v={`${fmtNumber(v.beam_m, { maximumFractionDigits: 2 })} m`} />
            <DataRow k="Draft" v={`${fmtNumber(v.draft_m, { maximumFractionDigits: 2 })} m`} />
            <DataRow k="Depth" v={`${fmtNumber(v.depth_m, { maximumFractionDigits: 2 })} m`} />
          </dl>
        </SectionBlock>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <SectionBlock eyebrow="Regulatory">
          <dl>
            <DataRow k="Flag state" v={v.flag_state} />
            <DataRow k="Class society" v={v.classification_society} />
            <DataRow k="Documented" v={v.documented ? titleCase(v.documented) : "—"} />
            <DataRow k="Doc status" v={v.doc_status ? titleCase(v.doc_status) : "—"} />
            <DataRow k="Doc type" v={v.doc_type} />
            <DataRow k="Doc issued" v={fmtDate(v.doc_issued_date)} />
            <DataRow k="Doc expires" v={fmtDate(v.doc_expiration_date)} />
            <DataRow k="Service status" v={v.service_status ? titleCase(v.service_status) : "—"} />
            <DataRow k="Detail" v={v.service_status_detail} />
          </dl>
        </SectionBlock>

        <SectionBlock eyebrow="Confidence breakdown" title="How the score is built">
          <div className="space-y-4">
            <ScoreBar label="Identity" value={b.identity} />
            <ScoreBar label="Equipment" value={b.equipment} />
            <ScoreBar label="Maintenance" value={b.maintenance} />
            <ScoreBar label="Provenance" value={b.provenance} />
            <ScoreBar label="Documents" value={b.documents} />
          </div>
          <p className="mt-5 text-[12.5px] text-muted leading-relaxed">
            Score weights, accuracy {data.scoring.weights.accuracy}, provenance{" "}
            {data.scoring.weights.provenance}, completeness {data.scoring.weights.completeness},
            consistency {data.scoring.weights.consistency}, timeliness{" "}
            {data.scoring.weights.timeliness}.
          </p>
        </SectionBlock>
      </div>
    </div>
  );
}
