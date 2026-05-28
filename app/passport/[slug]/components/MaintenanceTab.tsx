import type { Passport, ServiceEvent } from "@/lib/passport-types";
import { fmtDate, fmtMoney, fmtNumber } from "@/lib/format";
import { Chip } from "./Primitives";

export function MaintenanceTab({ data }: { data: Passport }) {
  const events = [...data.service_events].sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  return (
    <div>
      <div className="flex items-baseline justify-between border-b hairline-strong pb-3 mb-6">
        <div>
          <div className="font-mono text-[10.5px] tracking-wider uppercase text-teal-deep">
            Service ledger
          </div>
          <h3 className="mt-1 text-[20px] tracking-tight text-ink">
            {events.length} verified events
          </h3>
        </div>
        <span className="font-mono text-[11px] text-muted">most recent first</span>
      </div>

      <ol className="relative space-y-6 pl-6 sm:pl-8 border-l hairline-strong">
        {events.map((ev) => (
          <ServiceEventCard key={ev.service_event_id} ev={ev} />
        ))}
      </ol>
    </div>
  );
}

function ServiceEventCard({ ev }: { ev: ServiceEvent }) {
  return (
    <li className="relative">
      <span
        className="absolute -left-[33px] sm:-left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-teal ring-4 ring-canvas"
        aria-hidden="true"
      />
      <article className="rounded-xl border hairline bg-paper p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] tracking-wider uppercase text-muted">
              {fmtDate(ev.event_date)}
            </div>
            <h4 className="mt-1 text-[17px] tracking-tight text-ink">{ev.event_type}</h4>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="teal">{ev.task_code}</Chip>
            {ev.meter_reading_hrs !== null && (
              <Chip>{fmtNumber(ev.meter_reading_hrs)} h on meter</Chip>
            )}
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-[1.55] text-ink/80">{ev.notes}</p>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
          <KV k="Performed by" v={ev.performed_by} />
          <KV k="Work order" v={<span className="font-mono text-[12px]">{ev.work_order_ref}</span>} />
          {ev.equipment_instance_id && (
            <KV
              k="Equipment"
              v={<span className="font-mono text-[12px]">{ev.equipment_instance_id}</span>}
            />
          )}
          <KV k="Event ID" v={<span className="font-mono text-[12px]">{ev.service_event_id}</span>} />
        </dl>

        {ev.line_items.length > 0 && <LineItemsTable items={ev.line_items} />}
      </article>
    </li>
  );
}

function LineItemsTable({ items }: { items: ServiceEvent["line_items"] }) {
  const total = items.reduce((acc, li) => acc + li.total_cost, 0);
  const currency = items[0]?.currency_code ?? "USD";

  return (
    <div className="mt-5 pt-4 border-t hairline">
      <div className="font-mono text-[10.5px] tracking-wider uppercase text-muted mb-2">
        Parts and line items
      </div>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-muted">
              <th className="font-mono text-[10.5px] tracking-wider uppercase font-normal px-2 pb-2">
                Part no.
              </th>
              <th className="font-mono text-[10.5px] tracking-wider uppercase font-normal px-2 pb-2">
                Description
              </th>
              <th className="font-mono text-[10.5px] tracking-wider uppercase font-normal px-2 pb-2 text-right">
                Qty
              </th>
              <th className="font-mono text-[10.5px] tracking-wider uppercase font-normal px-2 pb-2 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((li) => (
              <tr key={li.part_number} className="border-t hairline">
                <td className="px-2 py-2 font-mono text-[11.5px] text-ink/85">{li.part_number}</td>
                <td className="px-2 py-2 text-ink/85">{li.description}</td>
                <td className="px-2 py-2 text-right text-ink/85">{li.quantity}</td>
                <td className="px-2 py-2 text-right text-ink">
                  {fmtMoney(li.total_cost, li.currency_code)}
                </td>
              </tr>
            ))}
            <tr className="border-t hairline-strong">
              <td colSpan={3} className="px-2 py-2 text-right font-mono text-[10.5px] tracking-wider uppercase text-muted">
                Total
              </td>
              <td className="px-2 py-2 text-right text-ink">{fmtMoney(total, currency)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b hairline pb-1.5">
      <span className="font-mono text-[10.5px] tracking-wider uppercase text-muted">{k}</span>
      <span className="text-ink text-right">{v}</span>
    </div>
  );
}
