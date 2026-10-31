export const NOTIFICATION_READ_FILTER_VALUES = ["ALL", "UNREAD", "READ"] as const;

export type NotificationReadFilter = (typeof NOTIFICATION_READ_FILTER_VALUES)[number];
