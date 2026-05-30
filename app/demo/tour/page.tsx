import { redirect, notFound } from "next/navigation";
import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter } from "@/app/components/SiteFooter";
import { passport } from "@/lib/passport-data";
import { Panel0Intro } from "./panels/Panel0Intro";
import { Panel1Passport } from "./panels/Panel1Passport";
import { Panel2Preview } from "./panels/Panel2Preview";
import { Panel3Verify } from "./panels/Panel3Verify";
import { Panel4Transfer } from "./panels/Panel4Transfer";
import { Panel5Closer } from "./panels/Panel5Closer";
import { TourChrome } from "./components/TourChrome";

const TOTAL_STEPS = 6;

const STEP_META = [
  {
    step: 1,
    label: "How it works",
    annotationEyebrow: "The story",
    annotationBody:
      "From HIN to a signed record you control. Four phases. The same flow every time, no matter the hull or the broker.",
  },
  {
    step: 2,
    label: "The Passport",
    annotationEyebrow: "What it is",
    annotationBody:
      "This is what your next listing could ship with. One canonical record per vessel, signed at source, anchored to a vessel version.",
  },
  {
    step: 3,
    label: "What the buyer sees",
    annotationEyebrow: "Buyer surface",
    annotationBody:
      "Before they pay, buyers see the proof, not the data. Identity confirmed, seal verified, score 94. They are sold before they call you.",
  },
  {
    step: 4,
    label: "Verification",
    annotationEyebrow: "Brand promise",
    annotationBody:
      "Tamper proof signature, ECDSA P-256, KMS signed. Buyers and their lawyers verify in one click. No more 'how do I know this is real'.",
  },
  {
    step: 5,
    label: "Transfer flow",
    annotationEyebrow: "Broker holds the key",
    annotationBody:
      "When the deal closes, you authorize the buyer. They pay. The Passport transfers. You hold the key through the entire process.",
  },
  {
    step: 6,
    label: "Your turn",
    annotationEyebrow: "Bring it to your listing",
    annotationBody:
      "Type the HIN of a vessel you list, we build the Passport. Your next listing ships with a verified record, day one.",
  },
] as const;

export default async function TourPage(props: PageProps<"/demo/tour">) {
  const sp = await props.searchParams;
  const raw = typeof sp.step === "string" ? sp.step : "1";
  const step = Number.parseInt(raw, 10);
  if (Number.isNaN(step) || step < 1 || step > TOTAL_STEPS) {
    redirect("/demo/tour?step=1");
  }

  const meta = STEP_META[step - 1];
  if (!meta) notFound();

  const data = passport;

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <TourChrome
          step={step}
          totalSteps={TOTAL_STEPS}
          stepLabel={meta.label}
          annotationEyebrow={meta.annotationEyebrow}
          annotationBody={meta.annotationBody}
        >
          {step === 1 && <Panel0Intro />}
          {step === 2 && <Panel1Passport data={data} />}
          {step === 3 && <Panel2Preview data={data} />}
          {step === 4 && <Panel3Verify data={data} />}
          {step === 5 && <Panel4Transfer data={data} />}
          {step === 6 && <Panel5Closer />}
        </TourChrome>
      </main>
      <SiteFooter />
    </>
  );
}
