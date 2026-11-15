import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { confirmSessionAttendance } from "@/modules/attendance/api/attendance.api";
import { useConfirmSessionAttendance } from "@/modules/attendance/hooks/useConfirmSessionAttendance";

vi.mock("@/modules/attendance/api/attendance.api", () => ({
  confirmSessionAttendance: vi.fn(),
}));

const mockedConfirm = vi.mocked(confirmSessionAttendance);

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}

describe("useConfirmSessionAttendance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refresca las reservas de asistencia y la agenda semanal al confirmar", async () => {
    mockedConfirm.mockResolvedValue(undefined);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useConfirmSessionAttendance(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ sessionId: "booking-1", code: "1234" });
    });

    expect(mockedConfirm).toHaveBeenCalledWith("booking-1", "1234");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["attendance-upcoming-bookings"] });
    // The class now counts as COMPLETED in the tutor's weekly agenda, so it must be refetched.
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["weekly-agenda"] });
  });
});
