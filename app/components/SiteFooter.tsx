export function SiteFooter() {
  return (
    <footer className="mt-24 border-t no-print" style={{ borderColor: "var(--brand-line-strong)" }}>
      <div className="container-doc py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[13px]">
        <div className="space-y-2">
          <div className="label">Imprint</div>
          <div className="text-ink">
            VesselIQ <span className="font-serif-italic">Passport</span>
          </div>
          <div className="text-muted leading-relaxed max-w-xs">
            The verified history that travels with the hull.
          </div>
        </div>
        <div className="space-y-2">
          <div className="label">Schema</div>
          <div className="font-mono text-[12px] text-ink">2026.05.25</div>
          <div className="text-muted leading-relaxed">
            Field names match the production database, no remapping.
          </div>
        </div>
        <div className="space-y-2 sm:text-right">
          <div className="label">Folio</div>
          <div className="font-mono text-[12px] text-ink">© {new Date().getFullYear()} VesselIQ</div>
          <div className="text-muted">All marks owner authorized.</div>
        </div>
      </div>
    </footer>
  );
}
