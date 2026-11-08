import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePendingRatings } from "@/modules/class-history/hooks/usePendingRatings";
import { RATING_GATE_QUERY_KEYS } from "@/modules/class-history/constants/ratingGate.constants";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { PendingRatingItem } from "@/modules/class-history/interfaces/responses/pending-ratings.interface";

vi.mock("@/modules/class-history/api/ratingGate.api", () => ({
  getPendingRatings: vi.fn(),
}));

import { getPendingRatings } from "@/modules/class-history/api/ratingGate.api";

const mockedGetPendingRatings = vi.mocked(getPendingRatings);

function makeItem(overrides: Partial<PendingRatingItem> = {}): PendingRatingItem {
  return {
    bookingId: "b-1",
    raterRole: "STUDENT",
    subjectName: "Física 1",
    otherPartyFullName: "María Luz Juárez",
    sessionDate: "2026-10-20",
    startTime: "10:00:00",
    endTime: "11:00:00",
    ...overrides,
  };
}

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { client, wrapper };
}

function mockAuth(role: "STUDENT" | "TUTOR" | "ADMIN" = "STUDENT") {
  useAuthStore.setState({
    isAuthenticated: true,
    authResponse: {
      userId: "u-1",
      email: "alumno@test.com",
      fullName: null,
      token: "token",
      role,
    } as never,
  });
}

describe("usePendingRatings", () => {
  beforeEach(() => {
    mockedGetPendingRatings.mockReset();
    mockAuth();
  });

  it("expone la primera sesion pendiente y el total", async () => {
    mockedGetPendingRatings.mockResolvedValue({
      blocking: [makeItem(), makeItem({ bookingId: "b-2" })],
      nextBlockAt: null,
    });
    const { wrapper } = setup();

    const { result } = renderHook(() => usePendingRatings(), { wrapper });

    await waitFor(() => {
      expect(result.current.total).toBe(2);
    });
    expect(result.current.current?.bookingId).toBe("b-1");
    expect(result.current.nextBlockAt).toBeNull();
  });

  it("falla abierto cuando la consulta no responde", async () => {
    mockedGetPendingRatings.mockRejectedValue(new Error("network"));
    const { wrapper } = setup();

    const { result } = renderHook(() => usePendingRatings(), { wrapper });

    await waitFor(() => {
      expect(mockedGetPendingRatings).toHaveBeenCalledTimes(1);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.blocking).toEqual([]);
    expect(result.current.current).toBeNull();
    expect(result.current.total).toBe(0);
  });

  it("no consulta cuando el rol es ADMIN", async () => {
    mockAuth("ADMIN");
    mockedGetPendingRatings.mockResolvedValue({ blocking: [], nextBlockAt: null });
    const { wrapper } = setup();

    renderHook(() => usePendingRatings(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockedGetPendingRatings).not.toHaveBeenCalled();
  });

  it("reconsulta cuando se cumple el nextBlockAt", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      mockedGetPendingRatings.mockResolvedValue({
        blocking: [],
        nextBlockAt: new Date(Date.now() + 5_000).toISOString(),
      });
      const { wrapper } = setup();

      const { result } = renderHook(() => usePendingRatings(), { wrapper });

      await waitFor(() => {
        expect(result.current.nextBlockAt).not.toBeNull();
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(7_000);
      });

      await waitFor(() => {
        expect(mockedGetPendingRatings.mock.calls.length).toBeGreaterThanOrEqual(2);
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("hace polling cada 30 segundos", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      mockedGetPendingRatings.mockResolvedValue({ blocking: [], nextBlockAt: null });
      const { wrapper } = setup();

      renderHook(() => usePendingRatings(), { wrapper });

      await waitFor(() => {
        expect(mockedGetPendingRatings).toHaveBeenCalledTimes(1);
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });

      await waitFor(() => {
        expect(mockedGetPendingRatings.mock.calls.length).toBeGreaterThanOrEqual(2);
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("invalida el resto de las consultas cuando se destraba el bloqueo", async () => {
    mockedGetPendingRatings
      .mockResolvedValueOnce({ blocking: [makeItem()], nextBlockAt: null })
      .mockResolvedValue({ blocking: [], nextBlockAt: null });
    const { client, wrapper } = setup();

    const { result } = renderHook(() => usePendingRatings(), { wrapper });

    await waitFor(() => {
      expect(result.current.total).toBe(1);
    });

    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    await act(async () => {
      await client.invalidateQueries({ queryKey: RATING_GATE_QUERY_KEYS.pending });
    });

    await waitFor(() => {
      expect(result.current.total).toBe(0);
    });

    const filters = invalidateSpy.mock.calls
      .map(([arg]) => arg)
      .find((arg) => typeof arg === "object" && arg !== null && "predicate" in arg) as
      | { predicate: (query: { queryKey: readonly unknown[] }) => boolean }
      | undefined;

    expect(filters).toBeTruthy();
    const predicate = filters!.predicate;
    expect(predicate({ queryKey: ["bookingHistory"] })).toBe(true);
    expect(predicate({ queryKey: ["ratingGate", "pending"] })).toBe(false);
  });
});
