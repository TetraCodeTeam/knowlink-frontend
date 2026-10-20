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
  Star,
  TimerOff,
  Wallet,
} from "lucide-react";
import type { NotificationType } from "@/modules/notifications/types/notification-type.type";
import type { Role } from "@/shared/types/role.type";

interface NotificationTypeConfig {
  icon: LucideIcon;
  routes: Record<Role, string | null>;
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  BOOKING_CONFIRMED: {
    icon: CalendarCheck,
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  BOOKING_CANCELLED: {
    icon: CalendarX,
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  SESSION_CONFIRMATION_REMINDER: {
    icon: BellRing,
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  SESSION_NOT_CONFIRMED: {
    icon: TimerOff,
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  SESSION_COMPLETED: {
    icon: CircleCheck,
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  FUNDS_TRANSFERRED: {
    icon: Wallet,
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  SUBJECT_VALIDATION_UPDATED: {
    icon: BadgeCheck,
    routes: { STUDENT: null, TUTOR: "/tutor/profile" },
  },
  MATERIAL_REPORT_PROCESSED: {
    icon: FileExclamationPoint,
    routes: { STUDENT: "/student/complaints", TUTOR: "/tutor/content" },
  },
  RATING_ENABLED: {
    icon: Star,
    routes: { STUDENT: "/student/classes", TUTOR: "/tutor/classes" },
  },
  ADMIN_VALIDATION_REQUEST_PENDING: {
    icon: ClipboardList,
    routes: { STUDENT: null, TUTOR: null },
  },
  ADMIN_MATERIAL_REPORT_RECEIVED: {
    icon: FileExclamationPoint,
    routes: { STUDENT: null, TUTOR: null },
  },
};

const UNKNOWN_TYPE_CONFIG: NotificationTypeConfig = {
  icon: Bell,
  routes: { STUDENT: null, TUTOR: null },
};

export function getNotificationConfig(type: string): NotificationTypeConfig {
  return NOTIFICATION_TYPE_CONFIG[type as NotificationType] ?? UNKNOWN_TYPE_CONFIG;
}

export function getNotificationRoute(type: string, role: string): string | null {
  if (role !== "STUDENT" && role !== "TUTOR") {
    return null;
  }
  return getNotificationConfig(type).routes[role];
}
