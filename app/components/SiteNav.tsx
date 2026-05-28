import Link from "next/link";

export function SiteNav() {
  return (
    <header className="border-b border-line-strong/60 no-print" style={{ borderColor: "var(--brand-line-strong)" }}>
      <div className="container-doc flex items-center justify-between py-5">
        <Link href="/" className="flex items-baseline gap-2 text-ink">
          <span className="font-serif text-[22px] tracking-tight leading-none">VesselIQ</span>
          <span className="font-serif-italic text-[22px] leading-none">Passport</span>
        </Link>
        <nav className="flex items-baseline gap-7 text-[13.5px]">
          <Link
            href="/passport/bruce-wayne"
            className="text-ink/70 hover:text-ink transition-colors"
          >
            Live record
          </Link>
          <Link href="/#access" className="text-ink/70 hover:text-ink transition-colors">
            Create a Passport
          </Link>
          <span className="hidden sm:inline label">VIQ / 2026</span>
        </nav>
      </div>
    </header>
  );
}
