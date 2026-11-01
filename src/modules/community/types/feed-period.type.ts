export const FEED_PERIOD_VALUES = ["TODAY", "WEEK", "MONTH", "ALL"] as const;

export type FeedPeriod = (typeof FEED_PERIOD_VALUES)[number];
