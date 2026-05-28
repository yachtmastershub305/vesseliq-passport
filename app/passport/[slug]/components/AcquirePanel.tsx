"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { PRICING } from "@/lib/pricing";

type GatePhase = "closed" | "request" | "submitted" | "authorized";

const STEPS: { key: GatePhase | "transfer"; label: string }[] = [
  { key: "request", label: "Request submitted" },
  { key: "submitted", label: "Broker authorization" },
  { key: "authorized", label: "Payment" },
  { key: "transfer", label: "Transfer complete" },
];

type GateCtx = {
  phase: GatePhase;
  setPhase: (p: GatePhase) => void;
  slug: string;
  vesselName: string;
};

const GateContext = createContext<GateCtx | null>(null);

function useGate(): GateCtx {
  const ctx = useContext(GateContext);
  if (!ctx) {
    throw new Error("AcquireFlow components must be used inside <AcquireFlowProvider>");
  }
  return ctx;
}

export function AcquireFlowProvider({
  slug,
  vesselName,
  children,
}: {
  slug: string;
  vesselName: string;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<GatePhase>("closed");
  return (
    <GateContext.Provider value={{ phase, setPhase, slug, vesselName }}>
      {children}
      {phase !== "closed" && <GateSheet />}
    </GateContext.Provider>
  );
}

export function AcquirePanel() {
  const { setPhase } = useGate();

  return (
    <section
      id="acquire"
      className="relative border-t border-b py-10 no-print"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-baseline">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-baseline gap-3">
            <span className="font-serif-italic text-[15px] text-muted">§</span>
            <span className="label-ink">Acquire this Passport</span>
          </div>
          <h2 className="mt-3 display text-[34px] sm:text-[46px] leading-[1.04] text-ink max-w-2xl">
            This vessel has a certified Passport.{" "}
            <span className="display-italic">Acquire it to unlock</span> the full verified record
            and receive ownership transfer.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-ink/75 max-w-xl">
            Sensitive vessel records are released only after the broker managing this sale
            authorizes you as the buyer. Broker holds the key. Once authorized, payment unlocks
            the complete record and moves ownership of the Passport to the new holder.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:text-right">
          <div className="label">Pricing</div>
          <div className="mt-2 font-serif text-[28px] text-ink">{PRICING.transfer.headline}</div>
          <div className="mt-1 text-[12.5px] text-muted leading-[1.5] max-w-xs lg:ml-auto">
            {PRICING.transfer.suffix}
          </div>
          <div className="mt-5 flex lg:justify-end">
            <button
              type="button"
              onClick={() => setPhase("request")}
              className="cta-primary cta-primary-lg"
            >
              Unlock and transfer
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StickyAcquireBar() {
  const { phase, setPhase } = useGate();
  if (phase !== "closed") return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 no-print"
      role="region"
      aria-label="Unlock action"
    >
      <div
        className="border-t backdrop-blur-md"
        style={{
          backgroundColor: "rgba(245,240,227,0.94)",
          borderColor: "var(--brand-line-strong)",
          boxShadow: "0 -4px 20px -10px rgba(12, 17, 23, 0.18)",
        }}
      >
        <div className="container-doc py-3 flex items-center justify-between gap-4">
          <div className="min-w-0 flex items-baseline gap-3 sm:gap-4">
            <span className="label hidden sm:inline">Locked</span>
            <span className="text-[13.5px] text-ink/85 truncate">
              <span className="hidden sm:inline">Full record and ownership transfer, </span>
              <span className="font-mono text-ink/85">{PRICING.transfer.headline}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPhase("request")}
            className="cta-primary shrink-0"
          >
            Unlock and transfer
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function GateSheet() {
  const { phase, setPhase, slug, vesselName } = useGate();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "request") setPhase("closed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, setPhase]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 no-print"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => setPhase("closed")}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        className="relative w-full max-w-xl p-7 sm:p-9 max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: "var(--brand-paper-3)", border: "1px solid var(--brand-line-strong)" }}
      >
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-serif-italic text-[14px] text-muted">§</span>
            <span className="label-ink">Access gate</span>
          </div>
          <button
            type="button"
            onClick={() => setPhase("closed")}
            className="label hover:text-ink transition-colors"
            aria-label="Close access gate"
          >
            Close ×
          </button>
        </div>

        <h3 id="gate-title" className="mt-5 display-italic text-[30px] leading-[1.15] text-ink">
          Acquire the Passport for {vesselName}.
        </h3>

        <StatusSequence phase={phase} />

        <div className="mt-7">
          {phase === "request" && (
            <RequestStep slug={slug} onSubmitted={() => setPhase("submitted")} />
          )}
          {phase === "submitted" && (
            <AwaitingBrokerStep
              onSimulateAuthorize={() => setPhase("authorized")}
              onClose={() => setPhase("closed")}
            />
          )}
          {phase === "authorized" && (
            <PaymentStep
              onSimulatePayment={() => {
                setPhase("closed");
                router.push(`/passport/${slug}?view=transfer&from=gate`);
              }}
              onClose={() => setPhase("closed")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatusSequence({ phase }: { phase: GatePhase }) {
  // Maps each step to its visual status given the current phase.
  // request, current step is Request submitted (just being filled)
  // submitted, completed Request, current Broker authorization
  // authorized, completed Request + Broker, current Payment
  const completedAt: Record<GatePhase, number> = {
    closed: 0,
    request: 0,
    submitted: 1,
    authorized: 2,
  };
  const completed = completedAt[phase];

  return (
    <ol
      className="mt-7 border-t border-b py-5"
      style={{ borderColor: "var(--brand-line)" }}
    >
      {STEPS.map((step, i) => {
        const isDone = i < completed;
        const isCurrent = i === completed;
        return (
          <li key={step.key} className="flex items-baseline gap-4 py-1.5">
            <StepDot done={isDone} current={isCurrent} />
            <span
              className={`text-[14px] ${
                isDone ? "text-ink/80" : isCurrent ? "text-ink" : "text-muted-2"
              }`}
            >
              {step.label}
            </span>
            <span
              className={`ml-auto label ${isCurrent ? "text-ink/85" : ""}`}
            >
              {isDone ? "Done" : isCurrent ? "In progress" : "Pending"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepDot({ done, current }: { done: boolean; current: boolean }) {
  if (done) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="var(--brand-teal)" />
        <path d="M4.5 7.2l1.6 1.6 3.4-3.6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (current) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="none" stroke="var(--brand-ink)" strokeWidth="1.4" strokeDasharray="2 2" />
        <circle cx="7" cy="7" r="2" fill="var(--brand-ink)" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="none" stroke="var(--brand-line-strong)" strokeWidth="1" />
    </svg>
  );
}

function RequestStep({
  slug,
  onSubmitted,
}: {
  slug: string;
  onSubmitted: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      role: "Buyer",
      offer: "transfer_access_request",
      message: String(fd.get("message") ?? "").trim(),
      passportSlug: slug,
    };
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.error ?? "Submission failed. Try again.");
        setSubmitting(false);
        return;
      }
      onSubmitted();
    } catch {
      setErrorMsg("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="text-[14px] leading-[1.6] text-ink/85">
        Tell us who you are. The broker managing this sale will review and decide whether to
        release the record to you.
      </p>
      <label className="block">
        <span className="label">Name</span>
        <input
          required
          name="name"
          type="text"
          autoComplete="name"
          className="uinput mt-2"
          placeholder="Jane Mariner"
        />
      </label>
      <label className="block">
        <span className="label">Email</span>
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          className="uinput mt-2"
          placeholder="jane@example.com"
        />
      </label>
      <label className="block">
        <span className="label">Message to the broker, optional</span>
        <textarea
          name="message"
          rows={3}
          className="uinput mt-2"
          placeholder="A line on your interest in this vessel helps the broker decide."
        />
      </label>

      {errorMsg && (
        <div className="text-[13px] text-red-800 border-t border-red-300 pt-2">{errorMsg}</div>
      )}

      <div className="flex items-baseline justify-between gap-4 pt-2">
        <p className="text-[11.5px] text-muted max-w-[15rem] leading-[1.5]">
          The broker is the only party who can release access.
        </p>
        <button type="submit" disabled={submitting} className="cta-primary">
          {submitting ? "Submitting." : "Submit request"}
          <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}

function AwaitingBrokerStep({
  onSimulateAuthorize,
  onClose,
}: {
  onSimulateAuthorize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="border p-5"
        style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}
      >
        <div className="label">Request submitted</div>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink/85">
          The broker managing this sale has been notified. You will receive an email when they
          authorize access. Until then, the full record stays sealed.
        </p>
      </div>

      <DemoAffordance>
        <p className="text-[12.5px] text-ink/75 leading-[1.5] max-w-md">
          The broker reviews the request and grants or denies access. In production this is an
          asynchronous step measured in hours. For the demo, simulate the broker decision below.
        </p>
        <div className="mt-4 flex items-center gap-5 flex-wrap">
          <button
            type="button"
            onClick={onSimulateAuthorize}
            className="inline-flex items-baseline gap-2 text-[14px] text-ink/85 border-b border-dashed border-ink/60 hover:border-solid hover:border-ink hover:text-ink pb-0.5 transition-colors"
          >
            Simulate broker authorization
          </button>
          <button
            type="button"
            onClick={onClose}
            className="label hover:text-ink transition-colors"
          >
            Close, return later
          </button>
        </div>
      </DemoAffordance>
    </div>
  );
}

function PaymentStep({
  onSimulatePayment,
  onClose,
}: {
  onSimulatePayment: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="border p-5"
        style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}
      >
        <div className="label">Broker authorized</div>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink/85">
          You are cleared to acquire this Passport. Payment unlocks the full record and moves
          ownership to your account.
        </p>
        <dl className="mt-5 space-y-1">
          <Row k="Asset" v="Passport, vessel of record" />
          <Row k="Pricing" v={PRICING.transfer.headline} />
          <Row k="Settlement" v="Within 7 business days of payment" />
        </dl>
      </div>

      <div
        className="p-4 border"
        style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}
      >
        <div className="label">Payment integration</div>
        <p className="mt-2 text-[13.5px] text-ink/85 leading-[1.55]">
          Payment integration is coming soon. For the demo, simulate the payment to advance the
          Passport into transfer pending.
        </p>
      </div>

      <DemoAffordance>
        <div className="flex items-center gap-5 flex-wrap">
          <button
            type="button"
            onClick={onSimulatePayment}
            className="inline-flex items-baseline gap-2 text-[14px] text-ink/85 border-b border-dashed border-ink/60 hover:border-solid hover:border-ink hover:text-ink pb-0.5 transition-colors"
          >
            Simulate payment, advance to transfer pending
          </button>
          <button
            type="button"
            onClick={onClose}
            className="label hover:text-ink transition-colors"
          >
            Close
          </button>
        </div>
      </DemoAffordance>
    </div>
  );
}

function DemoAffordance({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border-t border-dashed pt-4"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="label">Demo affordance</span>
        <span className="font-mono text-[10px] text-muted">internal only</span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3 border-b py-1.5"
      style={{ borderColor: "var(--brand-line)" }}
    >
      <span className="label">{k}</span>
      <span className="text-[13.5px] text-ink">{v}</span>
    </div>
  );
}
