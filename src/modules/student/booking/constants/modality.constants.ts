export const BOOKING_MODALITY_OPTIONS = ["VIRTUAL", "IN_PERSON"] as const;

export type Modality = (typeof BOOKING_MODALITY_OPTIONS)[number];

export const BOOKING_MODALITY_LABEL: Record<Modality, string> = {
  VIRTUAL: "Virtual",
  IN_PERSON: "Presencial",
};