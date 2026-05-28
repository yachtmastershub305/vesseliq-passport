export type ViewState = "preview" | "full" | "transfer";

export const VIEW_STATES: ViewState[] = ["preview", "full", "transfer"];

export function parseViewState(raw: string | string[] | undefined): ViewState {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "full") return "full";
  if (v === "transfer") return "transfer";
  return "preview";
}

export const VIEW_LABELS: Record<ViewState, string> = {
  preview: "Preview",
  full: "Certified",
  transfer: "Transfer pending",
};

export const VIEW_DEMO_DESCRIPTIONS: Record<ViewState, string> = {
  preview: "What a prospective buyer sees before paying.",
  full: "What the owner sees, or a buyer sees after unlocking.",
  transfer: "Shown while ownership is moving to a new holder.",
};
