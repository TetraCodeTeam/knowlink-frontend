import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { useSupportSelection } from "@/modules/support/hooks/useSupportSelection";
import { buildSupportClaimsPath } from "@/modules/tutor/statistics/utils/statistics-links.utils";

describe("buildSupportClaimsPath", () => {
  it("con el id de un reclamo apunta a su detalle en la pestaña de reclamos", () => {
    expect(buildSupportClaimsPath("claim-1")).toBe("/tutor/requests?tab=claims&claim=claim-1");
  });

  it("sin id muestra solo el listado de reclamos", () => {
    expect(buildSupportClaimsPath()).toBe("/tutor/requests?tab=claims");
    expect(buildSupportClaimsPath(null)).toBe("/tutor/requests?tab=claims");
  });

  it("codifica el id para que no rompa la URL", () => {
    expect(buildSupportClaimsPath("a b&c")).toBe("/tutor/requests?tab=claims&claim=a+b%26c");
  });

  it("Soporte interpreta el enlace: abre ese reclamo (contrato con useSupportSelection)", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[buildSupportClaimsPath("claim-1")]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useSupportSelection(), { wrapper });

    expect(result.current.activeTab).toBe("claims");
    expect(result.current.selectedDetail).toEqual({ type: "claim", id: "claim-1" });
  });

  it("Soporte interpreta el enlace sin id: pestaña de reclamos y nada elegido", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[buildSupportClaimsPath()]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useSupportSelection(), { wrapper });

    expect(result.current.activeTab).toBe("claims");
    expect(result.current.selectedDetail).toBeNull();
  });
});
