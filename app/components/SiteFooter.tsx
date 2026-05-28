export function SiteFooter() {
  return (
    <footer className="mt-24 border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[13px] text-muted">
        <div className="flex items-center gap-2 text-ink/80">
          <span>VesselIQ</span>
          <span className="font-serif-italic">Passport</span>
          <span className="text-muted">, the verified history that travels with the hull.</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="font-mono text-[11px] tracking-wider uppercase text-muted">
            Schema 2026.05.25
          </span>
          <span className="text-muted">© {new Date().getFullYear()} VesselIQ</span>
        </div>
      </div>
    </footer>
  );
}
