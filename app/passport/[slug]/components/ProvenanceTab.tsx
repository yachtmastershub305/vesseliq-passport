import type { Passport, ProvenanceRecord } from "@/lib/passport-types";
import { fmtDate, titleCase } from "@/lib/format";
import { Chip, SectionTitle, Subhead } from "./Primitives";

const SOURCE_TYPE_LABEL: Record<string, string> = {
  government_registry: "Government registry",
  oem_data: "OEM data",
  user_submission: "Verified partner",
};

const ENTITY_LABEL: Record<string, string> = {
  vessel: "Vessel identity",
  equipment_instance: "Equipment instance",
  service_event: "Service event",
  manufacturers: "Manufacturer",
};

export function ProvenanceTab({ data }: { data: Passport }) {
  const records = data.provenance;
  const byType = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.source_type] = (acc[r.source_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <SectionTitle
        numeral="V"
        eyebrow="Provenance"
        title="Where every fact came from."
      />

      <div className="border-t pt-7 pb-9 mb-12" style={{ borderColor: "var(--brand-line-strong)" }}>
        <div className="grid grid-cols-12 gap-x-10 gap-y-6">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-serif-italic text-[24px] leading-[1.25] text-ink max-w-xl">
              Every fact on this Passport traces to a source, a license, and a timestamp.
            </p>
            <p className="mt-5 text-[15px] leading-[1.6] text-ink/80 max-w-xl">
              Government registry data is public domain. OEM and service data is provenanced to
              the partner who submitted it, with the work order or commissioning reference
              attached. If you can read it on the Passport, you can see where it came from.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className="label">Lineage at a glance</div>
            <dl className="mt-4 space-y-1">
              <Tally k="Total records" v={records.length} />
              {Object.entries(byType).map(([t, n]) => (
                <Tally key={t} k={SOURCE_TYPE_LABEL[t] ?? titleCase(t)} v={n} />
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-x-2 gap-y-2">
              {Object.keys(byType).map((t) => (
                <Chip key={t} tone="teal">
                  {SOURCE_TYPE_LABEL[t] ?? titleCase(t)}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Subhead numeral="v.a" label="Citations, in order" />

      <ol className="space-y-12">
        {records.map((r, i) => (
          <ProvenanceCitation key={r.provenance_id} r={r} index={i + 1} />
        ))}
      </ol>
    </div>
  );
}

function Tally({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b py-1.5" style={{ borderColor: "var(--brand-line)" }}>
      <span className="text-[13.5px] text-ink/85">{k}</span>
      <span className="font-mono text-[13px] text-ink">{v}</span>
    </div>
  );
}

function ProvenanceCitation({ r, index }: { r: ProvenanceRecord; index: number }) {
  const sourceLabel = SOURCE_TYPE_LABEL[r.source_type] ?? titleCase(r.source_type);
  const entityLabel = ENTITY_LABEL[r.entity] ?? titleCase(r.entity);
  const idx = String(index).padStart(2, "0");

  return (
    <article
      className="grid grid-cols-12 gap-x-6 gap-y-3 border-t pt-6"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="col-span-12 md:col-span-1">
        <div className="font-serif-italic text-[28px] leading-none text-ink">{idx}</div>
      </div>

      <div className="col-span-12 md:col-span-7">
        <div className="label">Covers {entityLabel}</div>
        <h3 className="mt-3 font-serif-italic text-[22px] leading-[1.2] text-ink">{r.payload_summary}</h3>
        <div className="mt-4">
          <Chip tone="teal">{sourceLabel}</Chip>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4">
        <dl className="space-y-1.5">
          <KV k="Source name" v={<span className="font-mono text-[12px]">{r.source_name}</span>} />
          <KV
            k="Source URI"
            v={<span className="font-mono text-[11.5px] break-all">{r.source_uri ?? "—"}</span>}
          />
          <KV
            k="Source URL"
            v={
              r.source_url ? (
                <a
                  href={r.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11.5px] border-b border-ink/40 hover:border-ink break-all"
                >
                  {r.source_url}
                </a>
              ) : (
                "—"
              )
            }
          />
          <KV k="License" v={titleCase(r.license)} />
          <KV k="Captured" v={fmtDate(r.captured_at)} />
          <KV k="By" v={<span className="font-mono text-[11.5px]">{r.captured_by}</span>} />
          <KV k="Record ID" v={<span className="font-mono text-[11.5px]">{r.provenance_id}</span>} />
        </dl>
      </div>
    </article>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b py-1.5" style={{ borderColor: "var(--brand-line)" }}>
      <span className="label shrink-0">{k}</span>
      <span className="text-ink text-right text-[13px]">{v}</span>
    </div>
  );
}
