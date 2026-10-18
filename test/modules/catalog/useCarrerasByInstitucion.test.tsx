import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCarrerasByInstitucion } from "@/modules/catalog/hooks/useCarrerasByInstitucion";

vi.mock("@/modules/catalog/api/catalog.api", () => ({
  getInstitutions: vi.fn(),
  getCareersByInstitution: vi.fn(),
  getSubjectsByInstitutionAndCareer: vi.fn(),
  createSubject: vi.fn(),
  updateSubjectCareers: vi.fn(),
}));

import { getCareersByInstitution } from "@/modules/catalog/api/catalog.api";

const mockedGetCareers = vi.mocked(getCareersByInstitution);

function renderWithClient(initialInstitutionId?: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(({ institutionId }: { institutionId?: string }) => useCarrerasByInstitucion(institutionId), {
    wrapper,
    initialProps: { institutionId: initialInstitutionId },
  });
}

describe("useCarrerasByInstitucion — carreras filtradas por institución", () => {
  beforeEach(() => {
    mockedGetCareers.mockReset();
  });

  it("no consulta carreras mientras no haya institución seleccionada", async () => {
    mockedGetCareers.mockResolvedValue([]);

    const { result } = renderWithClient(undefined);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(mockedGetCareers).not.toHaveBeenCalled();
  });

  it("usa una cache por institución: cambiar de institución no sirve las carreras de la anterior", async () => {
    mockedGetCareers.mockImplementation(async (institutionId: string) =>
      institutionId === "inst-utn"
        ? [{ careerId: "career-sis", name: "Ingeniería en Sistemas", type: "REGULAR" }]
        : [{ careerId: "career-ind", name: "Ingeniería Industrial", type: "REGULAR" }]
    );

    const { result, rerender } = renderWithClient("inst-utn");

    await waitFor(() => {
      expect(result.current.data?.[0].name).toBe("Ingeniería en Sistemas");
    });

    rerender({ institutionId: "inst-unvm" });

    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.data?.[0].name).toBe("Ingeniería Industrial");
    });
    expect(mockedGetCareers).toHaveBeenCalledWith("inst-unvm");
  });
});