import type { EquipmentInstance, Passport, SystemRecord } from "@/lib/passport-types";
import { fmtDate, fmtNumber, titleCase } from "@/lib/format";
import { Chip, VerifiedMark } from "./Primitives";

const SYSTEM_ORDER = ["PROPULSION", "ELECTRICAL", "NAVIGATION"] as const;

export function EquipmentTab({ data }: { data: Passport }) {
  const systems = [...data.systems].sort((a, b) => {
    const ai = SYSTEM_ORDER.indexOf(a.system_type as (typeof SYSTEM_ORDER)[number]);
    const bi = SYSTEM_ORDER.indexOf(b.system_type as (typeof SYSTEM_ORDER)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="space-y-10">
      {systems.map((sys) => (
        <SystemSection key={sys.system_id} system={sys} />
      ))}
    </div>
  );
}

function SystemSection({ system }: { system: SystemRecord }) {
  return (
    <div>
      <div className="flex items-baseline justify-between border-b hairline-strong pb-3 mb-5">
        <div>
          <div className="font-mono text-[10.5px] tracking-wider uppercase text-teal-deep">
            {system.system_type}
          </div>
          <h3 className="mt-1 text-[20px] tracking-tight text-ink">{system.name}</h3>
        </div>
        <span className="font-mono text-[11px] text-muted">
          {system.equipment.length} {system.equipment.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {system.equipment.map((eq) => (
          <EquipmentCard key={eq.equipment_instance_id} eq={eq} />
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

function EquipmentCard({ eq }: { eq: EquipmentInstance }) {
  const m = eq.model;
  const attrEntries = Object.entries(eq.attributes).filter(([, v]) => v !== null && v !== undefined);
  const specEntries = Object.entries(m.specs).filter(([, v]) => v !== null && v !== undefined);

  return (
    <article className="rounded-xl border hairline bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted">
            {titleCase(m.equipment_type)}
          </div>
          <h4 className="mt-1 text-[16.5px] tracking-tight text-ink leading-snug">
            {m.manufacturer} {m.model_number}
          </h4>
        </div>
        <VerifiedMark />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
        <KV k="Serial" v={<span className="font-mono text-[12px]">{eq.serial_number}</span>} />
        <KV k="Installed" v={fmtDate(eq.installed_at)} />
        {attrEntries.map(([k, v]) => (
          <KV key={k} k={ATTRIBUTE_LABELS[k] ?? titleCase(k)} v={fmtAttr(k, v)} />
        ))}
      </dl>

      {specEntries.length > 0 && (
        <div className="mt-4 pt-4 border-t hairline">
          <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted mb-2">
            Specs
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] text-ink/80">
            {specEntries.map(([k, v]) => (
              <li key={k} className="flex items-baseline justify-between gap-2">
                <span className="text-muted">{SPEC_LABELS[k] ?? titleCase(k)}</span>
                <span>{fmtSpec(k, v)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-3 border-t hairline flex items-center justify-between">
        <Chip>{eq.subsystem_node_id}</Chip>
        <span className="font-mono text-[10.5px] text-muted">{eq.equipment_instance_id}</span>
      </div>
    </article>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-mono text-[10.5px] tracking-wider uppercase text-muted">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}
