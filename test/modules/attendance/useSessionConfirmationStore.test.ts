import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";

describe("useSessionConfirmationStore — TTL de resolvedBookingIds", () => {
  beforeEach(() => {
    useSessionConfirmationStore.setState({ pending: null, resolvedBookingIds: new Map() });
    vi.useRealTimers();
  });

  it("olvida una reserva resuelta después de que expira su TTL", () => {
    vi.useFakeTimers();
    const store = useSessionConfirmationStore;

    store.setState({
      pending: { sessionId: "booking-1", expiresAt: "2026-01-01T00:00:00", deadlineLabel: "00:00 hs" },
    });
    store.getState().clearConfirmation();
    expect(store.getState().isResolved("booking-1")).toBe(true);

    // Todavía no pasó el TTL (6 min).
    vi.advanceTimersByTime(5 * 60 * 1000);
    expect(store.getState().isResolved("booking-1")).toBe(true);

    // Pasó el TTL: ya no debería considerarse resuelta.
    vi.advanceTimersByTime(2 * 60 * 1000);
    expect(store.getState().isResolved("booking-1")).toBe(false);

    vi.useRealTimers();
  });

  it("poda entradas vencidas del Map al confirmar una reserva nueva, en vez de acumularlas para siempre", () => {
    vi.useFakeTimers();
    const store = useSessionConfirmationStore;

    store.setState({
      pending: { sessionId: "booking-old", expiresAt: "2026-01-01T00:00:00", deadlineLabel: "00:00 hs" },
    });
    store.getState().clearConfirmation();
    expect(store.getState().resolvedBookingIds.size).toBe(1);

    vi.advanceTimersByTime(7 * 60 * 1000); // supera el TTL de "booking-old"

    store.setState({
      pending: { sessionId: "booking-new", expiresAt: "2026-01-01T01:00:00", deadlineLabel: "01:00 hs" },
    });
    store.getState().clearConfirmation();

    // "booking-old" se podó; el Map no crece indefinidamente.
    expect(store.getState().resolvedBookingIds.has("booking-old")).toBe(false);
    expect(store.getState().resolvedBookingIds.has("booking-new")).toBe(true);
    expect(store.getState().resolvedBookingIds.size).toBe(1);

    vi.useRealTimers();
  });
});
