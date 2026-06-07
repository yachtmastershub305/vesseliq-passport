"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isUuidLike, type TransferRequestResult, type TransferRequestStatus } from "@/lib/backend";
import { PRICING } from "@/lib/pricing";
import type { ViewState } from "@/lib/passport-view";

type GatePhase = "closed" | "request" | "submitted" | "authorized";
type GateMode = "live" | "demo";

type StoredRequest = {
  requestId: string;
  status: TransferRequestStatus;
  createdAt: string;
};

type GateCtx = {
  phase: GatePhase;
  setPhase: (phase: GatePhase) => void;
  slug: string;
  vesselName: string;
  demoEnabled: boolean;
  view: ViewState;
  mode: GateMode;
  requestId: string | null;
  requestStatus: TransferRequestStatus | null;
  requestCreatedAt: string | null;
  requestLoading: boolean;
  refreshRequest: () => Promise<void>;
  applyRequestResult: (result: TransferRequestResult) => void;
  clearRequest: () => void;
};

const STEPS: { key: GatePhase | "transfer"; label: string }[] = [
  { key: "request", label: "Request submitted" },
  { key: "submitted", label: "Broker authorization" },
  { key: "authorized", label: "Payment" },
  { key: "transfer", label: "Transfer complete" },
];

const REQUEST_STORAGE_PREFIX = "transfer-request:";

const GateContext = createContext<GateCtx | null>(null);

function useGate(): GateCtx {
  const ctx = useContext(GateContext);
  if (!ctx) {
    throw new Error("AcquireFlow components must be used inside <AcquireFlowProvider>");
  }
  return ctx;
}

function storageKey(passportId: string) {
  return `${REQUEST_STORAGE_PREFIX}${passportId}`;
}

function readStoredRequest(passportId: string): StoredRequest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey(passportId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredRequest>;
    if (!parsed.requestId || !parsed.status || !parsed.createdAt) return null;
    return {
      requestId: parsed.requestId,
      status: parsed.status,
      createdAt: parsed.createdAt,
    } as StoredRequest;
  } catch {
    return null;
  }
}

function writeStoredRequest(passportId: string, result: TransferRequestResult) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    storageKey(passportId),
    JSON.stringify({
      requestId: result.request_id,
      status: result.status,
      createdAt: result.created_at,
    })
  );
}

function clearStoredRequest(passportId: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(storageKey(passportId));
}

function activeRequest(status: TransferRequestStatus | null) {
  return status === "requested" || status === "authorized" || status === "payment_pending";
}

function phaseFromStatus(status: TransferRequestStatus | null, view: ViewState): GatePhase {
  if (status === "requested" || status === "rejected") return "submitted";
  if (status === "authorized" || status === "payment_pending") return "authorized";
  if (view === "transfer") return "authorized";
  return "closed";
}

function stepFromState(
  mode: GateMode,
  phase: GatePhase,
  status: TransferRequestStatus | null,
  view: ViewState
): number {
  if (mode === "demo") {
    if (phase === "request") return 0;
    if (phase === "submitted") return 1;
    if (phase === "authorized") return 2;
    if (view === "transfer") return 3;
    return 0;
  }

  if (status === "requested" || status === "rejected") return 1;
  if (status === "authorized" || status === "payment_pending") return 2;
  if (status === "completed" || view === "transfer") return 3;
  if (phase === "request") return 0;
  return 0;
}

function statusLabel(status: TransferRequestStatus | null) {
  if (status === "requested") return "Awaiting broker review";
  if (status === "authorized") return "Broker authorized";
  if (status === "payment_pending") return "Payment pending";
  if (status === "completed") return "Transfer completed";
  if (status === "rejected") return "Request rejected";
  return null;
}

function statusMessage(status: TransferRequestStatus | null) {
  if (status === "requested") {
    return "The broker managing this sale has been notified. You will receive an email when they authorize access.";
  }
  if (status === "authorized") {
    return "The broker has authorized access. Payment handling is the next backend milestone.";
  }
  if (status === "payment_pending") {
    return "Authorization is complete and the request is waiting for payment handling to be wired in.";
  }
  if (status === "completed") {
    return "This transfer request is complete.";
  }
  if (status === "rejected") {
    return "The broker did not authorize release of this Passport.";
  }
  return null;
}

function formatRequestDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

async function createLiveTransferRequest(passportId: string, payload: {
  requester_name: string;
  requester_email: string;
  message?: string;
}) {
  const res = await fetch(`/api/passport/${passportId}/transfer-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error =
      body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string"
        ? (body as { error: string }).error
        : "Submission failed. Try again.";
    throw new Error(error);
  }
  return body as TransferRequestResult;
}

async function fetchLiveTransferRequest(passportId: string, requestId: string) {
  const res = await fetch(`/api/passport/${passportId}/transfer-requests/${requestId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error =
      body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string"
        ? (body as { error: string }).error
        : "Request lookup failed.";
    throw new Error(error);
  }
  return body as TransferRequestResult;
}

export function AcquireFlowProvider({
  slug,
  vesselName,
  demoEnabled = false,
  view,
  children,
}: {
  slug: string;
  vesselName: string;
  demoEnabled?: boolean;
  view: ViewState;
  children: ReactNode;
}) {
  const router = useRouter();
  const mode: GateMode = isUuidLike(slug) ? "live" : "demo";
  const stored = mode === "live" ? readStoredRequest(slug) : null;
  const [phase, setPhase] = useState<GatePhase>(phaseFromStatus(stored?.status ?? null, view));
  const [requestId, setRequestId] = useState<string | null>(stored?.requestId ?? null);
  const [requestStatus, setRequestStatus] = useState<TransferRequestStatus | null>(stored?.status ?? null);
  const [requestCreatedAt, setRequestCreatedAt] = useState<string | null>(stored?.createdAt ?? null);
  const [requestLoading, setRequestLoading] = useState(false);

  function clearRequest() {
    setRequestId(null);
    setRequestStatus(null);
    setRequestCreatedAt(null);
    clearStoredRequest(slug);
  }

  function applyRequestResult(result: TransferRequestResult) {
    setRequestId(result.request_id);
    setRequestStatus(result.status);
    setRequestCreatedAt(result.created_at);
    setPhase(phaseFromStatus(result.status, view));

    if (result.status === "requested" || result.status === "authorized" || result.status === "payment_pending") {
      writeStoredRequest(slug, result);
    } else {
      clearStoredRequest(slug);
    }

    if (result.status === "completed") {
      if (result.successor_passport_id) {
        router.push(`/passport/${result.successor_passport_id}?view=full&from=gate`);
      } else {
        router.push(`/passport/${slug}?from=gate`);
      }
    }
  }

  async function refreshRequest() {
    if (mode !== "live" || !requestId) return;
    setRequestLoading(true);
    try {
      const result = await fetchLiveTransferRequest(slug, requestId);
      applyRequestResult(result);
    } finally {
      setRequestLoading(false);
    }
  }

  return (
    <GateContext.Provider
      value={{
        phase,
        setPhase,
        slug,
        vesselName,
        demoEnabled,
        view,
        mode,
        requestId,
        requestStatus,
        requestCreatedAt,
        requestLoading,
        refreshRequest,
        applyRequestResult,
        clearRequest,
      }}
    >
      {children}
      {phase !== "closed" && <GateSheet />}
    </GateContext.Provider>
  );
}

export function AcquirePanel() {
  const { setPhase, requestStatus, requestCreatedAt } = useGate();

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
          <div className="mt-5 flex flex-col items-start gap-3 lg:items-end">
            {requestStatus && requestCreatedAt && (
              <div className="text-[12.5px] text-ink/75 text-left lg:text-right">
                <div className="label">Current request</div>
                <div className="mt-1">
                  {statusLabel(requestStatus)} · {formatRequestDate(requestCreatedAt)}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setPhase(requestStatus ? phaseFromStatus(requestStatus, "preview") : "request")}
              className="cta-primary cta-primary-lg"
            >
              {requestStatus ? "View request" : "Unlock and transfer"}
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

export function TransferProgressBanner() {
  const { phase, requestStatus, view, mode } = useGate();
  const show =
    mode === "demo"
      ? phase !== "closed" || view === "transfer"
      : view === "transfer" || phase === "request" || activeRequest(requestStatus);

  if (!show) return null;

  const currentStep = stepFromState(mode, phase, requestStatus, view);

  return (
    <div
      className="sticky top-0 z-30 backdrop-blur-md border-t border-b no-print"
      style={{
        backgroundColor: "rgba(250, 246, 236, 0.94)",
        borderColor: "var(--brand-line-strong)",
      }}
      role="region"
      aria-label="Transfer progress"
    >
      <div className="container-doc py-2.5 flex items-center justify-between gap-3 sm:gap-4">
        <span className="label-ink shrink-0">
          {mode === "live" ? statusLabel(requestStatus) ?? "Transfer request" : "Transfer in progress"}
        </span>

        <div className="sm:hidden flex items-center gap-2 min-w-0">
          <StepDot done={false} current={true} />
          <span className="text-[12px] text-ink truncate">
            <span className="font-mono text-muted-2">{currentStep + 1}/4</span>{" "}
            {STEPS[currentStep].label}
          </span>
        </div>

        <ol className="hidden sm:flex items-center gap-x-2 gap-y-2 flex-wrap">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            const labelClass = isDone
              ? "text-ink/70"
              : isCurrent
                ? "text-ink"
                : "text-muted-2";
            return (
              <li key={step.key} className="flex items-center gap-1.5">
                <StepDot done={isDone} current={isCurrent} />
                <span className={`text-[12.5px] ${labelClass}`}>{step.label}</span>
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="text-muted-2 px-1.5 text-[10px]">
                    →
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function StickyAcquireBar() {
  const { phase, setPhase, requestStatus } = useGate();
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
            onClick={() => setPhase(requestStatus ? phaseFromStatus(requestStatus, "preview") : "request")}
            className="cta-primary shrink-0"
          >
            {requestStatus ? "View request" : "Unlock and transfer"}
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
  const {
    phase,
    setPhase,
    slug,
    vesselName,
    demoEnabled,
    view,
    mode,
    requestStatus,
    requestCreatedAt,
    requestLoading,
    refreshRequest,
    clearRequest,
  } = useGate();
  const router = useRouter();
  const demoSuffix = demoEnabled ? "&demo=1" : "";
  const currentStep = stepFromState(mode, phase, requestStatus, view);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhase("closed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPhase]);

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
          {mode === "live" ? `${statusLabel(requestStatus) ?? "Acquire the Passport"} for ${vesselName}` : `Acquire the Passport for ${vesselName}`}
        </h3>

        <StatusSequence currentStep={currentStep} />

        <div className="mt-7">
          {mode === "demo" ? (
            <>
              {phase === "request" && <DemoRequestStep onSubmitted={() => setPhase("submitted")} />}
              {phase === "submitted" && (
                <DemoAwaitingBrokerStep
                  onAuthorize={() => setPhase("authorized")}
                  onClose={() => setPhase("closed")}
                />
              )}
              {phase === "authorized" && (
                <DemoPaymentStep
                  onAdvance={() => {
                    setPhase("closed");
                    router.push(`/passport/${slug}?view=transfer&from=gate${demoSuffix}`);
                  }}
                  onClose={() => setPhase("closed")}
                />
              )}
            </>
          ) : phase === "request" && (!requestStatus || requestStatus === "rejected") ? (
            <LiveRequestStep />
          ) : requestStatus === "requested" ? (
            <LiveAwaitingBrokerStep
              createdAt={requestCreatedAt}
              loading={requestLoading}
              onRefresh={refreshRequest}
              onClose={() => setPhase("closed")}
            />
          ) : requestStatus === "authorized" || requestStatus === "payment_pending" ? (
            <LivePaymentStep
              status={requestStatus}
              createdAt={requestCreatedAt}
              loading={requestLoading}
              onRefresh={refreshRequest}
              onClose={() => setPhase("closed")}
            />
          ) : requestStatus === "rejected" ? (
            <RejectedStep
              createdAt={requestCreatedAt}
              onRestart={() => {
                clearRequest();
                setPhase("request");
              }}
              onClose={() => setPhase("closed")}
            />
          ) : (
            <LiveRequestStep />
          )}
        </div>
      </div>
    </div>
  );
}

function StatusSequence({ currentStep }: { currentStep: number }) {
  return (
    <ol
      className="mt-7 border-t border-b py-5"
      style={{ borderColor: "var(--brand-line)" }}
    >
      {STEPS.map((step, i) => {
        const isDone = i < currentStep;
        const isCurrent = i === currentStep;
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
            <span className={`ml-auto label ${isCurrent ? "text-ink/85" : ""}`}>
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

function LiveRequestStep() {
  const { slug, applyRequestResult } = useGate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setSubmitting(true);
    setErrorMsg("");
    try {
      const result = await createLiveTransferRequest(slug, {
        requester_name: String(fd.get("name") ?? "").trim(),
        requester_email: String(fd.get("email") ?? "").trim(),
        message: String(fd.get("message") ?? "").trim() || undefined,
      });
      applyRequestResult(result);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Submission failed. Try again.");
    } finally {
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

function LiveAwaitingBrokerStep({
  createdAt,
  loading,
  onRefresh,
  onClose,
}: {
  createdAt: string | null;
  loading: boolean;
  onRefresh: () => Promise<void>;
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
        {createdAt && (
          <div className="mt-4 text-[12px] text-muted">
            Submitted {formatRequestDate(createdAt)}
          </div>
        )}
      </div>

      <div className="border-t border-dashed pt-4" style={{ borderColor: "var(--brand-line-strong)" }}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="label">Backend request state</span>
          <span className="font-mono text-[10px] text-muted">live</span>
        </div>
        <div className="mt-3 flex items-center gap-5 flex-wrap">
          <button
            type="button"
            onClick={() => void onRefresh()}
            className="inline-flex items-baseline gap-2 text-[14px] text-ink/85 border-b border-dashed border-ink/60 hover:border-solid hover:border-ink hover:text-ink pb-0.5 transition-colors"
          >
            {loading ? "Refreshing." : "Refresh status"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="label hover:text-ink transition-colors"
          >
            Close, return later
          </button>
        </div>
      </div>
    </div>
  );
}

function LivePaymentStep({
  status,
  createdAt,
  loading,
  onRefresh,
  onClose,
}: {
  status: TransferRequestStatus;
  createdAt: string | null;
  loading: boolean;
  onRefresh: () => Promise<void>;
  onClose: () => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="border p-5"
        style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}
      >
        <div className="label">{statusLabel(status)}</div>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink/85">{statusMessage(status)}</p>
        <dl className="mt-5 space-y-1">
          <Row k="Asset" v="Passport, vessel of record" />
          <Row k="Pricing" v={PRICING.transfer.headline} />
          {createdAt && <Row k="Requested" v={formatRequestDate(createdAt)} />}
        </dl>
      </div>

      <div
        className="p-4 border"
        style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}
      >
        <div className="label">Payment integration</div>
        <p className="mt-2 text-[13.5px] text-ink/85 leading-[1.55]">
          Payment handling remains a backend placeholder in this phase. Refresh the request to see
          when broker authorization moves forward.
        </p>
      </div>

      <div className="border-t border-dashed pt-4" style={{ borderColor: "var(--brand-line-strong)" }}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="label">Backend request state</span>
          <span className="font-mono text-[10px] text-muted">live</span>
        </div>
        <div className="mt-3 flex items-center gap-5 flex-wrap">
          <button
            type="button"
            onClick={() => void onRefresh()}
            className="inline-flex items-baseline gap-2 text-[14px] text-ink/85 border-b border-dashed border-ink/60 hover:border-solid hover:border-ink hover:text-ink pb-0.5 transition-colors"
          >
            {loading ? "Refreshing." : "Refresh status"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="label hover:text-ink transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectedStep({
  createdAt,
  onRestart,
  onClose,
}: {
  createdAt: string | null;
  onRestart: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="border p-5"
        style={{ borderColor: "rgb(150, 25, 25)", backgroundColor: "rgba(180, 30, 30, 0.04)" }}
      >
        <div className="label">Request rejected</div>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink/85">
          The broker did not authorize release of this Passport. You can submit a fresh request if
          the circumstances have changed.
        </p>
        {createdAt && (
          <div className="mt-4 text-[12px] text-muted">
            Last updated {formatRequestDate(createdAt)}
          </div>
        )}
      </div>
      <div className="flex items-center gap-5 flex-wrap">
        <button type="button" onClick={onRestart} className="cta-primary">
          Start a new request
          <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" onClick={onClose} className="label hover:text-ink transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

function DemoRequestStep({ onSubmitted }: { onSubmitted: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    onSubmitted();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="text-[14px] leading-[1.6] text-ink/85">
        Tell us who you are. The broker managing this sale will review and decide whether to
        release the record to you.
      </p>
      <label className="block">
        <span className="label">Name</span>
        <input required name="name" type="text" autoComplete="name" className="uinput mt-2" placeholder="Jane Mariner" />
      </label>
      <label className="block">
        <span className="label">Email</span>
        <input required name="email" type="email" autoComplete="email" className="uinput mt-2" placeholder="jane@example.com" />
      </label>
      <label className="block">
        <span className="label">Message to the broker, optional</span>
        <textarea name="message" rows={3} className="uinput mt-2" placeholder="A line on your interest in this vessel helps the broker decide." />
      </label>
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

function DemoAwaitingBrokerStep({
  onAuthorize,
  onClose,
}: {
  onAuthorize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="border p-5" style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}>
        <div className="label">Request submitted</div>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink/85">
          The broker managing this sale has been notified. You will receive an email when they
          authorize access. Until then, the full record stays sealed.
        </p>
      </div>

      <div className="border-t border-dashed pt-4" style={{ borderColor: "var(--brand-line-strong)" }}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="label">Demo affordance</span>
          <span className="font-mono text-[10px] text-muted">internal only</span>
        </div>
        <div className="mt-3 flex items-center gap-5 flex-wrap">
          <button
            type="button"
            onClick={onAuthorize}
            className="inline-flex items-baseline gap-2 text-[14px] text-ink/85 border-b border-dashed border-ink/60 hover:border-solid hover:border-ink hover:text-ink pb-0.5 transition-colors"
          >
            Simulate broker authorization
          </button>
          <button type="button" onClick={onClose} className="label hover:text-ink transition-colors">
            Close, return later
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoPaymentStep({
  onAdvance,
  onClose,
}: {
  onAdvance: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="border p-5" style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}>
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

      <div className="p-4 border" style={{ borderColor: "var(--brand-line)", backgroundColor: "var(--brand-paper-2)" }}>
        <div className="label">Payment integration</div>
        <p className="mt-2 text-[13.5px] text-ink/85 leading-[1.55]">
          Payment integration is coming soon. For the demo, simulate the payment to advance the
          Passport into transfer pending.
        </p>
      </div>

      <div className="border-t border-dashed pt-4" style={{ borderColor: "var(--brand-line-strong)" }}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="label">Demo affordance</span>
          <span className="font-mono text-[10px] text-muted">internal only</span>
        </div>
        <div className="mt-3 flex items-center gap-5 flex-wrap">
          <button
            type="button"
            onClick={onAdvance}
            className="inline-flex items-baseline gap-2 text-[14px] text-ink/85 border-b border-dashed border-ink/60 hover:border-solid hover:border-ink hover:text-ink pb-0.5 transition-colors"
          >
            Simulate payment, advance to transfer pending
          </button>
          <button type="button" onClick={onClose} className="label hover:text-ink transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b py-1.5" style={{ borderColor: "var(--brand-line)" }}>
      <span className="label">{k}</span>
      <span className="text-[13.5px] text-ink">{v}</span>
    </div>
  );
}
