import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBookingSlots } from "@/modules/student/booking/hooks/useBookingSlots";
import { BOOKING_CALENDAR_REFRESH_INTERVAL_MS } from "@/modules/student/booking/constants/bookingRefresh.constants";

vi.mock("@/modules/student/booking/api/booking.api", () => ({
  getBookingCalendar: vi.fn(),
}));

import { getBookingCalendar } from "@/modules/student/booking/api/booking.api";

const mockedGetBookingCalendar = vi.mocked(getBookingCalendar);

const MINUTE = 60_000;

// Mismo vencimiento que el cliente real (5 min): lo que se prueba es que el calendario se vuelve a
// pedir aunque el dato en caché todavía sea "fresco".
function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 5 * MINUTE } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe("useBookingSlots", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedGetBookingCalendar.mockReset();
    mockedGetBookingCalendar.mockResolvedValue({ minimumNoticeMinutes: 60, slots: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("devuelve los bloques y la anticipación mínima del tutor", async () => {
    const { wrapper } = setup();

    const { result } = renderHook(() => useBookingSlots("tutor-1", "2026-11-09", "2026-11-30"), {
      wrapper,
    });
    // React Query avisa el resultado con un temporizador propio: vi.waitFor lo hace correr.
    await vi.waitFor(() =>
      expect(result.current.data).toEqual({ slots: [], minimumNoticeMinutes: 60 })
    );

    expect(mockedGetBookingCalendar).toHaveBeenCalledWith("tutor-1", "2026-11-09", "2026-11-30");
  });

  it("si el backend no manda la anticipación mínima, usa 0", async () => {
    mockedGetBookingCalendar.mockResolvedValue({ slots: [] } as never);
    const { wrapper } = setup();

    const { result } = renderHook(() => useBookingSlots("tutor-1", "2026-11-09", "2026-11-30"), {
      wrapper,
    });
    await vi.waitFor(() => expect(result.current.data?.minimumNoticeMinutes).toBe(0));
  });

  it("vuelve a pedir el calendario cada minuto mientras la pantalla está abierta", async () => {
    const { wrapper } = setup();
    renderHook(() => useBookingSlots("tutor-1", "2026-11-09", "2026-11-30"), { wrapper });
    await advance(0);
    expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);

    await advance(BOOKING_CALENDAR_REFRESH_INTERVAL_MS - 1);
    expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);

    await advance(1);
    expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(2);

    await advance(BOOKING_CALENDAR_REFRESH_INTERVAL_MS);
    expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(3);
  });

  it("no consulta nada si todavía no hay tutor", async () => {
    const { wrapper } = setup();
    renderHook(() => useBookingSlots("", "2026-11-09", "2026-11-30"), { wrapper });

    await advance(5 * MINUTE);

    expect(mockedGetBookingCalendar).not.toHaveBeenCalled();
  });

  it("al volver a la ventana lo pide de nuevo aunque el dato en caché siga fresco", async () => {
    const { wrapper } = setup();
    renderHook(() => useBookingSlots("tutor-1", "2026-11-09", "2026-11-30"), { wrapper });
    await advance(0);
    expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);

    await act(async () => {
      focusManager.setFocused(false);
      focusManager.setFocused(true);
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(2);
  });

  it("al entrar a la pantalla lo pide de nuevo aunque haya un calendario fresco en caché", async () => {
    const { client, wrapper } = setup();
    client.setQueryData(["booking-calendar", "tutor-1", "2026-11-09", "2026-11-30"], {
      slots: [],
      minimumNoticeMinutes: 60,
    });

    renderHook(() => useBookingSlots("tutor-1", "2026-11-09", "2026-11-30"), { wrapper });
    await advance(0);

    expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);
  });

  describe("con un horario seleccionado (pausado)", () => {
    it("no se actualiza solo ni al volver a la ventana", async () => {
      const { wrapper } = setup();
      renderHook(() => useBookingSlots("tutor-1", "2026-11-09", "2026-11-30", { paused: true }), {
        wrapper,
      });
      await advance(0);
      expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);

      await advance(5 * MINUTE);
      await act(async () => {
        focusManager.setFocused(false);
        focusManager.setFocused(true);
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);
    });

    it("al terminar la selección lo pide de inmediato y retoma la actualización", async () => {
      const { wrapper } = setup();
      const { rerender } = renderHook(
        ({ paused }) => useBookingSlots("tutor-1", "2026-11-09", "2026-11-30", { paused }),
        { wrapper, initialProps: { paused: false } }
      );
      await advance(0);
      expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);

      rerender({ paused: true });
      await advance(3 * MINUTE);
      expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);

      rerender({ paused: false });
      await advance(0);
      expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(2);

      await advance(BOOKING_CALENDAR_REFRESH_INTERVAL_MS);
      expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(3);
    });

    it("no pide nada extra si nunca estuvo pausado", async () => {
      const { wrapper } = setup();
      const { rerender } = renderHook(
        ({ paused }) => useBookingSlots("tutor-1", "2026-11-09", "2026-11-30", { paused }),
        { wrapper, initialProps: { paused: false } }
      );
      await advance(0);

      rerender({ paused: false });
      await advance(0);

      expect(mockedGetBookingCalendar).toHaveBeenCalledTimes(1);
    });
  });
});
