export function CornerMark({
  position,
  size = 18,
}: {
  position: "tl" | "tr" | "bl" | "br";
  size?: number;
}) {
  const half = size / 2;
  const stroke = "var(--brand-line-strong)";
  const sw = 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="pointer-events-none"
      style={{ display: "block" }}
    >
      <circle cx={half} cy={half} r={half - 3} fill="none" stroke={stroke} strokeWidth={sw} />
      <line x1={half} y1={0} x2={half} y2={size} stroke={stroke} strokeWidth={sw} />
      <line x1={0} y1={half} x2={size} y2={half} stroke={stroke} strokeWidth={sw} />
      <circle cx={half} cy={half} r={1} fill={stroke} />
    </svg>
  );
}

export function CornerFrame() {
  return (
    <>
      <div className="absolute left-4 top-4">
        <CornerMark position="tl" />
      </div>
      <div className="absolute right-4 top-4">
        <CornerMark position="tr" />
      </div>
      <div className="absolute left-4 bottom-4">
        <CornerMark position="bl" />
      </div>
      <div className="absolute right-4 bottom-4">
        <CornerMark position="br" />
      </div>
    </>
  );
}
