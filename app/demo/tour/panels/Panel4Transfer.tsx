import type { Passport } from "@/lib/passport-types";
import { PassportHeader } from "@/app/passport/[slug]/components/PassportHeader";
import { TourTransferProgress } from "../components/TourTransferProgress";
import { TransferBand } from "@/app/passport/[slug]/components/TransferBand";
import { PASSPORT_SLUG } from "@/lib/passport-data";

export function Panel4Transfer({ data }: { data: Passport }) {
  return (
    <article className="space-y-0">
      <TourTransferProgress />
      <PassportHeader data={data} view="transfer" isSample={true} slug={PASSPORT_SLUG} />
      <TransferBand
        slug={PASSPORT_SLUG}
        fromParty="Illustrative seller"
        toParty="Illustrative buyer"
        demoEnabled={false}
      />
    </article>
  );
}
