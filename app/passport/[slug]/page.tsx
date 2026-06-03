import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter } from "@/app/components/SiteFooter";
import { getAllPassportSlugs, getPassportForRoute } from "@/lib/passport-data";
import { parseViewState } from "@/lib/passport-view";
import { PassportHeader } from "./components/PassportHeader";
import { PassportTabs, type TabKey } from "./components/PassportTabs";
import { IdentityTab } from "./components/IdentityTab";
import { EquipmentTab } from "./components/EquipmentTab";
import { MaintenanceTab } from "./components/MaintenanceTab";
import { TelemetryTab } from "./components/TelemetryTab";
import { ProvenanceTab } from "./components/ProvenanceTab";
import {
  LockedEquipment,
  LockedMaintenance,
  LockedTelemetry,
  LockedProvenance,
} from "./components/LockedPanels";
import {
  AcquireFlowProvider,
  AcquirePanel,
  StickyAcquireBar,
  TransferProgressBanner,
} from "./components/AcquirePanel";
import { TransferBand } from "./components/TransferBand";
import { ArchivedBand } from "./components/ArchivedBand";
import { RevokedBand } from "./components/RevokedBand";
import { DemoSwitcher } from "./components/DemoSwitcher";

export function generateStaticParams() {
  return getAllPassportSlugs().map((slug) => ({ slug }));
}

type PassportPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PassportPage(props: PassportPageProps) {
  const { slug } = await props.params;
  const sp = (await props.searchParams) ?? {};

  const data = await getPassportForRoute(slug);
  if (!data) notFound();

  const isSample = data._meta.is_sample === true;
  const demoEnabled = sp.demo === "1";
  const backendStatus = data._meta.status;
  // Sample Passport normally hides the acquire flow because nothing real
  // can be transacted on a sample. But for a broker walk through we want
  // the full flow (AcquirePanel + gate modal + StatusSequence + simulate
  // transitions) reachable. ?demo=1 unlocks the flow on sample.
  const acquireUnlocked = !isSample || demoEnabled;
  // Real Passports default to preview (the buyer's first encounter).
  // Sample Passports default to full, the locked treatment makes no sense
  // when there is nothing to unlock. The DemoSwitcher still lets the
  // founder flip to preview, transfer, archived, or revoked to show what
  // those look like.
  const requestedView = parseViewState(sp.view, isSample ? "full" : "preview");
  const view = !isSample && backendStatus === "revoked"
    ? "revoked"
    : !isSample && backendStatus === "archived"
      ? "archived"
      : requestedView;
  const showAcquireFlow = view === "preview" && acquireUnlocked;
  const isRevoked = view === "revoked";
  const isLivePassport = !isSample;

  const lockedTabs: TabKey[] =
    view === "preview" ? ["equipment", "maintenance", "telemetry", "provenance"] : [];

  const panels: Record<TabKey, React.ReactNode> = {
    identity: <IdentityTab data={data} />,
    equipment:
      view === "preview" ? (
        <LockedEquipment data={data} isSample={isSample} />
      ) : (
        <EquipmentTab data={data} />
      ),
    maintenance:
      view === "preview" ? (
        <LockedMaintenance data={data} isSample={isSample} />
      ) : (
        <MaintenanceTab data={data} />
      ),
    telemetry:
      view === "preview" ? (
        <LockedTelemetry data={data} isSample={isSample} />
      ) : (
        <TelemetryTab data={data} />
      ),
    provenance:
      view === "preview" ? (
        <LockedProvenance data={data} isSample={isSample} />
      ) : (
        <ProvenanceTab data={data} />
      ),
  };

  return (
    <AcquireFlowProvider
      slug={slug}
      vesselName={data.vessel.name}
      demoEnabled={demoEnabled}
      view={view}
    >
      <SiteNav />
      <TransferProgressBanner />
      <main className="flex-1 container-doc">
        <div className="pt-8 pb-2 no-print">
          <Link
            href="/"
            className="inline-flex items-baseline gap-2 label hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span> Back to overview
          </Link>
        </div>

        <PassportHeader data={data} view={view} isSample={isSample} slug={slug} />

        {view === "transfer" && (
          <TransferBand
            slug={slug}
            fromParty={isSample ? "Illustrative seller" : "Recorded holder"}
            toParty={isSample ? "Illustrative buyer" : "Acquiring party"}
            demoEnabled={demoEnabled}
          />
        )}

        {view === "archived" && (
          <ArchivedBand slug={slug} isSample={isSample} demoEnabled={demoEnabled} />
        )}

        {isRevoked && (
          <RevokedBand slug={slug} isSample={isSample} demoEnabled={demoEnabled} />
        )}

        {showAcquireFlow && <AcquirePanel />}

        {!isRevoked && <PassportTabs panels={panels} lockedTabs={lockedTabs} />}

        <aside
          className={`mt-10 ${showAcquireFlow ? "mb-24" : "mb-4"} border-t border-b py-5`}
          style={{
            borderColor: "var(--brand-line-strong)",
            backgroundColor: "rgba(12, 17, 23, 0.035)",
          }}
        >
          <div className="grid grid-cols-12 gap-x-6 gap-y-3 items-baseline">
            <div className="col-span-12 md:col-span-2">
              <span className="label-ink">Notice</span>
            </div>
            <p className="col-span-12 md:col-span-10 text-[14px] text-ink/85 leading-[1.6] max-w-3xl">
              {isLivePassport
                ? "Live VesselIQ Passport record. Field names and types match the VesselIQ production schema."
                : "Demonstration record. All data is illustrative. Field names and types match the VesselIQ production schema, so a real query drops into this view without remapping."}
              {isSample && (
                <>
                  {" "}
                  This Passport is a sample for product demonstration. The unlock and transfer
                  flow appears only on Passports for listed vessels.
                </>
              )}
            </p>
          </div>
        </aside>
      </main>
      <SiteFooter />
      {demoEnabled && (
        <DemoSwitcher slug={slug} active={view} liftedForStickyBar={showAcquireFlow} />
      )}
      {showAcquireFlow && <StickyAcquireBar />}
    </AcquireFlowProvider>
  );
}
