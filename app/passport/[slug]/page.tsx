import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter } from "@/app/components/SiteFooter";
import { getAllPassportSlugs, getPassportBySlug } from "@/lib/passport-data";
import { PassportHeader } from "./components/PassportHeader";
import { PassportTabs } from "./components/PassportTabs";
import { IdentityTab } from "./components/IdentityTab";
import { EquipmentTab } from "./components/EquipmentTab";
import { MaintenanceTab } from "./components/MaintenanceTab";
import { TelemetryTab } from "./components/TelemetryTab";
import { ProvenanceTab } from "./components/ProvenanceTab";

export function generateStaticParams() {
  return getAllPassportSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function PassportPage(props: PageProps<"/passport/[slug]">) {
  const { slug } = await props.params;
  const data = getPassportBySlug(slug);
  if (!data) notFound();

  return (
    <>
      <SiteNav />
      <main className="flex-1 container-doc">
        <div className="pt-8 pb-2">
          <Link
            href="/"
            className="inline-flex items-baseline gap-2 label hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span> Back to overview
          </Link>
        </div>

        <PassportHeader data={data} />

        <PassportTabs
          panels={{
            identity: <IdentityTab data={data} />,
            equipment: <EquipmentTab data={data} />,
            maintenance: <MaintenanceTab data={data} />,
            telemetry: <TelemetryTab data={data} />,
            provenance: <ProvenanceTab data={data} />,
          }}
        />

        <aside className="mt-10 mb-4 border-t pt-5" style={{ borderColor: "var(--brand-line-strong)" }}>
          <div className="grid grid-cols-12 gap-x-6 gap-y-3 items-baseline">
            <div className="col-span-12 md:col-span-2">
              <span className="label">Notice</span>
            </div>
            <p className="col-span-12 md:col-span-10 text-[12.5px] text-muted leading-[1.7] max-w-3xl">
              Demonstration record. All data is illustrative. Field names and types match the
              VesselIQ production schema, so a real query drops into this view without remapping.
            </p>
          </div>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
