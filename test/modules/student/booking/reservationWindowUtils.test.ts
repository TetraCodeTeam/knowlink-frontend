import { describe, expect, it } from "vitest";

import {
  getReservationWindows,
  hasValidReservationDuration,
} from "@/modules/student/booking/utils/reservationWindowUtils";
import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";

function window(startHour: number, startMinute: number, endHour: number, endMinute: number) {
  const start = new Date(2026, 10, 2, startHour, startMinute, 0, 0);
  const end = new Date(2026, 10, 2, endHour, endMinute, 0, 0);

  return { start, end } satisfies ReservationWindow;
}

describe("getReservationWindows", () => {
  it("genera franjas de 1 hora cada 30 minutos dentro del bloque", () => {
    const blockStart = new Date(2026, 10, 2, 15, 0, 0, 0);
    const blockEnd = new Date(2026, 10, 2, 17, 0, 0, 0);

    const windows = getReservationWindows(blockStart, blockEnd);

    expect(windows).toHaveLength(3);
    expect(windows[0].start.getHours()).toBe(15);
    expect(windows[0].end.getHours()).toBe(16);
    expect(windows[1].start.getMinutes()).toBe(30);
    expect(windows[2].start.getHours()).toBe(16);
  });
});

describe("hasValidReservationDuration", () => {
  it("acepta reservas de 1, 2 y 3 horas completas", () => {
    expect(hasValidReservationDuration(window(9, 0, 10, 0))).toBe(true);
    expect(hasValidReservationDuration(window(9, 0, 11, 0))).toBe(true);
    expect(hasValidReservationDuration(window(9, 30, 11, 30))).toBe(true);
    expect(hasValidReservationDuration(window(9, 0, 12, 0))).toBe(true);
  });

  it("rechaza duraciones con fracción de hora", () => {
    expect(hasValidReservationDuration(window(9, 0, 9, 30))).toBe(false);
    expect(hasValidReservationDuration(window(9, 0, 10, 30))).toBe(false);
    expect(hasValidReservationDuration(window(9, 30, 11, 0))).toBe(false);
  });

  it("rechaza reservas de más de 3 horas", () => {
    expect(hasValidReservationDuration(window(9, 0, 13, 0))).toBe(false);
    expect(hasValidReservationDuration(window(9, 0, 12, 30))).toBe(false);
  });

  it("rechaza una selección sin duración", () => {
    expect(hasValidReservationDuration(window(9, 0, 9, 0))).toBe(false);
  });
});
