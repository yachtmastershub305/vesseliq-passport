import type { Passport } from "@/lib/passport-types";
import { fmtDate, fmtNumber } from "@/lib/format";
import { LockedSection, type TeaserStat } from "./LockedSection";

export function LockedEquipment({ data }: { data: Passport }) {
  const allEquipment = data.systems.flatMap((s) => s.equipment);
  const installs = allEquipment
    .map((e) => e.installed_at)
    .filter(Boolean)
    .sort();
  const stats: TeaserStat[] = [
    { label: "Systems on record", value: fmtNumber(data.systems.length) },
    { label: "Commissioned items", value: fmtNumber(allEquipment.length) },
    { label: "Earliest install", value: fmtDate(installs[0] ?? null) },
  ];

  return (
    <LockedSection
      numeral="II"
      eyebrow="Equipment"
      title="What is fitted, signed at install."
      blurb="Propulsion, electrical, and navigation equipment captured at commissioning. Each instance carries its OEM signature, serial number, and install record. The detail opens to the new holder on transfer."
      stats={stats}
    />
  );
}

export function LockedMaintenance({ data }: { data: Passport }) {
  const events = [...data.service_events].sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );
  const latest = events[0];
  const totalParts = events.reduce((acc, ev) => acc + ev.line_items.length, 0);

  const stats: TeaserStat[] = [
    { label: "Service events recorded", value: fmtNumber(events.length) },
    { label: "Most recent", value: latest ? fmtDate(latest.event_date) : "—" },
    { label: "Parts and line items", value: fmtNumber(totalParts) },
  ];

  return (
    <LockedSection
      numeral="III"
      eyebrow="Maintenance"
      title="The service ledger, signed and dated."
      blurb="A tamper evident timeline of every maintenance event, submitted by verified service partners with work order references and itemized parts. The full ledger opens to the new holder on transfer."
      stats={stats}
    />
  );
}

export function LockedTelemetry({ data }: { data: Passport }) {
  const loggers = data.systems
    .flatMap((s) => s.equipment)
    .filter(
      (eq) =>
        /telemetry|gateway|logger/i.test(eq.model.equipment_type) ||
        /telemetry/i.test(eq.model.model_number) ||
        /canedge/i.test(eq.model.model_number)
    );

  const stats: TeaserStat[] = [
    { label: "Hardware in place", value: `${loggers.length} logger${loggers.length === 1 ? "" : "s"}` },
    { label: "Live channels", value: "Rolling out" },
    { label: "Data contract", value: "Signal K v0.5" },
  ];

  return (
    <LockedSection
      numeral="IV"
      eyebrow="Telemetry"
      title="Live channels, rolling out."
      blurb="Engine, fuel, fault codes, and battery cycles will attach to this Passport when the live channel activates on this hull. The hardware roster and the channel roadmap open to the new holder on transfer."
      stats={stats}
    />
  );
}

export function LockedProvenance({ data }: { data: Passport }) {
  const records = data.provenance;
  const byType = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.source_type] = (acc[r.source_type] ?? 0) + 1;
    return acc;
  }, {});
  const captures = records.map((r) => r.captured_at).sort();
  const stats: TeaserStat[] = [
    { label: "Verified sources", value: fmtNumber(records.length) },
    { label: "Government registries", value: fmtNumber(byType.government_registry ?? 0) },
    { label: "Earliest capture", value: fmtDate(captures[0] ?? null) },
  ];

  return (
    <LockedSection
      numeral="V"
      eyebrow="Provenance"
      title="Where every fact came from."
      blurb="Every fact on this Passport traces to a source, a license, and a capture timestamp. The full citation index opens to the new holder on transfer."
      stats={stats}
    />
  );
}
