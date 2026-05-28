import type { Passport, ServiceEvent } from "@/lib/passport-types";
import { fmtDate, fmtMoney, fmtNumber } from "@/lib/format";
import { Chip, SectionTitle, Subhead } from "./Primitives";

export function MaintenanceTab({ data }: { data: Passport }) {
  const events = [...data.service_events].sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  return (
    <div>
      <SectionTitle
        numeral="III"
        eyebrow="Maintenance"
        title="The service ledger, signed and dated."
      />

      <Subhead numeral="iii.a" label={`${events.length} verified events, most recent first`} />

      <ol className="space-y-12">
        {events.map((ev) => (
          <ServiceEventRow key={ev.service_event_id} ev={ev} />
        ))}
      </ol>
    </div>
  );
}

function ServiceEventRow({ ev }: { ev: ServiceEvent }) {
  return (
    <li
      className="grid grid-cols-12 gap-x-6 gap-y-5 border-t pt-6"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="col-span-12 md:col-span-3">
        <div className="font-mono text-[11.5px] tracking-wider uppercase text-muted">
          {fmtDate(ev.event_date)}
        </div>
        <div className="mt-3 font-serif-italic text-[20px] leading-[1.2] text-ink">
          {ev.event_type}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <Chip tone="teal">{ev.task_code}</Chip>
          {ev.meter_reading_hrs !== null && (
            <Chip>{fmtNumber(ev.meter_reading_hrs)} h</Chip>
          )}
        </div>
        <div className="mt-4 font-mono text-[10.5px] text-muted leading-[1.7]">
          {ev.service_event_id}
          <br />
          WO {ev.work_order_ref}
        </div>
      </div>

      <div className="col-span-12 md:col-span-9">
        <p className="text-[15px] leading-[1.6] text-ink/85">{ev.notes}</p>

        <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1.5 text-[13px]">
          <KV k="Performed by" v={ev.performed_by} />
          {ev.equipment_instance_id ? (
            <KV
              k="Equipment"
              v={<span className="font-mono text-[12px]">{ev.equipment_instance_id}</span>}
            />
          ) : (
            <KV k="Equipment" v="Vessel wide" />
          )}
        </dl>

        {ev.line_items.length > 0 && <LineItemsTable items={ev.line_items} />}
      </div>
    </li>
  );
}

function LineItemsTable({ items }: { items: ServiceEvent["line_items"] }) {
  const total = items.reduce((acc, li) => acc + li.total_cost, 0);
  const currency = items[0]?.currency_code ?? "USD";

  return (
    <div className="mt-7">
      <div className="label">Parts and line items</div>
      <table className="mt-3 w-full text-[12.5px] border-t" style={{ borderColor: "var(--brand-line-strong)" }}>
        <thead>
          <tr className="text-left">
            <th className="label py-2 pr-3 font-normal">Part no.</th>
            <th className="label py-2 pr-3 font-normal">Description</th>
            <th className="label py-2 pr-3 font-normal text-right">Qty</th>
            <th className="label py-2 pr-3 font-normal text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((li) => (
            <tr key={li.part_number} className="border-t" style={{ borderColor: "var(--brand-line)" }}>
              <td className="py-2 pr-3 font-mono text-[11.5px] text-ink/85">{li.part_number}</td>
              <td className="py-2 pr-3 text-ink/85">{li.description}</td>
              <td className="py-2 pr-3 text-right text-ink/85">{li.quantity}</td>
              <td className="py-2 pr-3 text-right text-ink">
                {fmtMoney(li.total_cost, li.currency_code)}
              </td>
            </tr>
          ))}
          <tr className="border-t" style={{ borderColor: "var(--brand-line-strong)" }}>
            <td colSpan={3} className="py-2 pr-3 text-right label">
              Total
            </td>
            <td className="py-2 pr-3 text-right text-ink">{fmtMoney(total, currency)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b py-1" style={{ borderColor: "var(--brand-line)" }}>
      <span className="label">{k}</span>
      <span className="text-ink text-right">{v}</span>
    </div>
  );
}
