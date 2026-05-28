import type { Passport } from "@/lib/passport-types";
import { fmtDate } from "@/lib/format";
import { Chip } from "./Primitives";

export function TelemetryTab({ data }: { data: Passport }) {
  const loggers = data.systems
    .flatMap((s) => s.equipment.map((e) => ({ system: s.name, eq: e })))
    .filter(({ eq }) => /telemetry|gateway|logger/i.test(eq.model.equipment_type) || /telemetry/i.test(eq.model.model_number) || /canedge/i.test(eq.model.model_number));

  return (
    <div className="space-y-8">
      <header className="rounded-xl border hairline bg-paper p-7">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[10.5px] tracking-wider uppercase text-teal-deep">
              Live telemetry, status
            </div>
            <h3 className="mt-2 text-[22px] tracking-tight text-ink leading-[1.2]">
              Live telemetry is rolling out with VesselIQ Pro hardware.
            </h3>
          </div>
          <Chip tone="teal">Coming soon</Chip>
        </div>
        <p className="mt-4 text-[14.5px] leading-[1.6] text-ink/75 max-w-2xl">
          The Passport does not show fabricated telemetry. When the live channels activate on this
          hull, signed engine, battery, and navigation data will attach to this record at source.
          Until then, this tab confirms the hardware is in place and lists what will appear.
        </p>
      </header>

      {loggers.length > 0 && (
        <section className="rounded-xl border hairline bg-paper p-6">
          <div className="font-mono text-[10.5px] tracking-wider uppercase text-teal-deep">
            Hardware in place
          </div>
          <h4 className="mt-2 text-[17px] tracking-tight text-ink">
            Telemetry logger commissioned on this vessel
          </h4>
          <div className="mt-5 space-y-3">
            {loggers.map(({ system, eq }) => (
              <div
                key={eq.equipment_instance_id}
                className="rounded-lg border hairline p-4 bg-canvas flex flex-wrap items-baseline gap-x-6 gap-y-2"
              >
                <div>
                  <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted">
                    {system}
                  </div>
                  <div className="mt-1 text-[15px] text-ink">
                    {eq.model.manufacturer} {eq.model.model_number}
                  </div>
                </div>
                <div className="text-[12.5px] text-muted">
                  Serial <span className="font-mono text-ink/80">{eq.serial_number}</span>
                </div>
                <div className="text-[12.5px] text-muted">
                  Installed <span className="text-ink/80">{fmtDate(eq.installed_at)}</span>
                </div>
                <div className="text-[12.5px] text-muted">
                  Node <span className="font-mono text-ink/80">{eq.subsystem_node_id}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border hairline bg-paper p-6">
        <div className="font-mono text-[10.5px] tracking-wider uppercase text-teal-deep">Roadmap</div>
        <h4 className="mt-2 text-[17px] tracking-tight text-ink">
          What will attach to this Passport when channels go live
        </h4>
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RoadmapItem
            title="Engine telemetry, signed at source"
            body="RPM, fuel flow, coolant, load, total hours from the J1939 bus through the CANedge3 gateway."
          />
          <RoadmapItem
            title="Fuel burn and range"
            body="Per leg fuel burn, season cumulative, range projections based on the active route."
          />
          <RoadmapItem
            title="Fault codes"
            body="Active and historical DTCs, OEM resolved fault names, captured with engine hours at occurrence."
          />
          <RoadmapItem
            title="House battery cycles"
            body="State of charge, depth of discharge cycles, charge sources, time at float, on the Mastervolt bank."
          />
          <RoadmapItem
            title="Voyage record"
            body="Position, speed, distance run, attached as a signed voyage event on this Passport."
          />
          <RoadmapItem
            title="Owner controlled visibility"
            body="The owner authorizes who sees live channels and at what resolution, per buyer or insurer."
          />
        </ul>
        <p className="mt-6 pt-4 border-t hairline text-[12.5px] text-muted leading-relaxed">
          When asked by an insurer, this is the honest answer, the hardware is in place, the data
          contract is defined, and the live channel will attach the moment it activates on this
          hull.
        </p>
      </section>
    </div>
  );
}

function RoadmapItem({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-lg border hairline p-4 bg-canvas">
      <div className="text-[14.5px] tracking-tight text-ink">{title}</div>
      <p className="mt-1.5 text-[13px] leading-[1.55] text-ink/70">{body}</p>
    </li>
  );
}
