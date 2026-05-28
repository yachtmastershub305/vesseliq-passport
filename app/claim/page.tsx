import Link from "next/link";
import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter } from "@/app/components/SiteFooter";
import { AccessForm } from "@/app/components/AccessForm";
import { normalizeHin } from "@/lib/hin-registry";
import { PRICING } from "@/lib/pricing";

export default async function ClaimPage(props: PageProps<"/claim">) {
  const sp = await props.searchParams;
  const raw = typeof sp.hin === "string" ? sp.hin : "";
  const hin = raw ? normalizeHin(raw) : "";

  return (
    <>
      <FolioRail hin={hin} />
      <SiteNav />
      <main className="flex-1">
        <section className="container-doc pt-20 sm:pt-24 pb-16">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 md:col-span-1 hidden md:block pt-3">
              <div className="font-serif-italic text-[14px] text-muted">§ —</div>
            </div>
            <div className="col-span-12 md:col-span-11">
              <div className="label">Lookup, no Passport on file</div>
              <h1 className="mt-5 display text-[44px] sm:text-[68px] leading-[1.02] text-ink max-w-3xl">
                We do not have a Passport for{" "}
                <span className="display-italic">this hull yet.</span>
              </h1>

              <p className="mt-7 text-[16.5px] leading-[1.6] text-ink/80 max-w-xl">
                The HIN you entered is not on our records. If you are the seller or the broker
                managing this vessel, you can claim the profile and have a certified Passport
                created. We perform the work, you control access to the record.
              </p>

              <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5 max-w-3xl">
                <Stat
                  label="HIN entered"
                  value={hin || "—"}
                  mono
                />
                <Stat label="Status" value="Not on file" />
                <Stat label="Next step" value="Claim and create" />
              </dl>
            </div>
          </div>
        </section>

        <section className="border-t" style={{ borderColor: "var(--brand-line-strong)" }}>
          <div className="container-doc py-20 sm:py-24">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <div className="col-span-12 md:col-span-1 hidden md:block">
                <div className="font-serif-italic text-[14px] text-muted">§</div>
              </div>
              <div className="col-span-12 md:col-span-11">
                <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-baseline">
                  <div className="col-span-12 lg:col-span-8">
                    <div className="label">Offer, claim and create</div>
                    <h2 className="mt-4 display text-[34px] sm:text-[46px] leading-[1.05] text-ink max-w-2xl">
                      Claim this profile and have a Passport{" "}
                      <span className="display-italic">created for the vessel.</span>
                    </h2>
                    <p className="mt-5 text-[15.5px] leading-[1.6] text-ink/80 max-w-xl">
                      We scan your records, verify identity and equipment against independent
                      sources, and certify a Passport for this hull. Day one your documents are
                      organized, every day after the sale runs on a record a buyer can trust.
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-4 lg:text-right">
                    <div className="label">Pricing</div>
                    <div className="mt-2 font-serif text-[28px] text-ink">
                      {PRICING.creation.headline}
                    </div>
                    <div className="mt-1 text-[12.5px] text-muted leading-[1.5] max-w-xs lg:ml-auto">
                      {PRICING.creation.suffix}
                    </div>
                  </div>
                </div>

                <div className="mt-14 grid grid-cols-12 gap-x-10 gap-y-10">
                  <div className="col-span-12 lg:col-span-5">
                    <div className="label">Tell us about the vessel</div>
                    <h3 className="mt-4 display-italic text-[30px] leading-[1.15] text-ink">
                      We will reply with a scope and a quote.
                    </h3>
                    <p className="mt-5 text-[14.5px] leading-[1.6] text-ink/75 max-w-md">
                      Brokers and insurers are prioritized for the first cohort. The HIN you
                      entered is attached to your request automatically.
                    </p>
                    <div className="mt-6 text-[12.5px] text-muted">
                      <Link
                        href="/"
                        className="inline-flex items-baseline gap-2 label hover:text-ink transition-colors"
                      >
                        ← Look up another HIN
                      </Link>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-7">
                    <AccessForm
                      offer="create"
                      submitLabel="Claim and have one created"
                      hin={hin || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function FolioRail({ hin }: { hin: string }) {
  return (
    <div className="border-b no-print" style={{ borderColor: "var(--brand-line-strong)" }}>
      <div className="container-doc flex items-center justify-between gap-4 py-2 text-[10.5px]">
        <span className="folio">VIQ / Lookup result</span>
        <span className="folio hidden sm:inline">
          {hin ? `HIN ${hin}, not on file` : "HIN not on file"}
        </span>
        <span className="folio">{new Date().toISOString().slice(0, 10)}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className={`mt-2 text-ink ${mono ? "font-mono text-[14px]" : "text-[15px]"}`}>
        {value}
      </div>
    </div>
  );
}
