import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cancelBooking } from "@/modules/class-history/api/classHistory.api";
import { useCancelBooking } from "@/modules/class-history/hooks/useCancelBooking";

vi.mock("@/modules/class-history/api/classHistory.api", () => ({
  cancelBooking: vi.fn(),
}));

const mockedCancel = vi.mocked(cancelBooking);

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}
describe("useCancelBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invalida la agenda semanal junto con el resto de vistas tras cancelar", async () => {
    mockedCancel.mockResolvedValue({} as Awaited<ReturnType<typeof cancelBooking>>);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useCancelBooking("booking-1"), { wrapper });

    await act(async () => {
      await result.current.confirmCancelBooking();
    });
    act(() => {
      result.current.invalidate();
    });

    expect(mockedCancel).toHaveBeenCalledWith("booking-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["bookingDetail", "booking-1"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["bookingHistory"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["availability-blocks"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["booking-calendar"] });
    // The cancelled booking frees its slot, so the tutor's weekly agenda must refresh too.
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["weekly-agenda"] });
  });
});
