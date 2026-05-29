import type { Passport } from "@/lib/passport-types";
import { SealStamp } from "@/app/components/SealStamp";
import { PASSPORT_SLUG } from "@/lib/passport-data";
import { AutoVerify } from "../components/AutoVerify";

export function Panel3Verify({ data }: { data: Passport }) {
  const v = data.vessel;
  if (!data.signature) return null;

  return (
    <article>
      <div
        className="border-t border-b py-2"
        style={{ borderColor: "var(--brand-line-strong)" }}
      >
        <div className="flex items-center justify-between gap-4 text-[10.5px]">
          <span className="folio">Passport no. {data._meta.passport_id}</span>
          <span className="folio hidden sm:inline">
            Schema {data._meta.schema_version}
          </span>
          <span className="folio">Issued {data._meta.issued}</span>
        </div>
      </div>

      <div className="pt-8 pb-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-start">
          <div className="col-span-12 sm:col-span-7">
            <div className="label">Vessel of record</div>
            <h1 className="mt-3 display text-[44px] sm:text-[56px] text-ink leading-[0.95]">
              {v.name}
            </h1>
            <div className="mt-3 font-serif-italic text-[18px] sm:text-[22px] text-ink/85">
              {v.make} {v.model}, {v.model_year}
            </div>
            <div className="mt-6 font-mono text-[13px] text-ink/85 space-y-1">
              <div>
                HIN <span className="text-ink">{v.hin}</span>
              </div>
              <div>
                MMSI <span className="text-ink">{v.mmsi ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-5">
            <div className="flex flex-col items-start sm:items-end">
              <SealStamp pct={Math.round(v.confidence_pct)} size={140} />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--brand-line-strong)" }}>
          <AutoVerify slug={PASSPORT_SLUG} signature={data.signature} />
        </div>
      </div>
    </article>
  );
}
