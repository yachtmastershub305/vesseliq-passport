import type { Passport } from "@/lib/passport-types";
import { fmtDate } from "@/lib/format";
import { Chip, SectionTitle, Subhead } from "./Primitives";

export function TelemetryTab({ data }: { data: Passport }) {
  const loggers = data.systems
    .flatMap((s) => s.equipment.map((e) => ({ system: s.name, eq: e })))
    .filter(
      ({ eq }) =>
        /telemetry|gateway|logger/i.test(eq.model.equipment_type) ||
        /telemetry/i.test(eq.model.model_number) ||
        /canedge/i.test(eq.model.model_number)
    );

  return (
    <div>
      <SectionTitle
        numeral="IV"
        eyebrow="Telemetry"
        title="Live channels, rolling out."
      />

      <div className="grid grid-cols-12 gap-x-10 gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <div className="border-t pt-6" style={{ borderColor: "var(--brand-line-strong)" }}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="label-ink">Status</span>
              <Chip tone="teal">Coming soon</Chip>
            </div>
            <p className="mt-5 font-serif-italic text-[24px] leading-[1.25] text-ink">
              Live telemetry is rolling out with VesselIQ Pro hardware.
            </p>
            <p className="mt-5 text-[15.5px] leading-[1.6] text-ink/80 max-w-xl">
              The Passport does not show fabricated telemetry. When the live channels activate on
              this hull, signed engine, battery, and navigation data will attach to this record at
              source. Until then, this section confirms the hardware is in place and lists what
              will appear.
            </p>
          </div>

          {loggers.length > 0 && (
            <div className="mt-12">
              <Subhead numeral="iv.a" label="Hardware in place" />
              <div className="space-y-6">
                {loggers.map(({ system, eq }) => (
                  <div
                    key={eq.equipment_instance_id}
                    className="border-t pt-5 grid grid-cols-12 gap-x-6 gap-y-2"
                    style={{ borderColor: "var(--brand-line)" }}
                  >
                    <div className="col-span-12 md:col-span-5">
                      <div className="label">{system}</div>
                      <div className="mt-2 font-serif-italic text-[20px] leading-[1.2] text-ink">
                        {eq.model.manufacturer} {eq.model.model_number}
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="label">Serial</div>
                      <div className="mt-2 font-mono text-[12.5px] text-ink">{eq.serial_number}</div>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <div className="label">Installed</div>
                      <div className="mt-2 text-[13.5px] text-ink">{fmtDate(eq.installed_at)}</div>
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <div className="label">Node</div>
                      <div className="mt-2 font-mono text-[12.5px] text-ink">{eq.subsystem_node_id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5">
          <Subhead numeral="iv.b" label="What will attach when live" />
          <ol className="space-y-5">
            <Roadmap
              n="01"
              title="Engine telemetry, signed at source"
              body="RPM, fuel flow, coolant, load, total hours from the J1939 bus through the CANedge3 gateway."
            />
            <Roadmap
              n="02"
              title="Fuel burn and range"
              body="Per leg fuel burn, season cumulative, range projections based on the active route."
            />
            <Roadmap
              n="03"
              title="Fault codes"
              body="Active and historical DTCs, OEM resolved fault names, captured with engine hours at occurrence."
            />
            <Roadmap
              n="04"
              title="House battery cycles"
              body="State of charge, depth of discharge cycles, charge sources, time at float, on the Mastervolt bank."
            />
            <Roadmap
              n="05"
              title="Voyage record"
              body="Position, speed, distance run, attached as a signed voyage event on this Passport."
            />
            <Roadmap
              n="06"
              title="Owner controlled visibility"
              body="The owner authorizes who sees live channels and at what resolution, per buyer or insurer."
            />
          </ol>
          <p className="mt-8 pt-5 border-t text-[12.5px] text-muted leading-[1.6] max-w-md" style={{ borderColor: "var(--brand-line)" }}>
            When asked by an insurer, this is the honest answer, the hardware is in place, the
            data contract is defined, the live channel will attach the moment it activates on this
            hull.
          </p>
        </div>
      </div>
    </div>
  );
}

function Roadmap({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="grid grid-cols-[36px_1fr] gap-x-3 items-baseline border-b pb-4" style={{ borderColor: "var(--brand-line)" }}>
      <span className="font-mono text-[10.5px] tracking-wider text-muted">{n}</span>
      <div>
        <div className="text-[15px] tracking-tight text-ink">{title}</div>
        <p className="mt-2 text-[13px] leading-[1.55] text-ink/70">{body}</p>
      </div>
    </li>
  );
}
