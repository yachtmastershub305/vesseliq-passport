import { PRICING } from "@/lib/pricing";
import { TourCloserForm } from "../components/TourCloserForm";

export function Panel5Closer() {
  return (
    <article className="pt-6 sm:pt-10">
      <div className="label">Closer</div>
      <h1 className="mt-4 display text-[44px] sm:text-[64px] md:text-[76px] text-ink leading-[0.98] max-w-3xl">
        Bring this to your{" "}
        <span className="display-italic">next listing.</span>
      </h1>
      <p className="mt-6 text-[16.5px] leading-[1.6] text-ink/80 max-w-2xl">
        Type the HIN of a vessel you list. We scan your records, verify the
        identity, and certify the Passport for your hull. Your next listing
        ships with a verified record, day one.
      </p>

      <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-8 items-baseline">
        <div className="col-span-12 lg:col-span-7">
          <TourCloserForm />
        </div>
        <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
          <div
            className="border-t pt-4"
            style={{ borderColor: "var(--brand-line-strong)" }}
          >
            <div className="label">Pricing</div>
            <div className="mt-2 font-serif text-[28px] text-ink">
              {PRICING.creation.headline}
            </div>
            <div className="mt-1 text-[12.5px] text-muted leading-[1.5]">
              {PRICING.creation.suffix}
            </div>
          </div>
          <div
            className="mt-5 border-t pt-4"
            style={{ borderColor: "var(--brand-line-strong)" }}
          >
            <div className="label">What you get</div>
            <ul className="mt-3 text-[13px] text-ink/85 space-y-2 leading-[1.55]">
              <li>Identity verified against USCG and registries</li>
              <li>Equipment captured at commissioning</li>
              <li>Service ledger signed by verified partners</li>
              <li>Tamper-proof signature, public verifier</li>
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
