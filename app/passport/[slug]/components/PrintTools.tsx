"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { buildPrintPassportPayload, printPassportDocument, type PrintPassportPayload } from "@/lib/backend";

export function PrintTools({ passportId }: { passportId: string }) {
  const [payload, setPayload] = useState<PrintPassportPayload | null>(null);

  useEffect(() => {
    buildPrintPassportPayload(passportId).then(setPayload).catch(() => undefined);
  }, [passportId]);

  if (!payload) return null;

  return (
    <div
      className="mt-5 w-full max-w-[280px] lg:text-right border-t pt-4"
      style={{ borderColor: "var(--brand-line-strong)" }}
    >
      <div className="label">Print / verify</div>
      <div className="mt-3 flex flex-col items-start gap-3 lg:items-end">
        <Image src={payload.qr_data_uri} alt="Verification QR" width={112} height={112} unoptimized />
        <p className="text-[10.5px] text-muted leading-[1.5] break-all lg:text-right">
          QR points to live verify URL.
          <br />
          <span className="font-mono text-ink/80">{payload.verify_url}</span>
        </p>
        <a href={payload.public_key_url} target="_blank" rel="noopener noreferrer" className="label border-b border-ink/30 hover:border-ink">
          Open public key
        </a>
        <button type="button" onClick={() => printPassportDocument()} className="cta-secondary no-print">
          Print PDF
        </button>
      </div>
    </div>
  );
}
