import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useNow } from "@/shared/hooks/useNow";

const at = (hours: number, minutes: number, seconds = 0) =>
  new Date(2026, 10, 14, hours, minutes, seconds).getTime();

function setVisibility(state: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("useNow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(at(11, 5));
  });

  afterEach(() => {
    // Quita el valor forzado y vuelve al de jsdom.
    Reflect.deleteProperty(document, "visibilityState");
    vi.useRealTimers();
  });

  it("empieza con la hora actual", () => {
    const { result } = renderHook(() => useNow());

    expect(result.current).toBe(at(11, 5));
  });

  it("avanza solo cada minuto, sin que nadie interactúe", () => {
    const { result } = renderHook(() => useNow());

    act(() => {
      vi.advanceTimersByTime(59_999);
    });
    expect(result.current).toBe(at(11, 5));

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(at(11, 6));

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current).toBe(at(11, 7));
  });

  it("respeta un intervalo propio", () => {
    const { result } = renderHook(() => useNow(10_000));

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current).toBe(at(11, 5, 10));
  });

  it("al volver a la pestaña se pone al día aunque el navegador haya frenado los temporizadores", () => {
    const { result } = renderHook(() => useNow());

    // La pestaña estuvo oculta 40 minutos y sus temporizadores no corrieron.
    vi.setSystemTime(at(11, 45));
    expect(result.current).toBe(at(11, 5));

    act(() => setVisibility("visible"));

    expect(result.current).toBe(at(11, 45));
  });

  it("no se actualiza mientras la pestaña sigue oculta", () => {
    const { result } = renderHook(() => useNow());
    vi.setSystemTime(at(11, 45));

    act(() => setVisibility("hidden"));

    expect(result.current).toBe(at(11, 5));
  });

  it("al desmontar limpia el temporizador y deja de escuchar la pestaña", () => {
    const { result, unmount } = renderHook(() => useNow());
    unmount();

    expect(vi.getTimerCount()).toBe(0);

    vi.setSystemTime(at(12, 0));
    act(() => setVisibility("visible"));
    expect(result.current).toBe(at(11, 5));
  });
});
