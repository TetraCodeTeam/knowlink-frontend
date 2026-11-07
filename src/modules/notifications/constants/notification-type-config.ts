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
  KeyRound,
  MessageSquare,
  MessagesSquare,
  Star,
  Timer,
  TimerOff,
  Wallet,
} from "lucide-react";
import type { NotificationActionStatus } from "@/modules/notifications/types/notification-action-status.type";
import type { NotificationType } from "@/modules/notifications/types/notification-type.type";
import type { Role } from "@/shared/types/role.type";

type NotificationActionKind = "navigate" | "rating" | "claim" | "none";

export interface NotificationTarget {
  path: string;
  search?: Record<string, string>;
}

interface NotificationTypeConfig {
  icon: LucideIcon;
  tileColor: string;
  iconColor: string;
  action: { kind: NotificationActionKind; label: string };
  routes: Record<Role, NotificationTarget | null>;
  /** Si es true, la navegación agrega `/<referenceId>` a la ruta (ej. el hilo de la comunidad). */
  appendReference?: boolean;
  /** Parámetro de búsqueda que recibe `referenceId` al navegar (ej. el detalle del reclamo). */
  referenceSearchParam?: string;
}

const GREEN_TILE = "#DDF5E6";
const GREEN_ICON = "#2F9E5F";
const RED_TILE = "#FBDEDE";
const RED_ICON = "#D64545";
const YELLOW_TILE = "#FCEFCA";
const YELLOW_ICON = "#D9A13B";
const LAVENDER_TILE = "#EDEBFA";
const LAVENDER_ICON = "#5865C8";

const STUDENT_CLASSES = {
  path: "/student/classes",
  search: { category: "RESERVED" },
};
const TUTOR_CLASSES = {
  path: "/tutor/classes",
  search: { category: "RESERVED" },
};

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  BOOKING_CONFIRMED: {
    icon: CalendarCheck,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/classes", search: { category: "RESERVED" } },
      TUTOR: { path: "/tutor/classes", search: { category: "RESERVED" } },
    },
  },
  BOOKING_CANCELLED: {
    icon: CalendarX,
    tileColor: RED_TILE,
    iconColor: RED_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/classes", search: { category: "CANCELLED" } },
      TUTOR: { path: "/tutor/classes", search: { category: "CANCELLED" } },
    },
  },
  SESSION_CONFIRMATION_REMINDER: {
    icon: Timer,
    tileColor: YELLOW_TILE,
    iconColor: YELLOW_ICON,
    action: { kind: "none", label: "" },
    routes: { STUDENT: null, TUTOR: null },
  },
  SESSION_CONFIRMATION_TOKEN_AVAILABLE: {
    icon: KeyRound,
    tileColor: YELLOW_TILE,
    iconColor: YELLOW_ICON,
    action: { kind: "navigate", label: "Ver código" },
    routes: {
      STUDENT: { path: "/student/classes", search: { category: "RESERVED" } },
      TUTOR: null,
    },
  },
  SESSION_CONFIRMED: {
    icon: BellRing,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/classes", search: { category: "COMPLETED" } },
      TUTOR: { path: "/tutor/classes", search: { category: "COMPLETED" } },
    },
  },
  SESSION_NOT_CONFIRMED: {
    icon: TimerOff,
    tileColor: RED_TILE,
    iconColor: RED_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/classes", search: { category: "NOT_CONFIRMED" } },
      TUTOR: { path: "/tutor/classes", search: { category: "NOT_CONFIRMED" } },
    },
  },
  SESSION_COMPLETED: {
    icon: CircleCheck,
    tileColor: YELLOW_TILE,
    iconColor: YELLOW_ICON,
    action: { kind: "claim", label: "Reclamar" },
    routes: { STUDENT: STUDENT_CLASSES, TUTOR: TUTOR_CLASSES },
  },
  FUNDS_TRANSFERRED: {
    icon: Wallet,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/classes", search: { category: "COMPLETED" } },
      TUTOR: { path: "/tutor/classes", search: { category: "COMPLETED" } },
    },
  },
  FUNDS_SUSPENDED: {
    icon: Wallet,
    tileColor: YELLOW_TILE,
    iconColor: YELLOW_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/complaints", search: { tab: "claims" } },
      TUTOR: { path: "/tutor/requests", search: { tab: "claims" } },
    },
  },
  FUNDS_RELEASED: {
    icon: Wallet,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: { path: "/student/classes" }, TUTOR: { path: "/tutor/requests" } },
  },
  SUBJECT_VALIDATION_UPDATED: {
    icon: BadgeCheck,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: { STUDENT: null, TUTOR: { path: "/tutor/profile" } },
  },
  MATERIAL_REPORT_PROCESSED: {
    icon: FileExclamationPoint,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/complaints", search: { tab: "materials" } },
      TUTOR: { path: "/tutor/content" },
    },
  },
  RATING_ENABLED: {
    icon: Star,
    tileColor: GREEN_TILE,
    iconColor: GREEN_ICON,
    action: { kind: "rating", label: "Calificar" },
    routes: { STUDENT: STUDENT_CLASSES, TUTOR: TUTOR_CLASSES },
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
    routes: {
      STUDENT: { path: "/student/complaints", search: { tab: "claims" } },
      TUTOR: { path: "/tutor/requests", search: { tab: "claims" } },
    },
    referenceSearchParam: "claim",
  },
  SESSION_CLAIM_COMMENT: {
    icon: MessageSquare,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/complaints", search: { tab: "claims" } },
      TUTOR: { path: "/tutor/requests", search: { tab: "claims" } },
    },
    referenceSearchParam: "claim",
  },
  COMMUNITY_REPLY: {
    icon: MessagesSquare,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver respuesta" },
    routes: {
      STUDENT: { path: "/student/community/posts" },
      TUTOR: { path: "/tutor/community/posts" },
    },
    appendReference: true,
  },
  MATERIAL_REPORT_UPDATE: {
    icon: FileExclamationPoint,
    tileColor: LAVENDER_TILE,
    iconColor: LAVENDER_ICON,
    action: { kind: "navigate", label: "Ver" },
    routes: {
      STUDENT: { path: "/student/complaints", search: { tab: "materials" } },
      TUTOR: { path: "/tutor/requests", search: { tab: "materials" } },
    },
  },
};

const UNKNOWN_TYPE_CONFIG: NotificationTypeConfig = {
  icon: Bell,
  tileColor: LAVENDER_TILE,
  iconColor: LAVENDER_ICON,
  action: { kind: "navigate", label: "Ver" },
  routes: { STUDENT: null, TUTOR: null },
};

function buildRoute(target: NotificationTarget): string {
  if (!target.search) return target.path;
  return `${target.path}?${new URLSearchParams(target.search).toString()}`;
}

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
  if (config.action.kind === "none") {
    return { kind: "none" };
  }
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
  const target = config.routes[role];
  if (!target) {
    return { kind: "none" };
  }
  return { kind: "navigate", label: config.action.label, route: buildRoute(target) };
}

export function getNotificationRoute(type: string, role: string): string | null {
  if (role !== "STUDENT" && role !== "TUTOR") {
    return null;
  }
  const target = getNotificationConfig(type).routes[role];
  return target ? buildRoute(target) : null;
}
