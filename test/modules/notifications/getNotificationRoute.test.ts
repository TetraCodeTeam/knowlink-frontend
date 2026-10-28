import { describe, expect, it } from "vitest";
import {
  getNotificationAction,
  getNotificationRoute,
} from "@/modules/notifications/constants/notification-type-config";
import { NOTIFICATION_TYPE_VALUES } from "@/modules/notifications/types/notification-type.type";

describe("getNotificationRoute", () => {
  it("devuelve la ruta configurada para cada tipo y rol", () => {
    expect(getNotificationRoute("BOOKING_CONFIRMED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("BOOKING_CONFIRMED", "TUTOR")).toBe("/tutor/classes");
    expect(getNotificationRoute("BOOKING_CANCELLED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("BOOKING_CANCELLED", "TUTOR")).toBe("/tutor/classes");
    expect(getNotificationRoute("SESSION_CONFIRMATION_REMINDER", "STUDENT")).toBe(
      "/student/classes"
    );
    expect(getNotificationRoute("SESSION_CONFIRMATION_REMINDER", "TUTOR")).toBe("/tutor/classes");
    expect(getNotificationRoute("SESSION_CONFIRMED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("SESSION_CONFIRMED", "TUTOR")).toBe("/tutor/classes");
    expect(getNotificationRoute("SESSION_NOT_CONFIRMED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("SESSION_NOT_CONFIRMED", "TUTOR")).toBe("/tutor/classes");
    expect(getNotificationRoute("SESSION_COMPLETED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("SESSION_COMPLETED", "TUTOR")).toBe("/tutor/classes");
    expect(getNotificationRoute("FUNDS_TRANSFERRED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("FUNDS_TRANSFERRED", "TUTOR")).toBe("/tutor/classes");
    expect(getNotificationRoute("FUNDS_SUSPENDED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("FUNDS_SUSPENDED", "TUTOR")).toBe("/tutor/requests");
    expect(getNotificationRoute("FUNDS_RELEASED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("FUNDS_RELEASED", "TUTOR")).toBe("/tutor/requests");
    expect(getNotificationRoute("SUBJECT_VALIDATION_UPDATED", "STUDENT")).toBeNull();
    expect(getNotificationRoute("SUBJECT_VALIDATION_UPDATED", "TUTOR")).toBe("/tutor/profile");
    expect(getNotificationRoute("MATERIAL_REPORT_PROCESSED", "STUDENT")).toBe(
      "/student/complaints"
    );
    expect(getNotificationRoute("MATERIAL_REPORT_PROCESSED", "TUTOR")).toBe("/tutor/content");
    expect(getNotificationRoute("RATING_ENABLED", "STUDENT")).toBe("/student/classes");
    expect(getNotificationRoute("RATING_ENABLED", "TUTOR")).toBe("/tutor/classes");
    expect(getNotificationRoute("ADMIN_VALIDATION_REQUEST_PENDING", "STUDENT")).toBeNull();
    expect(getNotificationRoute("ADMIN_VALIDATION_REQUEST_PENDING", "TUTOR")).toBeNull();
    expect(getNotificationRoute("ADMIN_MATERIAL_REPORT_RECEIVED", "STUDENT")).toBeNull();
    expect(getNotificationRoute("ADMIN_MATERIAL_REPORT_RECEIVED", "TUTOR")).toBeNull();
  });

  it("resuelve las rutas de los tipos de soporte", () => {
    for (const type of [
      "SESSION_CLAIM_UPDATE",
      "SESSION_CLAIM_COMMENT",
      "MATERIAL_REPORT_UPDATE",
    ] as const) {
      expect(getNotificationRoute(type, "STUDENT")).toBe("/student/complaints");
      expect(getNotificationRoute(type, "TUTOR")).toBe("/tutor/requests");
    }
  });

  it("devuelve null para ADMIN en todos los tipos", () => {
    for (const type of NOTIFICATION_TYPE_VALUES) {
      expect(getNotificationRoute(type, "ADMIN")).toBeNull();
    }
  });

  it("devuelve null y no rompe para un tipo desconocido", () => {
    expect(getNotificationRoute("SOME_NEW_TYPE", "STUDENT")).toBeNull();
    expect(getNotificationRoute("SOME_NEW_TYPE", "TUTOR")).toBeNull();
  });
});

describe("getNotificationAction", () => {
  it("resuelve navigate con ruta y etiqueta Ver", () => {
    expect(getNotificationAction("BOOKING_CONFIRMED", "STUDENT")).toEqual({
      kind: "navigate",
      label: "Ver",
      route: "/student/classes",
    });
  });

  it("resuelve rating para RATING_ENABLED sin navegar", () => {
    expect(getNotificationAction("RATING_ENABLED", "STUDENT", "PENDING")).toEqual({
      kind: "rating",
      label: "Calificar",
    });
  });

  it("resuelve rating-done cuando el usuario ya califico", () => {
    expect(getNotificationAction("RATING_ENABLED", "TUTOR", "COMPLETED")).toEqual({
      kind: "rating-done",
      label: "Ya calificaste",
    });
  });

  it("resuelve rating-expired cuando vencio el plazo", () => {
    expect(getNotificationAction("RATING_ENABLED", "STUDENT", "EXPIRED")).toEqual({
      kind: "rating-expired",
      label: "Venció el plazo",
    });
  });

  it("trata NONE como pendiente para notificaciones viejas", () => {
    expect(getNotificationAction("RATING_ENABLED", "STUDENT", "NONE")).toEqual({
      kind: "rating",
      label: "Calificar",
    });
  });

  it("resuelve claim para SESSION_COMPLETED", () => {
    expect(getNotificationAction("SESSION_COMPLETED", "TUTOR")).toEqual({
      kind: "claim",
      label: "Reclamar",
    });
  });

  it("resuelve navigate con Ver para los tipos de soporte", () => {
    expect(getNotificationAction("SESSION_CLAIM_COMMENT", "TUTOR")).toEqual({
      kind: "navigate",
      label: "Ver",
      route: "/tutor/requests",
    });
  });

  it("resuelve none cuando el rol no tiene ruta", () => {
    expect(getNotificationAction("SUBJECT_VALIDATION_UPDATED", "STUDENT")).toEqual({
      kind: "none",
    });
  });

  it("resuelve none para ADMIN y tipos desconocidos", () => {
    expect(getNotificationAction("BOOKING_CONFIRMED", "ADMIN")).toEqual({ kind: "none" });
    expect(getNotificationAction("SOME_NEW_TYPE", "STUDENT")).toEqual({ kind: "none" });
  });
});
