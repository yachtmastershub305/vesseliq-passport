export function SectionMark({
  numeral,
  label,
}: {
  numeral: string;
  label: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-serif-italic text-[15px] text-muted">§ {numeral}</span>
      <span className="label-ink">{label}</span>
    </div>
  );
}
