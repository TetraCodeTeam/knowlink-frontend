import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { removeWeekCustomization } from "@/modules/tutor/availability/api/availability-blocks.api";
import { useRemoveWeekCustomization } from "@/modules/tutor/availability/hooks/useRemoveWeekCustomization";

vi.mock("@/modules/tutor/availability/api/availability-blocks.api", () => ({
  saveWeekAvailabilityBlocks: vi.fn(),
  removeWeekCustomization: vi.fn(),
}));

vi.mock("@/shared/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedRemove = vi.mocked(removeWeekCustomization);
const mockedToast = vi.mocked(toast);

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}
describe("useRemoveWeekCustomization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invalida la agenda semanal al quitar la personalización de la semana", async () => {
    mockedRemove.mockResolvedValue(undefined);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useRemoveWeekCustomization(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync("2026-11-09");
    });

    expect(mockedRemove).toHaveBeenCalledWith("2026-11-09");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["week-customization"] });
    // The removed customization changes the week shown in the agenda, so refresh it too.
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["weekly-agenda"] });
    expect(mockedToast.success).toHaveBeenCalled();
  });
});
