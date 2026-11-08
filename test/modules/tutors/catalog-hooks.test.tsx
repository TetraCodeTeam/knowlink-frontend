import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getBasicSubjects, getCareers } from "@/modules/tutors/api/catalog.api";
import { useCareers } from "@/modules/tutors/hooks/useCareers";
import { useBasicSubjects } from "@/modules/tutors/hooks/useBasicSubjects";

vi.mock("@/modules/tutors/api/catalog.api", () => ({
  getCareers: vi.fn(),
  getBasicSubjects: vi.fn(),
}));

const utnCareers = [{ careerId: "career-utn", name: "Ingeniería Civil" }];
const unvmCareers = [{ careerId: "career-unvm", name: "Medicina Veterinaria" }];

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { client, wrapper };
}

describe("hooks del catálogo institucional", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useCareers no consulta sin institución", () => {
    const { wrapper } = setup();
    const { result } = renderHook(() => useCareers(undefined), { wrapper });

    expect(getCareers).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("useCareers cambia la query key y recarga al cambiar de institución", async () => {
    vi.mocked(getCareers).mockImplementation(async (institutionId) =>
      institutionId === "institution-utn" ? utnCareers : unvmCareers
    );
    const { client, wrapper } = setup();
    const { result, rerender } = renderHook(({ id }: { id: string }) => useCareers(id), {
      wrapper,
      initialProps: { id: "institution-utn" },
    });

    await waitFor(() => expect(result.current.data).toEqual(utnCareers));
    expect(client.getQueryData(["careers", "institution-utn"])).toEqual(utnCareers);

    rerender({ id: "institution-unvm" });

    await waitFor(() => expect(result.current.data).toEqual(unvmCareers));
    expect(getCareers).toHaveBeenCalledWith("institution-unvm");
    expect(client.getQueryData(["careers", "institution-unvm"])).toEqual(unvmCareers);
  });

  it("useBasicSubjects no consulta sin institución", () => {
    const { wrapper } = setup();
    renderHook(() => useBasicSubjects(undefined), { wrapper });

    expect(getBasicSubjects).not.toHaveBeenCalled();
  });

  it("useBasicSubjects incluye la institución en la query key", async () => {
    vi.mocked(getBasicSubjects).mockResolvedValue([
      { subjectId: "subject-1", name: "Análisis Matemático", isBasic: true },
    ]);
    const { client, wrapper } = setup();
    const { result } = renderHook(() => useBasicSubjects("institution-unvm"), { wrapper });

    await waitFor(() => expect(result.current.data).toHaveLength(1));

    expect(getBasicSubjects).toHaveBeenCalledWith("institution-unvm");
    expect(client.getQueryData(["subjects", "basic", "institution-unvm"])).toHaveLength(1);
  });
});
