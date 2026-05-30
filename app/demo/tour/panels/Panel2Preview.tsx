import type { Passport } from "@/lib/passport-types";
import Link from "next/link";
import { PassportHeader } from "@/app/passport/[slug]/components/PassportHeader";
import { PASSPORT_SLUG } from "@/lib/passport-data";
import { PRICING } from "@/lib/pricing";

export function Panel2Preview({ data }: { data: Passport }) {
  return (
    <article className="space-y-8">
      <PassportHeader data={data} view="preview" isSample={true} slug={PASSPORT_SLUG} />

      <section
        className="relative border-t border-b py-8 sm:py-10"
        style={{ borderColor: "var(--brand-line-strong)" }}
      >
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-baseline">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-baseline gap-3">
              <span className="font-serif-italic text-[15px] text-muted">§</span>
              <span className="label-ink">Acquire this Passport</span>
            </div>
            <h3 className="mt-3 display text-[28px] sm:text-[36px] leading-[1.05] text-ink max-w-2xl">
              The buyer sees this band, the proof and the price,{" "}
              <span className="display-italic">before they pay.</span>
            </h3>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <div className="label">Pricing</div>
            <div className="mt-2 font-serif text-[26px] text-ink">
              {PRICING.transfer.headline}
            </div>
            <div className="mt-1 text-[12px] text-muted leading-[1.5] max-w-xs lg:ml-auto">
              {PRICING.transfer.suffix}
            </div>
            <Link
              href={`/passport/${PASSPORT_SLUG}?view=preview&demo=1`}
              className="mt-4 inline-flex cta-secondary"
            >
              Try the live preview
              <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
