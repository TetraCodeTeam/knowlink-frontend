import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { reserveBooking } from "@/modules/student/booking/api/booking.api";
import { useBookingRealtime } from "@/modules/student/booking/hooks/useBookingRealtime";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import type { BookingFormValues } from "@/modules/student/booking/schemas/booking.schema";

vi.mock("@/modules/student/booking/api/booking.api", () => ({
  getBookingBlockId: vi.fn((slotId: string) => slotId.split("__")[0]),
  holdBookingSlot: vi.fn(),
  reserveBooking: vi.fn(),
  releaseBookingSlot: vi.fn(),
}));

vi.mock("@/modules/student/booking/api/bookingSlotsRealtime.api", () => ({
  publishBookingSlotStatus: vi.fn(),
  subscribeToBookingSlotEvents: vi.fn(() => () => undefined),
}));

vi.mock("@/modules/student/booking/hooks/useBookingSlots", () => ({
  useBookingSlots: vi.fn(() => ({ data: undefined, isLoading: false })),
}));
const mockedReserve = vi.mocked(reserveBooking);

const SLOT: BookingSlot = {
  id: "block-1__2026-11-10T14:00:00.000Z",
  startIso: "2026-11-10T14:00:00.000Z",
  endIso: "2026-11-10T15:00:00.000Z",
  date: "2026-11-10",
  startTime: "14:00",
  endTime: "15:00",
  durationHours: 1,
  expiresAt: "2026-11-10T13:55:00.000Z",
};

const FORM_VALUES: BookingFormValues = {
  bookingSlotId: "block-1",
  tutorSubjectId: "tutor-subject-1",
  topic: "Ecuaciones de segundo grado",
  modality: "VIRTUAL",
};

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}
describe("useBookingRealtime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invalida la agenda semanal al confirmar una reserva", async () => {
    mockedReserve.mockResolvedValue(undefined);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useBookingRealtime("tutor-1", "2026-11-09", "2026-11-15"), {
      wrapper,
    });

    await act(async () => {
      await result.current.reserveSlot(SLOT, FORM_VALUES);
    });

    expect(mockedReserve).toHaveBeenCalledWith("tutor-1", SLOT, FORM_VALUES);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["booking-calendar", "tutor-1"] });
    // A new booking changes both the grid and the summary of the weekly agenda.
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["weekly-agenda"] });
  });
});
