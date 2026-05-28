"use client";

import { useState } from "react";
import Link from "next/link";
import { PRICING } from "@/lib/pricing";

export function AcquirePanel({ vesselName, slug }: { vesselName: string; slug: string }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="acquire"
      className="relative border-t border-b py-10"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-baseline">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-baseline gap-3">
            <span className="font-serif-italic text-[15px] text-muted">§</span>
            <span className="label-ink">Acquire this Passport</span>
          </div>
          <h2 className="mt-3 display text-[34px] sm:text-[46px] leading-[1.04] text-ink max-w-2xl">
            This vessel has a certified Passport.{" "}
            <span className="display-italic">Acquire it to unlock</span> the full verified record
            and receive ownership transfer.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-ink/75 max-w-xl">
            Payment unlocks the complete equipment register, the service ledger, the provenance
            citation index, and moves ownership of the Passport to the new holder. The seller
            retains a closing copy of the record at handoff.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:text-right">
          <div className="label">Pricing</div>
          <div className="mt-2 font-serif text-[28px] text-ink">{PRICING.transfer.headline}</div>
          <div className="mt-1 text-[12.5px] text-muted leading-[1.5] max-w-xs lg:ml-auto">
            {PRICING.transfer.suffix}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 inline-flex items-baseline gap-3 text-[16px] text-ink border-b border-ink hover:border-teal hover:text-teal-deep pb-0.5 transition-colors"
          >
            {PRICING.transfer.label}
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <CheckoutSheet
          slug={slug}
          vesselName={vesselName}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}

function CheckoutSheet({
  slug,
  vesselName,
  onClose,
}: {
  slug: string;
  vesselName: string;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        className="relative w-full max-w-lg p-7 sm:p-9"
        style={{ backgroundColor: "var(--brand-paper-3)", border: "1px solid var(--brand-line-strong)" }}
      >
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-serif-italic text-[14px] text-muted">§</span>
            <span className="label-ink">Checkout</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="label hover:text-ink transition-colors"
            aria-label="Close checkout sheet"
          >
            Close ×
          </button>
        </div>
        <h3
          id="checkout-title"
          className="mt-5 display-italic text-[30px] leading-[1.15] text-ink"
        >
          Acquire the Passport for {vesselName}.
        </h3>
        <dl className="mt-6 space-y-1">
          <Row k="Asset" v={`Passport, ${vesselName}`} />
          <Row k="Pricing" v={PRICING.transfer.headline} />
          <Row k="Includes" v="Full record, ownership transfer" />
          <Row k="Settlement" v="Within 7 business days of payment" />
        </dl>
        <div
          className="mt-7 p-4 border"
          style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}
        >
          <div className="label">Payment integration</div>
          <p className="mt-2 text-[13.5px] text-ink/85 leading-[1.55]">
            Payment integration is coming soon. For this demo, you can simulate the transfer to
            see the next state of the Passport.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="text-[11.5px] text-muted max-w-[16rem] leading-[1.5]">
            Demo only. No payment is captured, no contract is created.
          </p>
          <Link
            href={`/passport/${slug}?view=transfer`}
            className="inline-flex items-baseline gap-2 text-[15px] text-ink border-b border-ink hover:border-teal hover:text-teal-deep pb-0.5 transition-colors"
            onClick={onClose}
          >
            Simulate transfer
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3 border-b py-1.5"
      style={{ borderColor: "var(--brand-line)" }}
    >
      <span className="label">{k}</span>
      <span className="text-[13.5px] text-ink">{v}</span>
    </div>
  );
}
