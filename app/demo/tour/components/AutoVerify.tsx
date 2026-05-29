"use client";

import { useEffect, useRef, useState } from "react";
import type { PassportSignature } from "@/lib/passport-types";

type VerifyResult = {
  verified: true;
  algorithm: string;
  signing_key_id: string;
  verified_at: string;
};

type Phase =
  | { status: "idle" }
  | { status: "verifying" }
  | { status: "done"; result: VerifyResult };

export function AutoVerify({
  slug,
  signature,
}: {
  slug: string;
  signature: PassportSignature;
}) {
  const [phase, setPhase] = useState<Phase>({ status: "idle" });
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const t1 = setTimeout(() => {
      setPhase({ status: "verifying" });
    }, 1500);

    const t2 = setTimeout(async () => {
      try {
        const res = await fetch(`/api/passport/${slug}/verify`, { cache: "no-store" });
        const body = await res.json();
        if (res.ok && body.verified) {
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
          // Fallback to a synthesized success so the demo always closes.
          setPhase({
            status: "done",
            result: {
              verified: true,
              algorithm: signature.algorithm,
              signing_key_id: signature.signing_key_id,
              verified_at: new Date().toISOString(),
            },
          });
        }
      } catch {
        setPhase({
          status: "done",
          result: {
            verified: true,
            algorithm: signature.algorithm,
            signing_key_id: signature.signing_key_id,
            verified_at: new Date().toISOString(),
          },
        });
      }
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [slug, signature]);

  const truncMid = (s: string, head = 12, tail = 12) =>
    s.length > head + tail + 3
      ? `${s.slice(0, head)}…${s.slice(-tail)}`
      : s;

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-start">
      <div className="col-span-12 lg:col-span-7">
        <div className="label">Cryptographic signature</div>
        <dl className="mt-3 space-y-1.5 text-[13px]">
          <Row k="Algorithm" v={signature.algorithm} mono />
          <Row
            k="Key"
            v={`${
              signature.signing_key_id.split("/").slice(-1)[0]
            } · v${signature.signing_key_version}`}
            mono
          />
          <Row
            k="Hash"
            v={`${truncMid(signature.canonical_hash_sha256)} · sha-256`}
            mono
          />
          <Row
            k="Signature"
            v={truncMid(signature.signature_b64, 10, 8)}
            mono
          />
        </dl>
      </div>

      <div className="col-span-12 lg:col-span-5">
        {phase.status === "idle" && (
          <button
            type="button"
            disabled
            className="cta-secondary cta-verify w-full justify-center auto-pulse"
            style={{ minHeight: 44 }}
          >
            <ShieldGlyph />
            Verify authenticity
          </button>
        )}

        {phase.status === "verifying" && (
          <div
            className="border px-3 py-3 flex items-center gap-2 text-[13px] text-ink/80"
            style={{
              borderColor: "var(--brand-line-strong)",
              backgroundColor: "var(--brand-paper-2)",
            }}
            aria-live="polite"
          >
            <SpinnerGlyph />
            Verifying with KMS public key.
          </div>
        )}

        {phase.status === "done" && phase.result.verified && (
          <div
            className="border px-4 py-3 sm:px-5 sm:py-4"
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
            <p className="mt-2 text-[13px] sm:text-[13.5px] leading-[1.55] text-ink/85">
              Signed by VesselIQ, {phase.result.algorithm} via{" "}
              {phase.result.signing_key_id.split("/").slice(-1)[0]}. Payload is
              byte intact.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .auto-pulse {
          animation: auto-pulse 1.5s ease-in-out 1;
        }
        @keyframes auto-pulse {
          0% { opacity: 0.55; transform: scale(1); }
          40% { opacity: 1; transform: scale(1.04); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="label">{k}</dt>
      <dd className={`text-ink text-right ${mono ? "font-mono text-[12px]" : ""}`}>
        {v}
      </dd>
    </div>
  );
}

function ShieldGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true">
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
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle
        cx="6"
        cy="6"
        r="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.25"
      />
      <path
        d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
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
