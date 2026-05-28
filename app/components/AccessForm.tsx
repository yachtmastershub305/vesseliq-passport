"use client";

import { useState } from "react";

type Role = "Broker" | "Buyer" | "Insurer" | "Builder" | "Other";

export function AccessForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      role: String(fd.get("role") ?? "Other") as Role,
      message: String(fd.get("message") ?? "").trim(),
    };

    setStatus("submitting");
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.error ?? "Submission failed. Try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-paper border hairline p-8">
        <div className="font-mono text-[11px] tracking-wider uppercase text-teal">
          Request received
        </div>
        <h3 className="mt-3 text-xl tracking-tight">
          Thank you. We will be in touch within one business day.
        </h3>
        <p className="mt-3 text-muted text-[15px] leading-relaxed">
          In the meantime, you can{" "}
          <a href="/passport/meridian" className="underline decoration-teal underline-offset-4">
            view a live Passport
          </a>{" "}
          to see what a verified vessel record looks like.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl bg-paper border hairline p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <Field label="Name">
        <input
          required
          name="name"
          type="text"
          autoComplete="name"
          className="input"
          placeholder="Jane Mariner"
        />
      </Field>
      <Field label="Email">
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          className="input"
          placeholder="jane@example.com"
        />
      </Field>
      <Field label="Role" full>
        <div className="flex flex-wrap gap-2">
          {(["Broker", "Buyer", "Insurer", "Builder", "Other"] as Role[]).map((role, idx) => (
            <label key={role} className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={role}
                defaultChecked={idx === 0}
                className="peer sr-only"
              />
              <span className="px-3 h-8 inline-flex items-center rounded-full border hairline text-[13px] text-ink/80 peer-checked:bg-ink peer-checked:text-canvas peer-checked:border-ink transition-colors">
                {role}
              </span>
            </label>
          ))}
        </div>
      </Field>
      <Field label="Message, optional" full>
        <textarea
          name="message"
          rows={3}
          className="input resize-none"
          placeholder="A line on your use case helps us route the conversation."
        />
      </Field>
      <div className="sm:col-span-2 flex items-center justify-between gap-4 mt-2">
        <p className="text-[12px] text-muted">
          We will reply from a verified VesselIQ address.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center h-10 px-5 rounded-full bg-ink text-canvas text-[14px] hover:bg-teal-deep transition-colors disabled:opacity-60"
        >
          {status === "submitting" ? "Sending." : "Request access"}
        </button>
      </div>
      {status === "error" && (
        <div className="sm:col-span-2 text-[13px] text-red-700 bg-red-50 rounded-md px-3 py-2 border border-red-200">
          {errorMsg}
        </div>
      )}
      <style>{`
        .input {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          background: var(--brand-canvas);
          border: 1px solid var(--brand-line);
          font-size: 14px;
          color: var(--brand-ink);
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .input::placeholder { color: rgba(12,17,23,0.4); }
        .input:focus {
          border-color: var(--brand-teal);
          background: var(--brand-paper);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="font-mono text-[10.5px] tracking-wider uppercase text-muted">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
