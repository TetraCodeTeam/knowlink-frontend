import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import BookingCalendar from "@/modules/student/booking/components/BookingCalendar";
import type { BookingSlotEvent } from "@/modules/student/booking/interfaces/bookingSlotEventType";

// FullCalendar necesita layout real para dibujar (jsdom no lo tiene). Acá interesa qué eventos le
// pasa BookingCalendar y cómo cambian con el reloj, así que se reemplaza por un doble que los guarda.
const calendar = vi.hoisted(() => ({
  props: null as Record<string, unknown> | null,
  visibleWeek: { start: new Date(2026, 10, 9), end: new Date(2026, 10, 16) },
}));

vi.mock("@fullcalendar/react", () => ({
  default: function FullCalendarStub(props: Record<string, unknown>) {
    calendar.props = props;
    useEffect(() => {
      (props.datesSet as (arg: { start: Date; end: Date }) => void)(calendar.visibleWeek);
      // Solo al montar, como el aviso real de FullCalendar al elegir la semana.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <div data-testid="fullcalendar" />;
  },
}));

interface CalendarEvent {
  id?: string;
  end: string;
  display?: string;
  classNames: string[];
}

const events = () => (calendar.props?.events ?? []) as CalendarEvent[];
const nowOverlay = () => events().find((event) => event.display === "background");
const slotEvent = (id: string) => events().find((event) => event.id === id);

const MINUTE = 60_000;

function slot(overrides: Partial<BookingSlotEvent> = {}): BookingSlotEvent {
  return {
    id: "slot-1",
    start: new Date(2026, 10, 14, 10, 0).toISOString(),
    end: new Date(2026, 10, 14, 12, 0).toISOString(),
    status: "AVAILABLE",
    ...overrides,
  };
}

function renderCalendar(bookingSlots: BookingSlotEvent[] = []) {
  return render(
    <BookingCalendar
      selectedSlot={null}
      bookingSlots={bookingSlots}
      minimumNoticeMinutes={60}
      onSelectSlot={vi.fn()}
      onDeselectSlot={vi.fn()}
      onViewedRangeChange={vi.fn()}
    />
  );
}

describe("BookingCalendar y el paso del tiempo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Sábado 14/11/2026, 11:05. La semana visible es la del 9 al 15.
    vi.setSystemTime(new Date(2026, 10, 14, 11, 5));
    calendar.visibleWeek = { start: new Date(2026, 10, 9), end: new Date(2026, 10, 16) };
    calendar.props = null;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("dibuja la franja de «ya pasó» hasta la hora actual", () => {
    renderCalendar();

    expect(nowOverlay()?.end).toBe("2026-11-14T11:05:00");
    expect(nowOverlay()?.classNames).toEqual(["fc-past-now"]);
  });

  it("la franja de «ya pasó» avanza sola con el reloj", () => {
    renderCalendar();

    act(() => {
      vi.advanceTimersByTime(MINUTE);
    });
    expect(nowOverlay()?.end).toBe("2026-11-14T11:06:00");

    act(() => {
      vi.advanceTimersByTime(10 * MINUTE);
    });
    expect(nowOverlay()?.end).toBe("2026-11-14T11:16:00");
  });

  it("no dibuja esa franja si la semana visible no incluye hoy", () => {
    calendar.visibleWeek = { start: new Date(2026, 10, 16), end: new Date(2026, 10, 23) };

    renderCalendar([slot({ id: "next-week" })]);

    expect(nowOverlay()).toBeUndefined();
  });

  it("un bloque pasa a «pasado» cuando su hora de fin queda atrás, sin recargar los datos", () => {
    renderCalendar([slot()]);
    expect(slotEvent("slot-1")?.classNames).toEqual(["booking-slot-available"]);

    // 12:00 en punto todavía no es pasado.
    act(() => {
      vi.advanceTimersByTime(55 * MINUTE);
    });
    expect(slotEvent("slot-1")?.classNames).toEqual(["booking-slot-available"]);

    act(() => {
      vi.advanceTimersByTime(MINUTE);
    });
    expect(slotEvent("slot-1")?.classNames).toEqual(["booking-slot-past"]);
  });

  it("los bloques bloqueados y reservados también pasan a «pasado» al terminar", () => {
    renderCalendar([
      slot({ id: "blocked", status: "BLOCKED" }),
      slot({ id: "reserved", status: "RESERVED" }),
    ]);
    expect(slotEvent("blocked")?.classNames).toEqual(["booking-slot-blocked"]);
    expect(slotEvent("reserved")?.classNames).toEqual(["booking-slot-reserved"]);

    act(() => {
      vi.advanceTimersByTime(56 * MINUTE);
    });

    expect(slotEvent("blocked")?.classNames).toEqual(["booking-slot-past"]);
    expect(slotEvent("reserved")?.classNames).toEqual(["booking-slot-past"]);
  });
});
