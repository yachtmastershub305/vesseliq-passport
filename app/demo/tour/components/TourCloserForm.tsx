"use client";

import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function TourCloserForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      role: "Broker",
      offer: "create",
      hin: String(fd.get("hin") ?? "").trim().toUpperCase() || undefined,
      message: undefined,
    };
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus({
          kind: "error",
          message: body?.error ?? "Submission failed. Try again.",
        });
        return;
      }
      setStatus({ kind: "success" });
      form.reset();
    } catch {
      setStatus({ kind: "error", message: "Network error. Try again." });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        className="border-t border-b py-8"
        style={{ borderColor: "var(--brand-line-strong)" }}
      >
        <div className="label">Request received</div>
        <div className="mt-3 font-serif-italic text-[28px] leading-tight text-ink">
          Thank you. We will be in touch within one business day.
        </div>
        <p className="mt-3 text-[14px] text-ink/75 max-w-md">
          We will reply from a verified VesselIQ address with the scope and a
          quote for your hull.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="label">HIN of your listing</span>
        <input
          required
          name="hin"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Hull identification number, e.g. FCM5X021J526"
          className="uinput mt-2 font-mono text-[16px]"
        />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="label">Your name</span>
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
      </div>

      {status.kind === "error" && (
        <div className="text-[13px] text-red-800 border-t border-red-300 pt-2">
          {status.message}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-2 flex-wrap">
        <p className="text-[12px] text-muted max-w-[16rem]">
          We will reply from a verified VesselIQ address.
        </p>
        <button
          type="submit"
          disabled={status.kind === "submitting"}
          className="cta-primary cta-primary-lg"
        >
          {status.kind === "submitting"
            ? "Sending."
            : "Have your Passport created"}
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
