"use server";

import { redirect } from "next/navigation";
import { findVesselByHin, normalizeHin } from "@/lib/hin-registry";

export async function lookupHinAction(formData: FormData) {
  const raw = String(formData.get("hin") ?? "").trim();
  if (!raw) {
    redirect("/");
  }

  const result = await findVesselByHin(raw);

  if (result.status === "found") {
    redirect(`/passport/${result.slug}?view=preview&from=lookup`);
  }

  redirect(`/claim?hin=${encodeURIComponent(normalizeHin(raw))}`);
}
