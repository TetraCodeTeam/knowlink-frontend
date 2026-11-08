import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import type { ReactNode, SyntheticEvent } from "react";
import { useSupportSelection } from "@/modules/support/hooks/useSupportSelection";

function buildWrapper(entry: string) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[entry]}>{children}</MemoryRouter>;
  }
  return Wrapper;
}

function renderSelection(entry: string) {
  return renderHook(() => ({ selection: useSupportSelection(), location: useLocation() }), {
    wrapper: buildWrapper(entry),
  });
}

describe("useSupportSelection — parametros de la URL", () => {
  it("aplica la pestana y el reclamo recibidos por URL", () => {
    const { result } = renderSelection("/student/complaints?tab=claims&claim=claim-1");

    expect(result.current.selection.activeTab).toBe("claims");
    expect(result.current.selection.selectedDetail).toEqual({ type: "claim", id: "claim-1" });
  });

  it("aplica la pestana de materiales y el material recibido por URL", () => {
    const { result } = renderSelection("/student/complaints?tab=materials&material=material-1");

    expect(result.current.selection.activeTab).toBe("materials");
    expect(result.current.selection.selectedDetail).toEqual({
      type: "material",
      id: "material-1",
    });
  });

  it("ignora una pestana invalida y mantiene la pestana por defecto", () => {
    const { result } = renderSelection("/student/complaints?tab=unknown");

    expect(result.current.selection.activeTab).toBe("claims");
    expect(result.current.selection.selectedDetail).toBeNull();
  });

  it("limpia los parametros de la URL al cambiar de pestana", () => {
    const { result } = renderSelection("/student/complaints?tab=claims&claim=claim-1");

    act(() => {
      result.current.selection.changeTab({} as SyntheticEvent, "materials");
    });

    expect(result.current.selection.activeTab).toBe("materials");
    expect(result.current.selection.selectedDetail).toBeNull();
    expect(result.current.location.search).toBe("");
  });

  it("limpia el parametro claim al cerrar el detalle", () => {
    const { result } = renderSelection("/student/complaints?tab=claims&claim=claim-1");

    act(() => {
      result.current.selection.clearSelection();
    });

    expect(result.current.selection.selectedDetail).toBeNull();
    expect(result.current.location.search).toBe("");
  });
});
