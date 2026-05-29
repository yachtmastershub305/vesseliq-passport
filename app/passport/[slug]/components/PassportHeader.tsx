import Image from "next/image";
import type { Passport } from "@/lib/passport-types";
import type { ViewState } from "@/lib/passport-view";
import { fmtDate } from "@/lib/format";
import { SealStamp } from "@/app/components/SealStamp";
import { StateChip } from "./StateChip";
import { VerificationBlock } from "./VerificationBlock";

const VESSEL_TYPE_DISPLAY: Record<string, string> = {
  powerboat: "Motor Yacht",
  motor_yacht: "Motor Yacht",
  sailboat: "Sailing Yacht",
  sailing_yacht: "Sailing Yacht",
  catamaran: "Catamaran",
};

export function PassportHeader({
  data,
  view,
  isSample = false,
  slug,
}: {
  data: Passport;
  view: ViewState;
  isSample?: boolean;
  slug: string;
}) {
  const v = data.vessel;
  const typeDisplay = VESSEL_TYPE_DISPLAY[v.vessel_type] ?? "Vessel of record";

  const heroImage =
    typeof v.attributes?.hero_image === "string" ? (v.attributes.hero_image as string) : null;
  const heroCredit =
    typeof v.attributes?.hero_image_credit === "string"
      ? (v.attributes.hero_image_credit as string)
      : null;

  return (
    <section className="relative">
      <div
        className="border-t border-b py-2"
        style={{ borderColor: "var(--brand-line-strong)" }}
      >
        <div className="flex items-center justify-between gap-4 text-[10.5px]">
          <span className="folio">Passport no. {data._meta.passport_id}</span>
          <span className="folio hidden sm:inline">Schema {data._meta.schema_version}</span>
          <span className="folio">Issued {data._meta.issued}</span>
        </div>
      </div>

      <div className="pt-6 pb-8 sm:pt-10 sm:pb-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="label">{typeDisplay}</span>
              <StateChip state={view} />
              {isSample && (
                <span
                  className="stamp-chip"
                  style={{ borderStyle: "dashed", borderColor: "var(--brand-line-strong)" }}
                  title="Illustrative Passport for product demonstration"
                >
                  Sample
                </span>
              )}
            </div>
            <h1 className="mt-4 display text-[44px] sm:text-[68px] md:text-[80px] lg:text-[96px] text-ink leading-[0.92] break-words">
              {v.name}
            </h1>
            <div className="mt-3 sm:mt-4 font-serif-italic text-[19px] sm:text-[24px] md:text-[28px] text-ink/85">
              {v.make} {v.model} <span className="text-muted">,</span> {v.model_year}
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-5">
              <Field label="HIN" value={v.hin} mono />
              <Field label="Catalog" value={v.catalog_id} mono />
              <Field label="MMSI" value={v.mmsi ?? "—"} mono />
              <Field label="Off. no." value={v.official_number_us ?? "—"} mono />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
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
            </div>

            {heroImage && (
              <figure
                className="hero-photo-contained mt-10 relative w-full overflow-hidden border"
                style={{
                  aspectRatio: "16 / 9",
                  borderColor: "var(--brand-line-strong)",
                }}
              >
                <Image
                  src={heroImage}
                  alt={`${v.name}, ${v.make} ${v.model}, ${v.model_year}`}
                  fill
                  priority
                  sizes="(min-width: 1120px) 720px, 100vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 42%",
                  }}
                />
                {heroCredit && (
                  <figcaption
                    className="absolute right-3 bottom-3 z-10 label-ink px-2.5 py-1"
                    style={{
                      backgroundColor: "rgba(250, 246, 236, 0.92)",
                      border: "1px solid var(--brand-line-strong)",
                      backdropFilter: "blur(2px)",
                      WebkitBackdropFilter: "blur(2px)",
                    }}
                  >
                    {heroCredit}
                  </figcaption>
                )}
              </figure>
            )}
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="flex flex-col items-start lg:items-end">
              <div className="lg:hidden">
                <SealStamp pct={Math.round(v.confidence_pct)} size={140} />
              </div>
              <div className="hidden lg:block">
                <SealStamp pct={Math.round(v.confidence_pct)} size={184} />
              </div>
              <SnapshotAnchor data={data} />
              <ScoreWeighting weights={data.scoring.weights} />
              {data.signature && (
                <VerificationBlock slug={slug} signature={data.signature} />
              )}
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

function ScoreWeighting({
  weights,
}: {
  weights: Passport["scoring"]["weights"];
}) {
  const entries: { label: string; value: number; alpha: number }[] = [
    { label: "Accuracy", value: weights.accuracy, alpha: 1.0 },
    { label: "Provenance", value: weights.provenance, alpha: 0.78 },
    { label: "Completeness", value: weights.completeness, alpha: 0.58 },
    { label: "Consistency", value: weights.consistency, alpha: 0.4 },
    { label: "Timeliness", value: weights.timeliness, alpha: 0.25 },
  ];

  let offset = 0;
  const segments = entries.map((e) => {
    const segment = { ...e, x: offset };
    offset += e.value;
    return segment;
  });

  return (
    <div
      className="mt-5 w-full max-w-[280px] lg:text-right border-t pt-4"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="label">Score weighting</div>
      <svg
        className="mt-3 block w-full"
        height="6"
        viewBox="0 0 100 6"
        preserveAspectRatio="none"
        aria-hidden="true"
        role="img"
      >
        {segments.map((s) => (
          <rect
            key={s.label}
            x={s.x}
            y={0}
            width={Math.max(0, s.value - 0.5)}
            height={6}
            fill={`rgba(12, 17, 23, ${s.alpha})`}
          />
        ))}
      </svg>
      <dl className="mt-3 space-y-1">
        {entries.map((e) => (
          <div
            key={e.label}
            className="flex items-baseline justify-between gap-3 text-[11.5px]"
          >
            <dt className="text-ink/80">{e.label}</dt>
            <dd className="font-mono text-ink">{e.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SnapshotAnchor({ data }: { data: Passport }) {
  const mintTs = data.signature?.mint_timestamp;
  const versionId = data.vessel.vessel_version_id;
  if (!mintTs && !versionId) return null;

  const ts = mintTs ? new Date(mintTs) : null;
  const datePart = ts
    ? ts.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;
  const timePart = ts
    ? ts.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        hour12: false,
      }) + " UTC"
    : null;

  const versionShort = versionId ? versionId.slice(0, 8) : null;

  return (
    <div
      className="mt-5 w-full max-w-[280px] lg:text-right border-t pt-4"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="label">Snapshot anchor</div>
      <p className="mt-2 text-[12px] leading-[1.55] text-ink/85">
        {datePart && timePart && (
          <>
            Taken <span className="font-mono">{datePart} · {timePart}</span>.<br />
          </>
        )}
        {versionId && (
          <>
            Anchored to vessel version{" "}
            <span className="font-mono text-ink" title={versionId}>
              {versionShort}…
            </span>
          </>
        )}
      </p>
    </div>
  );
}
