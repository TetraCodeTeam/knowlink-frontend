export const MODALITY_OPTIONS = ["VIRTUAL", "IN_PERSON"] as const;

export type SharedModality = (typeof MODALITY_OPTIONS)[number];

export const MODALITY_LABEL: Record<SharedModality, string> = {
  VIRTUAL: "Virtual",
  IN_PERSON: "Presencial",
};
