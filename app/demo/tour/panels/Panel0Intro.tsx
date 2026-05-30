export function Panel0Intro() {
  const phases = [
    {
      n: "01",
      title: "You enter the HIN",
      body:
        "We look it up. If we already have a record we show you the preview. If not, you can claim it and we begin building one.",
    },
    {
      n: "02",
      title: "We collect the data and digitize the operation",
      body:
        "Our team scans registration, survey, manuals, service receipts. We verify identity against USCG, IMO, MIC, and OEM registries. Equipment is captured at commissioning, signed by the engineer.",
    },
    {
      n: "03",
      title: "You get a tamper proof record",
      body:
        "Only you can transfer it. No one can modify the data. Every fact carries a source, a signature, a capture timestamp. The whole snapshot is cryptographically signed.",
    },
    {
      n: "04",
      title: "Brokers manage transfers with your authorization",
      body:
        "Sales are a different problem. A broker can run the transfer, but only with your authorization. You hold the key throughout.",
    },
  ];

  return (
    <article className="pt-2 sm:pt-6">
      <div className="label">How a Passport is built</div>
      <h1 className="mt-4 display text-[40px] sm:text-[56px] md:text-[68px] text-ink leading-[1.0] max-w-3xl">
        From HIN to{" "}
        <span className="display-italic">a signed record</span>{" "}
        you control.
      </h1>
      <p className="mt-6 text-[16px] sm:text-[17px] leading-[1.6] text-ink/80 max-w-2xl">
        Every Passport starts the same way. You enter a HIN, we do the work,
        you end up with a verified record only you can transfer. Brokers
        manage the sale with your authorization. Insurers underwrite on
        verified data, not paperwork.
      </p>

      <ol className="mt-12 space-y-0">
        {phases.map((p, i) => (
          <li
            key={p.n}
            className={`grid grid-cols-[44px_1fr] sm:grid-cols-[64px_1fr] gap-x-4 sm:gap-x-6 py-6 sm:py-7 ${
              i === 0 ? "border-t" : ""
            } border-b`}
            style={{ borderColor: "var(--brand-line-strong)" }}
          >
            <div className="font-mono text-[12px] sm:text-[13px] tracking-wider text-muted">
              {p.n}
            </div>
            <div>
              <h3 className="font-serif-italic text-[22px] sm:text-[26px] leading-[1.15] text-ink max-w-2xl">
                {p.title}
              </h3>
              <p className="mt-3 text-[14.5px] sm:text-[15px] leading-[1.6] text-ink/80 max-w-2xl">
                {p.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
