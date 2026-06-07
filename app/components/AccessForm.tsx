"use client";

import Link from "next/link";
import { useState } from "react";
import type { OfferKey } from "@/lib/pricing";

type Role = "Broker" | "Buyer" | "Insurer" | "Builder" | "Other";

type AccessSuccess = {
  ok: true;
  offer: OfferKey;
  session_id: string;
  vessel_id: string | null;
  state: string;
  status: string | null;
};

const SUCCESS_COPY: Record<OfferKey, { eyebrow: string; headline: string; body: string }> = {
  create: {
    eyebrow: "Onboarding started",
    headline: "Your request is on file.",
    body: "We created an onboarding session for this hull and will continue from that record.",
  },
  acquire: {
    eyebrow: "Onboarding started",
    headline: "Your request is on file.",
    body: "We created an onboarding session and will use it to continue the acquisition workflow.",
  },
  transfer_access_request: {
    eyebrow: "Request recorded",
    headline: "Your access request is on file.",
    body: "We created an onboarding session to track this request while the backend transfer workflow is still being wired up.",
  },
};

export function AccessForm({
  offer = "create",
  submitLabel = "Request a Passport",
  hin,
  passportSlug,
}: {
  offer?: OfferKey;
  submitLabel?: string;
  hin?: string;
  passportSlug?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<AccessSuccess | null>(null);
  const successCopy = SUCCESS_COPY[offer];

  function buildErrorMessage(body: unknown): string {
    if (!body || typeof body !== "object") return "Submission failed. Try again.";
    const candidate = (body as { error?: unknown }).error;
    return typeof candidate === "string" && candidate.trim()
      ? candidate
      : "Submission failed. Try again.";
  }

  function isAccessSuccess(body: unknown): body is AccessSuccess {
    if (!body || typeof body !== "object") return false;
    const candidate = body as Partial<AccessSuccess>;
    return candidate.ok === true && typeof candidate.session_id === "string" && typeof candidate.state === "string";
  }

  function attachedPassportHref() {
    if (!passportSlug) return "/demo";
    return `/passport/${passportSlug}`;
  }

  function attachedPassportLabel() {
    return passportSlug ? "View attached Passport" : "Open a sample Passport";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      role: String(fd.get("role") ?? "Other") as Role,
      offer: String(fd.get("offer") ?? offer) as OfferKey,
      message: String(fd.get("message") ?? "").trim(),
      hin: hin?.trim() || undefined,
      passportSlug: passportSlug || undefined,
    };

    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !isAccessSuccess(body)) {
        setErrorMsg(buildErrorMessage(body));
        setStatus("error");
        return;
      }
      setSuccess(body);
      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "success" && success) {
    return (
      <div className="border-t border-b py-10" style={{ borderColor: "var(--brand-line-strong)" }}>
        <div className="label">{successCopy.eyebrow}</div>
        <div className="mt-3 font-serif-italic text-[28px] leading-tight text-ink">
          {successCopy.headline}
        </div>
        <p className="mt-4 text-[15px] text-ink/70 max-w-md">{successCopy.body}</p>
        <dl className="mt-6 border-t border-b py-3 space-y-2" style={{ borderColor: "var(--brand-line)" }}>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="label">Session</dt>
            <dd className="font-mono text-[12px] text-ink">{success.session_id}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="label">State</dt>
            <dd className="text-[13px] text-ink">{success.state}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="label">Vessel</dt>
            <dd className="font-mono text-[12px] text-ink">{success.vessel_id ?? "Pending match"}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <Link href={attachedPassportHref()} className="border-b border-ink/60 hover:border-ink">
            {attachedPassportLabel()}
          </Link>
          <button type="button" onClick={() => setStatus("idle")} className="label hover:text-ink transition-colors">
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <input type="hidden" name="offer" value={offer} />

      {hin && (
        <div
          className="border-t border-b py-3 -mb-1 flex items-baseline justify-between gap-3"
          style={{ borderColor: "var(--brand-line)" }}
        >
          <span className="label">HIN attached</span>
          <span className="font-mono text-[13px] text-ink">{hin}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <Field label="Name">
          <input required name="name" type="text" autoComplete="name" className="uinput" placeholder="Jane Mariner" />
        </Field>
        <Field label="Email">
          <input required name="email" type="email" autoComplete="email" className="uinput" placeholder="jane@example.com" />
        </Field>
      </div>

      <Field label="Role">
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
          {(["Broker", "Buyer", "Insurer", "Builder", "Other"] as Role[]).map((role, idx) => (
            <label key={role} className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={role}
                defaultChecked={idx === 0}
                className="peer sr-only"
              />
              <span className="h-4 w-4 inline-block rounded-full border border-ink/40 peer-checked:bg-ink peer-checked:border-ink transition-colors" />
              <span className="text-[14px] text-ink/85 peer-checked:text-ink">{role}</span>
            </label>
          ))}
        </div>
      </Field>

      <Field
        label={
          offer === "create"
            ? "Tell us about the vessel, optional"
            : "Message, optional"
        }
      >
        <textarea
          name="message"
          rows={3}
          className="uinput"
          placeholder={
            offer === "create"
              ? "Builder, make and model, year, where she lives. Helps us route this."
              : "Anything you want us to know."
          }
        />
      </Field>

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-[12px] text-muted max-w-xs">
          We will reply from a verified VesselIQ address.
        </p>
        <button type="submit" disabled={status === "submitting"} className="cta-primary">
          {status === "submitting" ? "Sending." : submitLabel}
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {status === "error" && (
        <div className="text-[13px] text-red-800 border-t border-red-300 pt-3">
          {errorMsg}
        </div>
      )}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
