import { describe, expect, it } from "vitest";
import {
  buildNowOverlayEvent,
  getSlotDisplayStatus,
} from "@/modules/student/booking/utils/bookingSlotStatus";
import type { BookingSlotEvent } from "@/modules/student/booking/interfaces/bookingSlotEventType";

const at = (hours: number, minutes: number, seconds = 0) =>
  new Date(2026, 10, 14, hours, minutes, seconds).getTime();

function slot(overrides: Partial<BookingSlotEvent> = {}): BookingSlotEvent {
  return {
    id: "slot-1",
    start: new Date(2026, 10, 14, 10, 0).toISOString(),
    end: new Date(2026, 10, 14, 12, 0).toISOString(),
    status: "AVAILABLE",
    ...overrides,
  };
}

describe("getSlotDisplayStatus", () => {
  it("un bloque que termina más adelante conserva el estado del backend", () => {
    expect(getSlotDisplayStatus(slot({ status: "AVAILABLE" }), at(11, 0))).toBe("AVAILABLE");
    expect(getSlotDisplayStatus(slot({ status: "BLOCKED" }), at(11, 0))).toBe("BLOCKED");
    expect(getSlotDisplayStatus(slot({ status: "RESERVED" }), at(11, 0))).toBe("RESERVED");
  });

  it("pasa a «pasado» cuando la hora supera el fin del bloque, sin pedir nada al backend", () => {
    const block = slot();

    expect(getSlotDisplayStatus(block, at(11, 59))).toBe("AVAILABLE");
    expect(getSlotDisplayStatus(block, at(12, 1))).toBe("PAST");
  });

  it("justo a la hora de fin todavía no es pasado", () => {
    expect(getSlotDisplayStatus(slot(), at(12, 0))).toBe("AVAILABLE");
  });

  it("«pasado» gana sobre bloqueado y reservado", () => {
    expect(getSlotDisplayStatus(slot({ status: "BLOCKED" }), at(13, 0))).toBe("PAST");
    expect(getSlotDisplayStatus(slot({ status: "RESERVED" }), at(13, 0))).toBe("PAST");
  });
});

describe("buildNowOverlayEvent", () => {
  const thisWeek = { start: "2026-11-09", end: "2026-11-15" };

  it("sombrea desde la medianoche de hoy hasta la hora actual", () => {
    const overlay = buildNowOverlayEvent(at(11, 5), thisWeek);

    expect(overlay).toEqual({
      start: "2026-11-14T00:00:00",
      end: "2026-11-14T11:05:00",
      display: "background",
      classNames: ["fc-past-now"],
    });
  });

  it("se corre con la hora", () => {
    expect(buildNowOverlayEvent(at(11, 5), thisWeek)?.end).toBe("2026-11-14T11:05:00");
    expect(buildNowOverlayEvent(at(11, 6), thisWeek)?.end).toBe("2026-11-14T11:06:00");
    expect(buildNowOverlayEvent(at(14, 30, 15), thisWeek)?.end).toBe("2026-11-14T14:30:15");
  });

  it("no existe si la semana que se mira no incluye hoy", () => {
    expect(buildNowOverlayEvent(at(11, 5), { start: "2026-11-16", end: "2026-11-22" })).toBeNull();
    expect(buildNowOverlayEvent(at(11, 5), { start: "2026-11-02", end: "2026-11-08" })).toBeNull();
  });

  it("incluye hoy cuando es el primer o el último día de la semana visible", () => {
    expect(
      buildNowOverlayEvent(at(9, 0), { start: "2026-11-14", end: "2026-11-20" })
    ).not.toBeNull();
    expect(
      buildNowOverlayEvent(at(9, 0), { start: "2026-11-08", end: "2026-11-14" })
    ).not.toBeNull();
  });

  it("pasada la medianoche se mueve al día nuevo", () => {
    const overlay = buildNowOverlayEvent(new Date(2026, 10, 15, 0, 5).getTime(), thisWeek);

    expect(overlay?.start).toBe("2026-11-15T00:00:00");
    expect(overlay?.end).toBe("2026-11-15T00:05:00");
  });
});
