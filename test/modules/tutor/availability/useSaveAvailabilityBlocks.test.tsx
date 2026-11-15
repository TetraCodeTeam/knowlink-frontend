import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { saveWeekAvailabilityBlocks } from "@/modules/tutor/availability/api/availability-blocks.api";
import { useSaveAvailabilityBlocks } from "@/modules/tutor/availability/hooks/useSaveAvailabilityBlocks";

vi.mock("@/modules/tutor/availability/api/availability-blocks.api", () => ({
  saveWeekAvailabilityBlocks: vi.fn(),
  removeWeekCustomization: vi.fn(),
}));

vi.mock("@/shared/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedSave = vi.mocked(saveWeekAvailabilityBlocks);
const mockedToast = vi.mocked(toast);

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}
describe("useSaveAvailabilityBlocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invalida la agenda semanal al guardar la disponibilidad de la semana", async () => {
    mockedSave.mockResolvedValue([]);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useSaveAvailabilityBlocks(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        weekStart: "2026-11-09",
        weekEnd: "2026-11-15",
        blocks: [],
      });
    });

    expect(mockedSave).toHaveBeenCalledWith("2026-11-09", "2026-11-15", []);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["availability-blocks"] });
    // Blocked windows reshape the agenda grid, so it must be refetched too.
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["weekly-agenda"] });
    expect(mockedToast.success).toHaveBeenCalledWith("Disponibilidad guardada correctamente.");
  });
});
