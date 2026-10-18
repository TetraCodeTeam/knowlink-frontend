import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInstituciones } from "@/modules/catalog/hooks/useInstituciones";

vi.mock("@/modules/catalog/api/catalog.api", () => ({
  getInstitutions: vi.fn(),
  getCareersByInstitution: vi.fn(),
  getSubjectsByInstitutionAndCareer: vi.fn(),
  createSubject: vi.fn(),
  updateSubjectCareers: vi.fn(),
}));

import { getInstitutions } from "@/modules/catalog/api/catalog.api";

const mockedGetInstitutions = vi.mocked(getInstitutions);

function renderWithClient() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useInstituciones(), { wrapper });
}

describe("useInstituciones — lista de instituciones del catálogo", () => {
  beforeEach(() => {
    mockedGetInstitutions.mockReset();
  });

  it("carga y devuelve las instituciones", async () => {
    mockedGetInstitutions.mockResolvedValue([
      { institutionId: "inst-utn", name: "UTN FRVM" },
      { institutionId: "inst-unvm", name: "UNVM" },
    ]);

    const { result } = renderWithClient();

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });
    expect(result.current.data?.[0].name).toBe("UTN FRVM");
    expect(mockedGetInstitutions).toHaveBeenCalledTimes(1);
  });
});