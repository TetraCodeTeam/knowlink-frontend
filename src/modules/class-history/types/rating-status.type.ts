export const RATING_STATUS_VALUES = ["NOT_AVAILABLE", "PENDING", "SUBMITTED", "EXPIRED"] as const;

export type RatingStatus = (typeof RATING_STATUS_VALUES)[number];
