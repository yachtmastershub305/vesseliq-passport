import type { EquipmentInstance, Passport, SystemRecord } from "@/lib/passport-types";
import { fmtDate, fmtNumber, titleCase } from "@/lib/format";
import { SectionTitle, Subhead, VerifiedMark } from "./Primitives";

const SYSTEM_ORDER = ["PROPULSION", "ELECTRICAL", "NAVIGATION"] as const;

const SYSTEM_NUMERAL: Record<string, string> = {
  PROPULSION: "ii.a",
  ELECTRICAL: "ii.b",
  NAVIGATION: "ii.c",
};

export function EquipmentTab({ data }: { data: Passport }) {
  const systems = [...data.systems].sort((a, b) => {
    const ai = SYSTEM_ORDER.indexOf(a.system_type as (typeof SYSTEM_ORDER)[number]);
    const bi = SYSTEM_ORDER.indexOf(b.system_type as (typeof SYSTEM_ORDER)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div>
      <SectionTitle
        numeral="II"
        eyebrow="Equipment"
        title="What is fitted, signed at install."
      />
      <div className="space-y-16">
        {systems.map((sys) => (
          <SystemSection key={sys.system_id} system={sys} />
        ))}
      </div>
    </div>
  );
}

function SystemSection({ system }: { system: SystemRecord }) {
  return (
    <div>
      <Subhead
        numeral={SYSTEM_NUMERAL[system.system_type] ?? "ii"}
        label={`${titleCase(system.system_type)} · ${system.name}`}
      />
      <div className="space-y-8">
        {system.equipment.map((eq) => (
          <EquipmentEntry key={eq.equipment_instance_id} eq={eq} />
        ))}
      </div>
    </div>
  );
}

const ATTRIBUTE_LABELS: Record<string, string> = {
  current_hours: "Hours",
  condition: "Condition",
  position: "Position",
  capacity_kwh: "Capacity",
  cycles: "Cycles",
  role: "Role",
};

const SPEC_LABELS: Record<string, string> = {
  hp: "Horsepower",
  cylinders: "Cylinders",
  displacement_l: "Displacement",
  fuel_type: "Fuel",
  rpm_max: "Max RPM",
  voltage: "Voltage",
  capacity_ah: "Capacity",
  chemistry: "Chemistry",
  power_w: "Power",
  channels: "Channels",
  storage: "Storage",
  connectivity: "Connectivity",
};

function fmtAttr(key: string, value: string | number | boolean | null): string {
  if (value === null || value === undefined) return "—";
  if (key === "capacity_kwh") return `${value} kWh`;
  if (key === "current_hours") return `${fmtNumber(Number(value))} h`;
  if (typeof value === "string") return titleCase(value);
  return String(value);
}

function fmtSpec(key: string, value: string | number | boolean | null): string {
  if (value === null || value === undefined) return "—";
  if (key === "displacement_l") return `${value} L`;
  if (key === "voltage") return `${value} V`;
  if (key === "capacity_ah") return `${value} Ah`;
  if (key === "power_w") return `${fmtNumber(Number(value))} W`;
  if (key === "rpm_max") return `${fmtNumber(Number(value))} rpm`;
  if (key === "hp") return `${value} hp`;
  if (typeof value === "string") return titleCase(value);
  return String(value);
}

function EquipmentEntry({ eq }: { eq: EquipmentInstance }) {
  const m = eq.model;
  const attrEntries = Object.entries(eq.attributes).filter(([, v]) => v !== null && v !== undefined);
  const specEntries = Object.entries(m.specs).filter(([, v]) => v !== null && v !== undefined);

  return (
    <article
      className="grid grid-cols-12 gap-x-6 gap-y-4 border-t pt-6"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="col-span-12 md:col-span-5">
        <div className="label">{titleCase(m.equipment_type)}</div>
        <h4 className="mt-3 font-serif-italic text-[26px] leading-[1.1] text-ink">
          {m.manufacturer} {m.model_number}
        </h4>
        <div className="mt-3">
          <VerifiedMark note="At commissioning" />
        </div>
        <div className="mt-4 font-mono text-[11.5px] text-muted leading-[1.6]">
          {eq.equipment_instance_id}
          <br />
          Node, {eq.subsystem_node_id}
        </div>
      </div>

      <div className="col-span-12 md:col-span-4">
        <div className="label">Install record</div>
        <dl className="mt-3 space-y-1.5">
          <KV k="Serial" v={<span className="font-mono text-[12.5px]">{eq.serial_number}</span>} />
          <KV k="Installed" v={fmtDate(eq.installed_at)} />
          {attrEntries.map(([k, v]) => (
            <KV key={k} k={ATTRIBUTE_LABELS[k] ?? titleCase(k)} v={fmtAttr(k, v)} />
          ))}
        </dl>
      </div>

      <div className="col-span-12 md:col-span-3">
        {specEntries.length > 0 && (
          <>
            <div className="label">Specs</div>
            <dl className="mt-3 space-y-1.5">
              {specEntries.map(([k, v]) => (
                <KV key={k} k={SPEC_LABELS[k] ?? titleCase(k)} v={fmtSpec(k, v)} />
              ))}
            </dl>
          </>
        )}
      </div>
    </article>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[13px]">
      <span className="text-muted">{k}</span>
      <span className="text-ink text-right">{v}</span>
    </div>
  );
}
