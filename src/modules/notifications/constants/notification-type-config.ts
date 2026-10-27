import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  BellRing,
  CalendarCheck,
  CalendarX,
  CircleCheck,
  ClipboardList,
  FileExclamationPoint,
  MessageSquare,
  Star,
  Timer,
  TimerOff,
  Wallet,
} from "lucide-react";
import type { NotificationActionStatus } from "@/modules/notifications/types/notification-action-status.type";
import type { NotificationType } from "@/modules/notifications/types/notification-type.type";
import type { Role } from "@/shared/types/role.type";

type NotificationActionKind = "navigate" | "rating" | "claim";

interface NotificationTypeConfig {
  icon: LucideIcon;
  tileColor: string;
  iconColor: string;
  action: { kind: NotificationActionKind; label: string };
  routes: Record<Role, string | null>;
}

const GREEN_TILE = "#DDF5E6";
const GREEN_ICON = "#2F9E5F";
const RED_TILE = "#FBDEDE";
const RED_ICON = "#D64545";
const YELLOW_TILE = "#FCEFCA";
const YELLOW_ICON = "#D9A13B";
const LAVENDER_TILE = "#EDEBFA";
const LAVENDER_ICON = "#5865C8";

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  BOOKING_CONFIRMED: {
    icon: CalendarCheck,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  BOOKING_CANCELLED: {
    icon: CalendarX,
    tileColor: RED_TILE,
    iconColor: RED_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  SESSION_CONFIRMATION_REMINDER: {
    icon: Timer,
    tileColor: YELLOW_TILE,
    iconColor: YELLOW_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  SESSION_CONFIRMED: {
    icon: BellRing,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  SESSION_NOT_CONFIRMED: {
    icon: TimerOff,
    tileColor: RED_TILE,
    iconColor: RED_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  SESSION_COMPLETED: {
    icon: CircleCheck,
    tileColor: YELLOW_TILE,
    iconColor: YELLOW_ICON,
    action: { kind: "claim", label: "Reclamar" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  FUNDS_TRANSFERRED: {
    icon: Wallet,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  FUNDS_SUSPENDED: {
    icon: Wallet,
    tileColor: YELLOW_TILE,
    iconColor: YELLOW_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/requests" },
  },
  FUNDS_RELEASED: {
    icon: Wallet,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/requests" },
  },
  SUBJECT_VALIDATION_UPDATED: {
    icon: BadgeCheck,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: null, TUTOR: "/tutor/profile" },
  },
  MATERIAL_REPORT_PROCESSED: {
    icon: FileExclamationPoint,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/complaints", TUTOR: "/tutor/content" },
  },
  RATING_ENABLED: {
    icon: Star,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "rating", label: "Calificar" },
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  ADMIN_VALIDATION_REQUEST_PENDING: {
    icon: ClipboardList,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: null, TUTOR: null },
  },
  ADMIN_MATERIAL_REPORT_RECEIVED: {
    icon: FileExclamationPoint,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: null, TUTOR: null },
  },
  SESSION_CLAIM_UPDATE: {
    icon: ClipboardList,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/complaints", TUTOR: "/tutor/requests" },
  },
  SESSION_CLAIM_COMMENT: {
    icon: MessageSquare,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/complaints", TUTOR: "/tutor/requests" },
  },
  MATERIAL_REPORT_UPDATE: {
    icon: FileExclamationPoint,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: "/student/complaints", TUTOR: "/tutor/requests" },
  },
};

const UNKNOWN_TYPE_CONFIG: NotificationTypeConfig = {
  icon: Bell,
  tileColor: LAVENDER_TILE,
  iconColor: LAVENDER_ICON,
  action: { kind: "navigate", label: "Ver" },
  routes: { STUDENT: null, TUTOR: null },
};

export function getNotificationConfig(type: string): NotificationTypeConfig {
  return NOTIFICATION_TYPE_CONFIG[type as NotificationType] ?? UNKNOWN_TYPE_CONFIG;
}

export type NotificationAction =
  | { kind: "none" }
  | { kind: "rating"; label: string }
  | { kind: "rating-done"; label: string }
  | { kind: "rating-expired"; label: string }
  | { kind: "claim"; label: string }
  | { kind: "navigate"; label: string; route: string };

export function getNotificationAction(
  type: string,
  role: string,
  actionStatus: NotificationActionStatus = "NONE"
): NotificationAction {
  if (role !== "STUDENT" && role !== "TUTOR") {
    return { kind: "none" };
  }
  const config = getNotificationConfig(type);
  if (config.action.kind === "rating") {
    if (actionStatus === "COMPLETED") {
      return { kind: "rating-done", label: "Ya calificaste" };
    }
    if (actionStatus === "EXPIRED") {
      return { kind: "rating-expired", label: "Venció el plazo" };
    }
    return { kind: "rating", label: config.action.label };
  }
  if (config.action.kind === "claim") {
    return { kind: "claim", label: config.action.label };
  }
  const route = config.routes[role];
  if (!route) {
    return { kind: "none" };
  }
  return { kind: "navigate", label: config.action.label, route };
}

export function getNotificationRoute(type: string, role: string): string | null {
  if (role !== "STUDENT" && role !== "TUTOR") {
    return null;
  }
  return getNotificationConfig(type).routes[role];
}
