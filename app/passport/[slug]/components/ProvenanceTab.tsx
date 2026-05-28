import type { Passport, ProvenanceRecord } from "@/lib/passport-types";
import { fmtDate, titleCase } from "@/lib/format";
import { Chip } from "./Primitives";

const SOURCE_TYPE_LABEL: Record<string, string> = {
  government_registry: "Government registry",
  oem_data: "OEM data",
  user_submission: "Verified partner submission",
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
    <div className="space-y-8">
      <header className="rounded-xl border hairline bg-paper p-7">
        <div className="font-mono text-[10.5px] tracking-wider uppercase text-teal-deep">
          The trust model
        </div>
        <h3 className="mt-2 text-[22px] tracking-tight text-ink leading-[1.2]">
          Every fact on this Passport traces to{" "}
          <span className="font-serif-italic">a source, a license, and a timestamp.</span>
        </h3>
        <p className="mt-4 text-[14.5px] leading-[1.6] text-ink/75 max-w-2xl">
          Government registry data is public domain. OEM and service data is provenanced to the
          partner who submitted it, with the work order or commissioning reference attached. If you
          can read it on the Passport, you can see where it came from.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Chip tone="teal">{records.length} provenance records</Chip>
          {Object.entries(byType).map(([t, n]) => (
            <Chip key={t}>
              {SOURCE_TYPE_LABEL[t] ?? titleCase(t)}, {n}
            </Chip>
          ))}
        </div>
      </header>

      <section>
        <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted mb-4">
          Data lineage
        </div>
        <div className="space-y-3">
          {records.map((r) => (
            <ProvenanceRow key={r.provenance_id} r={r} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProvenanceRow({ r }: { r: ProvenanceRecord }) {
  const sourceLabel = SOURCE_TYPE_LABEL[r.source_type] ?? titleCase(r.source_type);
  const entityLabel = ENTITY_LABEL[r.entity] ?? titleCase(r.entity);

  return (
    <article className="rounded-xl border hairline bg-paper p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted">
            Covers {entityLabel}
          </div>
          <h4 className="mt-1 text-[16.5px] tracking-tight text-ink">{r.payload_summary}</h4>
        </div>
        <Chip tone="teal">{sourceLabel}</Chip>
      </div>

      <dl className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
        <KV k="Source name" v={<span className="font-mono text-[12px]">{r.source_name}</span>} />
        <KV k="Source URI" v={<span className="font-mono text-[11.5px] break-all">{r.source_uri ?? "—"}</span>} />
        <KV
          k="Source URL"
          v={
            r.source_url ? (
              <a
                href={r.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11.5px] underline decoration-teal underline-offset-4 break-all"
              >
                {r.source_url}
              </a>
            ) : (
              "—"
            )
          }
        />
        <KV k="License" v={titleCase(r.license)} />
        <KV k="Captured at" v={fmtDate(r.captured_at)} />
        <KV k="Captured by" v={<span className="font-mono text-[11.5px]">{r.captured_by}</span>} />
        <KV k="Record ID" v={<span className="font-mono text-[11.5px]">{r.provenance_id}</span>} />
      </dl>
    </article>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b hairline pb-1.5">
      <span className="font-mono text-[10.5px] tracking-wider uppercase text-muted shrink-0">
        {k}
      </span>
      <span className="text-ink text-right">{v}</span>
    </div>
  );
}
