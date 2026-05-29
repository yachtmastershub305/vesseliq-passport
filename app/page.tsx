import Link from "next/link";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { AccessForm } from "./components/AccessForm";
import { SealStamp } from "./components/SealStamp";
import { CornerMark } from "./components/CornerMark";
import { HinLookup } from "./components/HinLookup";
import { PRICING } from "@/lib/pricing";

export default function Home() {
  return (
    <>
      <FolioRail />
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Problem />
        <WhatItIs />
        <HowItWorks />
        <CreateOffer />
        <AcquireCallout />
      </main>
      <SiteFooter />
    </>
  );
}

function FolioRail() {
  return (
    <div className="border-b" style={{ borderColor: "var(--brand-line-strong)" }}>
      <div className="container-doc flex items-center justify-between gap-4 py-2 text-[10.5px]">
        <span className="folio">VIQ / Pass / Schema 2026.05.25</span>
        <span className="folio hidden sm:inline">
          The verified history that travels with the hull
        </span>
        <span className="folio">Issued 2026.05.28</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="container-doc pt-12 sm:pt-20 md:pt-28 pb-16 sm:pb-24 md:pb-32 relative">
        <span className="absolute left-6 top-12 hidden md:block">
          <CornerMark position="tl" />
        </span>
        <span className="absolute right-6 top-12 hidden md:block">
          <CornerMark position="tr" />
        </span>

        <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-start">
          <div className="col-span-12 md:col-span-1 hidden md:block pt-3">
            <div className="font-serif-italic text-[14px] text-muted">§ I</div>
          </div>

          <div className="col-span-12 md:col-span-11">
            <div className="label">Vessel record, since 2026</div>
            <h1 className="mt-5 sm:mt-6 display text-[40px] sm:text-[64px] md:text-[88px] lg:text-[112px] text-ink">
              The verified history
              <br />
              <span className="display-italic">that travels with</span>
              <br />
              the hull.
            </h1>

            <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10">
              <div className="col-span-12 lg:col-span-7">
                <p className="text-[18px] leading-[1.5] text-ink/80">
                  One canonical record per vessel, sourced from government registries and signed
                  service history, owner authorized. Built for brokers who need to close, buyers
                  who need to trust, and insurers who need to underwrite.
                </p>

                <div className="mt-10">
                  <HinLookup />
                </div>

                <div className="mt-7 flex flex-wrap items-baseline gap-x-8 gap-y-3">
                  <Link href="/passport/bruce-wayne" className="cta-secondary">
                    Or open a sample Passport
                    <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link href="#access" className="cta-quiet">
                    Have your Passport created
                  </Link>
                </div>
              </div>

              <aside className="col-span-12 lg:col-span-4 lg:col-start-9 relative">
                <div className="border-t pt-3" style={{ borderColor: "var(--brand-line-strong)" }}>
                  <div className="label">Issued under</div>
                  <div className="mt-2 font-mono text-[12px] text-ink leading-relaxed">
                    USCG documentation
                    <br />
                    Manufacturer identification codes
                    <br />
                    Verified service partners
                    <br />
                    Owner authorization
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <div className="lg:hidden">
                    <SealStamp pct={94} size={132} />
                  </div>
                  <div className="hidden lg:block">
                    <SealStamp pct={94} size={160} />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <hr className="rule-strong" />
    </section>
  );
}

function Problem() {
  return (
    <section className="container-doc py-14 sm:py-20 md:py-28">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 md:col-span-1 hidden md:block">
          <div className="font-serif-italic text-[14px] text-muted">§ II</div>
        </div>
        <div className="col-span-12 md:col-span-11">
          <div className="label">The problem</div>
          <h2 className="mt-5 display text-[30px] sm:text-[44px] md:text-[58px] text-ink max-w-3xl">
            A yacht sale runs on{" "}
            <span className="display-italic">a folder of PDFs.</span>
          </h2>

          <div className="mt-12 grid grid-cols-12 gap-x-10 gap-y-8">
            <div className="col-span-12 lg:col-span-6">
              <div className="border-t pt-5" style={{ borderColor: "var(--brand-line-strong)" }}>
                <div className="label">Where the truth sits today</div>
                <p className="mt-4 text-[16.5px] leading-[1.6] text-ink/80">
                  There is no canonical record for a vessel. Identity sits in one registry,
                  equipment in another, service history in a binder under the helm seat. Buyers
                  and brokers stitch it together by hand, and trust the binder because there is no
                  alternative.
                </p>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="border-t pt-5" style={{ borderColor: "var(--brand-line-strong)" }}>
                <div className="label">What it costs</div>
                <p className="mt-4 text-[16.5px] leading-[1.6] text-ink/80">
                  Buyers overpay or walk. Insurers pad premiums for uncertainty. Brokers lose
                  deals to doubt at the very last meeting. The information exists. It is just not
                  assembled, provenanced, or owned by anyone the next party can verify.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatItIs() {
  return (
    <section className="border-t" style={{ borderColor: "var(--brand-line-strong)" }}>
      <div className="container-doc py-14 sm:py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-1 hidden md:block">
            <div className="font-serif-italic text-[14px] text-muted">§ III</div>
          </div>
          <div className="col-span-12 md:col-span-11">
            <div className="label">What the Passport is</div>
            <h2 className="mt-5 display text-[30px] sm:text-[44px] md:text-[58px] text-ink max-w-3xl">
              A signed record{" "}
              <span className="display-italic">for the people</span> who underwrite the deal.
            </h2>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "var(--brand-line-strong)" }}>
              <AudienceColumn
                index="01"
                role="Brokers"
                hook="A credibility instrument."
                body="Attach a verified Passport to the listing. Close the trust gap before the table, not at it."
              />
              <AudienceColumn
                index="02"
                role="Buyers"
                hook="Proof of what you are buying."
                body="History sourced and provenanced, not retyped. Every figure on the page traces back to a known source."
              />
              <AudienceColumn
                index="03"
                role="Insurers"
                hook="Underwrite the asset."
                body="Verified identity, equipment, and maintenance provenance. Underwrite on data, not on paperwork."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AudienceColumn({
  index,
  role,
  hook,
  body,
}: {
  index: string;
  role: string;
  hook: string;
  body: string;
}) {
  return (
    <div className="px-0 md:px-8 py-8 first:pt-8 first:md:pl-0 last:md:pr-0">
      <div className="flex items-baseline justify-between">
        <div className="label-ink">{role}</div>
        <div className="font-mono text-[10.5px] text-muted">{index}</div>
      </div>
      <h3 className="mt-5 font-serif-italic text-[26px] leading-[1.15] text-ink">{hook}</h3>
      <p className="mt-4 text-[14.5px] leading-[1.6] text-ink/75">{body}</p>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "I",
      title: "Identity from registries",
      body:
        "Vessel identity is sourced from the USCG documentation database, manufacturer identification codes, and partner registries. Not retyped.",
    },
    {
      n: "II",
      title: "Equipment at commissioning",
      body:
        "Engines, batteries, telemetry gateways. Each instance is captured at install with serial numbers and signed by the OEM commissioning engineer.",
    },
    {
      n: "III",
      title: "Service by verified partners",
      body:
        "Maintenance and parts go on the record through verified service partners. Each event carries a work order reference and a task code.",
    },
    {
      n: "IV",
      title: "Owner controls visibility",
      body:
        "The owner authorizes who can view the Passport. Brokers and insurers see exactly the slice they need, for exactly as long as they need it.",
    },
  ];
  return (
    <section className="border-t" style={{ borderColor: "var(--brand-line-strong)" }}>
      <div className="container-doc py-14 sm:py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-1 hidden md:block">
            <div className="font-serif-italic text-[14px] text-muted">§ IV</div>
          </div>
          <div className="col-span-12 md:col-span-11">
            <div className="label">How it works</div>
            <h2 className="mt-5 display text-[30px] sm:text-[44px] md:text-[58px] text-ink max-w-3xl">
              Four sources of truth,{" "}
              <span className="display-italic">one record.</span>
            </h2>

            <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {steps.map((s) => (
                <li key={s.n} className="relative">
                  <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: "var(--brand-line-strong)" }}>
                    <span className="font-serif-italic text-[15px] text-muted">§ {s.n}</span>
                    <span className="label-ink">Step</span>
                  </div>
                  <h3 className="mt-5 font-serif-italic text-[24px] leading-[1.15] text-ink">{s.title}</h3>
                  <p className="mt-4 text-[14px] leading-[1.6] text-ink/75">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function CreateOffer() {
  const benefits = [
    {
      n: "01",
      title: "Documents organized, day one",
      body: "We scan and digitize your paper records, registration, insurance, survey, manuals, service receipts, and assemble them into the Passport.",
    },
    {
      n: "02",
      title: "Identity verified against sources",
      body: "Vessel identity, builder, hull number, engines, and dimensions are cross checked against USCG documentation, manufacturer codes, and partner registries.",
    },
    {
      n: "03",
      title: "Equipment certified at install",
      body: "Engines, batteries, navigation, telemetry. Each instance signed by the OEM or commissioning engineer, serial number on the record.",
    },
    {
      n: "04",
      title: "Sale ready, faster and more credible",
      body: "A buyer or insurer can read the verified record without asking. The Passport closes the trust gap before the table.",
    },
  ];

  return (
    <section
      id="access"
      className="border-t"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="container-doc py-14 sm:py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-1 hidden md:block">
            <div className="font-serif-italic text-[14px] text-muted">§ V</div>
          </div>
          <div className="col-span-12 md:col-span-11">
            <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-baseline">
              <div className="col-span-12 lg:col-span-8">
                <div className="label">Offer, for sellers and brokers</div>
                <h2 className="mt-5 display text-[30px] sm:text-[44px] md:text-[58px] text-ink leading-[1.02] max-w-3xl">
                  Have your Passport{" "}
                  <span className="display-italic">created.</span>
                </h2>
                <p className="mt-6 text-[16.5px] leading-[1.6] text-ink/80 max-w-xl">
                  A service we perform, not a self serve signup. We scan your paper records,
                  verify identity and equipment against independent sources, and certify a
                  Passport for your vessel. Day one your documents are organized and secured,
                  every day after your sale runs on a record a buyer can trust.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4 lg:text-right">
                <div className="label">Pricing</div>
                <div className="mt-2 font-serif text-[30px] text-ink">{PRICING.creation.headline}</div>
                <div className="mt-1 text-[12.5px] text-muted leading-[1.5] max-w-xs lg:ml-auto">
                  {PRICING.creation.suffix}
                </div>
                <div className="mt-5 text-[12.5px] text-muted leading-[1.5] max-w-xs lg:ml-auto">
                  Plus {PRICING.maintenance.headline.toLowerCase()}, {PRICING.maintenance.suffix}.
                </div>
              </div>
            </div>

            <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {benefits.map((b) => (
                <li key={b.n}>
                  <div
                    className="flex items-baseline gap-3 border-b pb-3"
                    style={{ borderColor: "var(--brand-line-strong)" }}
                  >
                    <span className="font-mono text-[10.5px] tracking-wider text-muted">{b.n}</span>
                    <span className="label-ink">Included</span>
                  </div>
                  <h3 className="mt-5 font-serif-italic text-[22px] leading-[1.2] text-ink">{b.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink/75">{b.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-16 grid grid-cols-12 gap-x-10 gap-y-10">
              <div className="col-span-12 lg:col-span-5">
                <div className="label">Request a Passport</div>
                <h3 className="mt-4 display-italic text-[34px] leading-[1.1] text-ink">
                  Tell us about the vessel.
                </h3>
                <p className="mt-5 text-[14.5px] leading-[1.6] text-ink/75 max-w-md">
                  We will reply within one business day with a scope and a quote. Brokers and
                  insurers are prioritized for the first cohort.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <AccessForm offer="create" submitLabel={PRICING.creation.label} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AcquireCallout() {
  return (
    <section className="border-t" style={{ borderColor: "var(--brand-line-strong)" }}>
      <div className="container-doc py-16 sm:py-20">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-baseline">
          <div className="col-span-12 lg:col-span-1 hidden lg:block">
            <div className="font-serif-italic text-[14px] text-muted">§ VI</div>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <div className="label">Offer, for buyers</div>
            <h2 className="mt-4 display text-[24px] sm:text-[32px] md:text-[38px] leading-[1.05] text-ink max-w-2xl">
              Looking at a vessel with a Passport?{" "}
              <span className="display-italic">Acquire it</span> when you close the deal.
            </h2>
            <p className="mt-5 text-[14.5px] leading-[1.6] text-ink/75 max-w-xl">
              When the seller already has a certified Passport, the buyer pays to unlock the full
              record and receive ownership transfer. The pricing and the flow live inside the
              Passport preview for the listed vessel, look up a HIN above to begin.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <div className="label">Pricing</div>
            <div className="mt-2 font-serif text-[24px] text-ink">{PRICING.transfer.headline}</div>
            <div className="mt-1 text-[12px] text-muted leading-[1.5] max-w-xs lg:ml-auto">
              {PRICING.transfer.suffix}
            </div>
            <div className="mt-5 flex lg:justify-end">
              <Link href="/passport/bruce-wayne" className="cta-secondary">
                Open the sample Passport
                <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
