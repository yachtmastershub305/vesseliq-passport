"use client";

import { useState } from "react";
import type { PassportSignature } from "@/lib/passport-types";

type VerifyResult =
  | { verified: true; algorithm: string; signing_key_id: string; verified_at: string }
  | { verified: false; reason?: string };

type VerifyPhase =
  | { status: "idle" }
  | { status: "verifying" }
  | { status: "done"; result: VerifyResult };

export function VerificationBlock({
  slug,
  signature,
}: {
  slug: string;
  signature: PassportSignature;
}) {
  const [phase, setPhase] = useState<VerifyPhase>({ status: "idle" });

  async function verify() {
    setPhase({ status: "verifying" });
    try {
      const res = await fetch(`/api/passport/${slug}/verify`, { cache: "no-store" });
      const body = await res.json();
      if (res.ok && body.verified === true) {
        setPhase({
          status: "done",
          result: {
            verified: true,
            algorithm: body.algorithm,
            signing_key_id: body.signing_key_id,
            verified_at: body.verified_at,
          },
        });
      } else {
        setPhase({
          status: "done",
          result: { verified: false, reason: body.status ?? body.error ?? "unknown" },
        });
      }
    } catch {
      setPhase({ status: "done", result: { verified: false, reason: "network_error" } });
    }
  }

  const truncMid = (s: string, head = 12, tail = 12) =>
    s.length > head + tail + 3 ? `${s.slice(0, head)}…${s.slice(-tail)}` : s;

  return (
    <div
      className="mt-5 w-full max-w-[280px] lg:text-right border-t pt-4"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="label">Cryptographic signature</div>

      <dl className="mt-3 space-y-1 text-[12px]">
        <Row k="Algorithm" v={signature.algorithm} mono />
        <Row
          k="Key"
          v={`${signature.signing_key_id.split("/").slice(-1)[0]} · v${signature.signing_key_version}`}
          mono
        />
        <Row k="Hash" v={`${truncMid(signature.canonical_hash_sha256)} · sha-256`} mono />
        <Row k="Signature" v={truncMid(signature.signature_b64, 10, 8)} mono />
      </dl>

      <div className="mt-4 no-print">
        {phase.status === "idle" && (
          <button type="button" onClick={verify} className="cta-secondary cta-verify">
            <ShieldGlyph />
            Verify authenticity
          </button>
        )}

        {phase.status === "verifying" && (
          <div
            className="border px-3 py-2 flex items-center gap-2 text-[13px] text-ink/80"
            style={{ borderColor: "var(--brand-line-strong)", backgroundColor: "var(--brand-paper-2)" }}
            aria-live="polite"
          >
            <SpinnerGlyph />
            Verifying signature with KMS public key.
          </div>
        )}

        {phase.status === "done" && phase.result.verified && (
          <div
            className="border px-3 py-3"
            style={{
              borderColor: "var(--brand-teal)",
              backgroundColor: "rgba(10, 138, 120, 0.06)",
            }}
            aria-live="polite"
          >
            <div className="flex items-baseline gap-2">
              <CheckGlyph />
              <span className="label-ink text-teal-deep">Verified</span>
            </div>
            <p className="mt-2 text-[11.5px] leading-[1.5] text-ink/80">
              Signed by VesselIQ, {phase.result.algorithm} via{" "}
              {phase.result.signing_key_id.split("/").slice(-1)[0]}. Payload is byte intact.
            </p>
            <button
              type="button"
              onClick={() => setPhase({ status: "idle" })}
              className="mt-3 label hover:text-ink transition-colors"
            >
              Run again
            </button>
          </div>
        )}

        {phase.status === "done" && !phase.result.verified && (
          <div
            className="border px-3 py-3"
            style={{
              borderColor: "rgba(180, 30, 30, 0.7)",
              backgroundColor: "rgba(180, 30, 30, 0.04)",
            }}
            aria-live="assertive"
          >
            <div className="flex items-baseline gap-2">
              <CrossGlyph />
              <span className="label-ink" style={{ color: "rgb(150, 25, 25)" }}>
                Verification failed
              </span>
            </div>
            <p className="mt-2 text-[11.5px] leading-[1.5] text-ink/80">
              The signature did not match the canonical payload. Reason,{" "}
              <span className="font-mono">{phase.result.reason ?? "unknown"}</span>.
            </p>
            <button
              type="button"
              onClick={() => setPhase({ status: "idle" })}
              className="mt-3 label hover:text-ink transition-colors"
            >
              Run again
            </button>
          </div>
        )}
      </div>

      {signature.public_key_url && (
        <p className="mt-3 text-[10.5px] text-muted leading-[1.5]">
          Public key,{" "}
          <a
            href={signature.public_key_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono border-b border-ink/30 hover:border-ink"
          >
            {signature.public_key_url.replace(/^https?:\/\//, "")}
          </a>
        </p>
      )}
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="label">{k}</dt>
      <dd className={`text-ink text-right ${mono ? "font-mono text-[11px]" : ""}`}>{v}</dd>
    </div>
  );
}

function ShieldGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M7 1.5l4.5 1.5v3.5c0 2.6-1.9 4.9-4.5 5.5-2.6-.6-4.5-2.9-4.5-5.5V3L7 1.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5 7.2l1.4 1.4 2.6-2.8"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="animate-spin">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
      <path d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="var(--brand-teal)" />
      <path
        d="M4.5 7.2l1.6 1.6 3.4-3.6"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="rgb(180, 30, 30)" />
      <path
        d="M4.6 4.6l4.8 4.8M9.4 4.6l-4.8 4.8"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
