import Link from "next/link";
import type { PassportLifecycleResult } from "@/lib/backend";
import { fmtDate, titleCase } from "@/lib/format";
import type { Passport } from "@/lib/passport-types";

export function TransferBand({
  slug,
  passport,
  fromParty = "Recorded holder",
  toParty = "Acquiring party",
  demoEnabled = false,
  lifecycle = null,
}: {
  slug: string;
  passport: Passport;
  lifecycle?: PassportLifecycleResult | null;
  fromParty?: string;
  toParty?: string;
  demoEnabled?: boolean;
}) {
  const demoSuffix = demoEnabled ? "&demo=1" : "";
  const transferStatus = lifecycle?.status ? titleCase(lifecycle.status.replaceAll("_", " ")) : "Transfer pending";
  const initiatedAt = lifecycle?.transfer_requested_at ?? passport._meta.lifecycle?.archived_at ?? passport._meta.issued;
  const lifecycleFrom = lifecycle?.old_holder_label ?? fromParty;
  const lifecycleTo = lifecycle?.new_holder_label ?? toParty;

  return (
    <section
      className="border-t border-b py-9"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-start">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-baseline gap-3">
            <span className="font-serif-italic text-[15px] text-muted">§</span>
            <span className="label-ink">Status</span>
          </div>
          <h2 className="mt-3 display text-[34px] sm:text-[44px] leading-[1.04] text-ink max-w-2xl">
            Transfer in progress. <span className="display-italic">This Passport remains</span> read only until the transfer workflow completes.
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.6] text-ink/75 max-w-xl">
            The current public record is preserved while VesselIQ completes the ownership transition. Full access and any successor Passport remain backend-controlled until this request is resolved.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <dl
            className="border p-5"
            style={{ borderColor: "var(--brand-line-strong)", backgroundColor: "var(--brand-paper-2)" }}
          >
            <Row k="Status" v={transferStatus} />
            <Row k="From" v={lifecycleFrom} />
            <Row k="To" v={lifecycleTo} mono />
            <Row k="Initiated" v={fmtDate(initiatedAt)} />
            <Row k="Asset" v="Read only" />
          </dl>
          <p className="mt-3 text-[11.5px] text-muted leading-[1.5] max-w-xs">
            Settlement and successor issuance are not exposed on this public page until the backend marks the transfer complete.
          </p>
          {demoEnabled && (
            <div
              className="mt-5 border-t border-dashed pt-4 no-print"
              style={{ borderColor: "var(--brand-line-strong)" }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="label">Demo affordance</span>
                <span className="font-mono text-[10px] text-muted">internal only</span>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-3">
                <Link
                  href={`/passport/${slug}?view=preview${demoSuffix}`}
                  className="inline-flex items-baseline gap-2 label hover:text-ink transition-colors"
                >
                  ← Return to preview
                </Link>
              </div>
            </div>
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
      style={{ borderColor: "var(--brand-line)" }}
    >
      <dt className="label">{k}</dt>
      <dd className={`text-ink text-[13.5px] ${mono ? "font-mono text-[12.5px]" : ""}`}>{v}</dd>
    </div>
  );
}
