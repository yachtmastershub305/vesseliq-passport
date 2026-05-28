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
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12.5px] font-mono tracking-wider uppercase text-muted hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span> Back to overview
          </Link>
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <PassportHeader data={data} />
        </div>
        <div className="mx-auto max-w-6xl px-6 mt-8">
          <PassportTabs
            panels={{
              identity: <IdentityTab data={data} />,
              equipment: <EquipmentTab data={data} />,
              maintenance: <MaintenanceTab data={data} />,
              telemetry: <TelemetryTab data={data} />,
              provenance: <ProvenanceTab data={data} />,
            }}
          />
        </div>
        <div className="mx-auto max-w-6xl px-6 mt-10 mb-4">
          <p className="rounded-lg border hairline bg-paper px-4 py-3 text-[12px] text-muted leading-relaxed">
            <span className="font-mono tracking-wider uppercase text-[10.5px] text-ink/70">
              Demonstration record.
            </span>{" "}
            All data is illustrative. Field names and types match the VesselIQ production schema so
            a real query drops into this view without remapping.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
