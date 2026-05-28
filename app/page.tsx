import Link from "next/link";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { AccessForm } from "./components/AccessForm";
import { ConfidenceRing } from "./components/ConfidenceRing";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Problem />
        <WhatItIs />
        <HowItWorks />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="eyebrow">VIQ Passport, schema 2026.05.25</div>
            <h1 className="mt-5 text-[44px] sm:text-[56px] leading-[1.04] tracking-[-0.02em] text-ink">
              The verified history{" "}
              <span className="font-serif-italic text-ink">that travels</span>
              <br />
              with the hull.
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] sm:text-[18px] leading-[1.55] text-ink/75">
              One canonical record per vessel, sourced from government registries and signed
              service history, owner authorized. Built for brokers who need to close, buyers who
              need to trust, and insurers who need to underwrite.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/passport/meridian"
                className="inline-flex items-center h-11 px-5 rounded-full bg-ink text-canvas text-[14.5px] hover:bg-teal-deep transition-colors"
              >
                View a live Passport
                <ArrowRight />
              </Link>
              <Link
                href="#access"
                className="inline-flex items-center h-11 px-5 rounded-full border hairline-strong text-ink text-[14.5px] hover:bg-soft transition-colors"
              >
                Request access
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              <Stat eyebrow="Identity" value="USCG" sub="documented" />
              <Stat eyebrow="Equipment" value="Signed" sub="at commissioning" />
              <Stat eyebrow="Service" value="Verified" sub="partners only" />
            </dl>
          </div>
          <div className="lg:col-span-5">
            <HeroDocument />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ eyebrow, value, sub }: { eyebrow: string; value: string; sub: string }) {
  return (
    <div className="border-t hairline pt-3">
      <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted">{eyebrow}</div>
      <div className="mt-1 text-[20px] tracking-tight text-ink">{value}</div>
      <div className="text-[12.5px] text-muted">{sub}</div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="ml-2" aria-hidden="true">
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroDocument() {
  return (
    <div className="rounded-2xl bg-paper border hairline overflow-hidden shadow-[0_1px_0_rgba(12,17,23,0.04),0_24px_60px_-30px_rgba(12,17,23,0.18)]">
      <div className="px-6 py-4 border-b hairline flex items-center justify-between bg-canvas">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-teal" />
          <span className="font-mono text-[11px] tracking-wider uppercase text-muted">
            VIQ-PASS-2026-00142
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted">issued 2026.05.28</span>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="eyebrow">Vessel</div>
            <h3 className="mt-1 text-[26px] tracking-tight text-ink">
              Meridian <span className="text-muted text-[16px] tracking-normal">/ Focus Power 44</span>
            </h3>
          </div>
          <ConfidenceRing pct={94} />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
          <DocRow k="HIN" v="FCM44021J526" mono />
          <DocRow k="Catalog" v="VIQ-00142" mono />
          <DocRow k="MMSI" v="338291744" mono />
          <DocRow k="Official no." v="1298447" mono />
          <DocRow k="Flag" v="United States" />
          <DocRow k="Class" v="Lloyds Register" />
        </dl>
        <div className="mt-6 pt-5 border-t hairline">
          <div className="flex items-center justify-between text-[12px]">
            <span className="inline-flex items-center gap-1.5 text-teal-deep">
              <CheckCircle /> Verified
            </span>
            <span className="font-mono text-muted">4 provenance sources</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocRow({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-3 border-b hairline pb-2">
      <dt className="font-mono text-[10.5px] tracking-wider uppercase text-muted w-24 shrink-0">{k}</dt>
      <dd className={`text-ink ${mono ? "font-mono text-[12.5px]" : ""}`}>{v}</dd>
    </div>
  );
}

function CheckCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4.5 7.2l1.7 1.7 3.3-3.6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Problem() {
  return (
    <section className="border-t hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="eyebrow">The problem</div>
          <h2 className="mt-4 text-[34px] sm:text-[40px] leading-[1.08] tracking-[-0.015em] text-ink">
            A yacht sale runs on{" "}
            <span className="font-serif-italic">a folder of PDFs.</span>
          </h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 space-y-6 text-[16.5px] leading-[1.6] text-ink/80">
          <p>
            There is no canonical record for a vessel. Identity sits in one registry, equipment in
            another, service history in a binder under the helm seat. Buyers and brokers stitch it
            together by hand, and trust the binder because there is no alternative.
          </p>
          <p>
            Buyers overpay or walk. Insurers pad premiums for uncertainty. Brokers lose deals to
            doubt at the very last meeting. The information exists. It is just not assembled,
            provenanced, or owned by anyone the next party can verify.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhatItIs() {
  return (
    <section className="border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="eyebrow">What the Passport is</div>
            <h2 className="mt-4 text-[34px] sm:text-[40px] leading-[1.08] tracking-[-0.015em] text-ink">
              A signed record{" "}
              <span className="font-serif-italic">for the people</span>{" "}
              who underwrite the deal.
            </h2>
            <p className="mt-6 text-[16px] leading-[1.6] text-ink/75 max-w-md">
              One vessel, one Passport. Identity from government registries, equipment captured at
              commissioning, every service event submitted by a verified partner with a signed work
              order. Every fact carries provenance.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AudienceCard
              role="Brokers"
              hook="A credibility instrument."
              body="Attach a verified Passport to the listing. Close the trust gap before the table, not at it."
            />
            <AudienceCard
              role="Buyers"
              hook="Proof of what you are buying."
              body="History sourced and provenanced, not retyped. Every figure on the page traces back to a known source."
            />
            <AudienceCard
              role="Insurers"
              hook="Underwrite the asset."
              body="Verified identity, equipment, and maintenance provenance. Underwrite on data, not on paperwork."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AudienceCard({ role, hook, body }: { role: string; hook: string; body: string }) {
  return (
    <article className="rounded-xl border hairline bg-paper p-6 flex flex-col h-full">
      <div className="font-mono text-[11px] tracking-wider uppercase text-teal-deep">{role}</div>
      <h3 className="mt-3 text-[18px] tracking-tight text-ink leading-snug">{hook}</h3>
      <p className="mt-3 text-[14.5px] leading-[1.55] text-ink/70">{body}</p>
    </article>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Identity from registries",
      body:
        "Vessel identity is sourced from the USCG documentation database, manufacturer identification codes, and partner registries. Not retyped.",
    },
    {
      n: "02",
      title: "Equipment at commissioning",
      body:
        "Engines, batteries, telemetry gateways. Each instance is captured at install with serial numbers and signed by the OEM commissioning engineer.",
    },
    {
      n: "03",
      title: "Service by verified partners",
      body:
        "Maintenance and parts go on the record through verified service partners. Each event carries a work order reference and a task code.",
    },
    {
      n: "04",
      title: "Owner controls visibility",
      body:
        "The owner authorizes who can view the Passport. Brokers and insurers see exactly the slice they need, for exactly as long as they need it.",
    },
  ];
  return (
    <section className="border-t hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="eyebrow">How it works</div>
        <h2 className="mt-4 text-[34px] sm:text-[40px] leading-[1.08] tracking-[-0.015em] text-ink max-w-2xl">
          Four sources of truth,{" "}
          <span className="font-serif-italic">one record.</span>
        </h2>
        <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <li key={s.n} className="border-t hairline-strong pt-5">
              <div className="font-mono text-[11px] tracking-wider text-teal-deep">{s.n}</div>
              <h3 className="mt-3 text-[17px] tracking-tight text-ink leading-snug">{s.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.55] text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="access" className="border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="eyebrow">Request access</div>
          <h2 className="mt-4 text-[34px] sm:text-[40px] leading-[1.08] tracking-[-0.015em] text-ink">
            Bring the Passport{" "}
            <span className="font-serif-italic">to your next deal.</span>
          </h2>
          <p className="mt-6 text-[15.5px] leading-[1.6] text-ink/75 max-w-md">
            Tell us the role you play in a transaction and we will route the conversation. Brokers
            and insurers get prioritized for the design partner cohort.
          </p>
        </div>
        <div className="lg:col-span-7">
          <AccessForm />
        </div>
      </div>
    </section>
  );
}
