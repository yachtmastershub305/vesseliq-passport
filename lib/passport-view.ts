export type ViewState =
  | "preview"
  | "full"
  | "transfer"
  | "archived"
  | "revoked";

export const VIEW_STATES: ViewState[] = [
  "preview",
  "full",
  "transfer",
  "archived",
  "revoked",
];

export function parseViewState(
  raw: string | string[] | undefined,
  fallback: ViewState = "preview"
): ViewState {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "preview") return "preview";
  if (v === "full") return "full";
  if (v === "transfer") return "transfer";
  if (v === "archived") return "archived";
  if (v === "revoked") return "revoked";
  return fallback;
}

export const VIEW_LABELS: Record<ViewState, string> = {
  preview: "Preview",
  full: "Certified",
  transfer: "Transfer pending",
  archived: "Archived",
  revoked: "Revoked",
};

export const VIEW_DEMO_DESCRIPTIONS: Record<ViewState, string> = {
  preview: "What a prospective buyer sees before paying.",
  full: "What the owner sees, or a buyer sees after unlocking.",
  transfer: "Shown while ownership is moving to a new holder.",
  archived: "Closed record from a prior owner, read only.",
  revoked: "This Passport was invalidated and withdrawn.",
};
