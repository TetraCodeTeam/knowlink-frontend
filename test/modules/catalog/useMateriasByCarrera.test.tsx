import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMateriasByCarrera } from "@/modules/catalog/hooks/useMateriasByCarrera";

vi.mock("@/modules/catalog/api/catalog.api", () => ({
  getInstitutions: vi.fn(),
  getCareersByInstitution: vi.fn(),
  getSubjectsByInstitutionAndCareer: vi.fn(),
  createSubject: vi.fn(),
  updateSubjectCareers: vi.fn(),
}));

import { getSubjectsByInstitutionAndCareer } from "@/modules/catalog/api/catalog.api";

const mockedGetSubjects = vi.mocked(getSubjectsByInstitutionAndCareer);

function renderWithClient(institutionId?: string, careerId?: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(
    ({ inst, career }: { inst?: string; career?: string }) => useMateriasByCarrera(inst, career),
    { wrapper, initialProps: { inst: institutionId, career: careerId } }
  );
}

describe("useMateriasByCarrera — lista combinada (carrera + compartidas) resuelta por el backend", () => {
  beforeEach(() => {
    mockedGetSubjects.mockReset();
  });

  it("no consulta materias si falta la institución o la carrera", async () => {
    mockedGetSubjects.mockResolvedValue([]);

    const { result, rerender } = renderWithClient("inst-utn", undefined);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(mockedGetSubjects).not.toHaveBeenCalled();

    rerender({ inst: undefined, career: "career-sis" });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(mockedGetSubjects).not.toHaveBeenCalled();
  });

  it("consulta con institución y carrera y devuelve la lista combinada", async () => {
    mockedGetSubjects.mockResolvedValue([
      {
        subjectId: "subject-sis",
        name: "Programación",
        isBasic: false,
        careerIds: ["career-sis"],
      },
      {
        subjectId: "subject-comp",
        name: "Análisis Matemático I",
        isBasic: true,
        careerIds: ["career-comp"],
      },
    ]);

    const { result } = renderWithClient("inst-utn", "career-sis");

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });
    expect(mockedGetSubjects).toHaveBeenCalledWith("inst-utn", "career-sis");
  });
});