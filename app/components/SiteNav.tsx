import Link from "next/link";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[rgba(246,244,239,0.78)] border-b hairline">
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-ink">
          <Logomark />
          <span className="text-[15px] tracking-tight">
            VesselIQ <span className="font-serif-italic">Passport</span>
          </span>
        </Link>
        <div className="flex items-center gap-6 text-[13px]">
          <Link href="/passport/meridian" className="text-ink/80 hover:text-ink transition-colors">
            View a live Passport
          </Link>
          <Link
            href="#access"
            className="inline-flex items-center h-8 px-3 rounded-full bg-ink text-canvas hover:bg-teal-deep transition-colors"
          >
            Request access
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Logomark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 13 Q11 6 17 13" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="11" cy="11" r="1.6" fill="var(--brand-teal)" />
    </svg>
  );
}
