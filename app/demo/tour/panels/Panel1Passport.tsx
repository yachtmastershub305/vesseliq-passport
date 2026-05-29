import type { Passport } from "@/lib/passport-types";
import { PassportHeader } from "@/app/passport/[slug]/components/PassportHeader";
import { PASSPORT_SLUG } from "@/lib/passport-data";

export function Panel1Passport({ data }: { data: Passport }) {
  return (
    <article className="space-y-8">
      <PassportHeader data={data} view="full" isSample={true} slug={PASSPORT_SLUG} />
    </article>
  );
}
