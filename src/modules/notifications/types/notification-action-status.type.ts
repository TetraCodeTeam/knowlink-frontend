export const NOTIFICATION_ACTION_STATUS_VALUES = [
  "NONE",
  "PENDING",
  "COMPLETED",
  "EXPIRED",
] as const;

export type NotificationActionStatus = (typeof NOTIFICATION_ACTION_STATUS_VALUES)[number];
