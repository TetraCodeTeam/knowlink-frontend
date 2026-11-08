export const RATING_GATE_QUERY_KEYS = {
  all: ["ratingGate"] as const,
  pending: ["ratingGate", "pending"] as const,
};

export const RATING_GATE_POLL_INTERVAL = 30_000;
export const RATING_REQUIRED_CODE = "RATING_REQUIRED";
export const RATING_GATE_Z_INDEX = 1550;
