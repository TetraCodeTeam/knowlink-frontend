import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAvailableSubjects } from "@/modules/tutor/availability/hooks/useAvailableSubjects";
import { useMySubjectsWithCatalogId } from "@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId";
import { useBasicSubjects } from "@/modules/tutors/hooks/useBasicSubjects";
import { useCareerSubjects } from "@/modules/tutors/hooks/useCareerSubjects";

const utnCareerSubject = { subjectId: "subject-utn", name: "Ingeniería Civil I", isBasic: false };
const unvmCareerSubject = {
  subjectId: "subject-unvm",
  name: "Medicina Veterinaria I",
  isBasic: false,
};
const utnSharedSubject = { subjectId: "shared-utn", name: "Inglés", isBasic: true };
const unvmSharedSubject = { subjectId: "shared-unvm", name: "Inglés", isBasic: true };
const institutionOnlySubject = { subjectId: "subject-contabilidad", name: "Contabilidad" };

vi.mock("@/modules/tutor/hooks/useMyTutorProfile", () => ({
  useMyTutorProfile: () => ({
    data: {
      careerId: "career-unvm",
      career: "Medicina Veterinaria",
      institutionId: "institution-unvm",
      institution: "UNVM",
      subjects: [{ tutorSubjectId: "ts-1", subjectName: "Materia Ya Cargada" }],
    },
    isLoading: false,
  }),
}));

vi.mock("@/modules/tutor/profile/hooks/useMyTutorProfile", () => ({
  useMyTutorProfile: () => ({
    data: {
      careerId: "career-unvm",
      career: "Medicina Veterinaria",
      institutionId: "institution-unvm",
      institution: "UNVM",
      subjects: [
        { tutorSubjectId: "ts-2", subjectName: "Medicina Veterinaria I" },
        { tutorSubjectId: "ts-3", subjectName: "Contabilidad" },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock("@/modules/tutors/hooks/useBasicSubjects", () => ({
  useBasicSubjects: vi.fn((institutionId?: string) => ({
    data: institutionId === "institution-unvm" ? [unvmSharedSubject] : [utnSharedSubject],
    isLoading: false,
  })),
}));

vi.mock("@/modules/tutors/hooks/useCareerSubjects", () => ({
  useCareerSubjects: vi.fn((careerId?: string) => ({
    data: careerId === "career-unvm" ? [unvmCareerSubject] : [utnCareerSubject],
    isLoading: false,
  })),
}));

vi.mock("@/modules/community/hooks/useCommunitySubjects", () => ({
  useCommunitySubjects: vi.fn(() => ({
    subjects: [unvmSharedSubject, unvmCareerSubject, institutionOnlySubject],
    isLoading: false,
  })),
}));

describe("resolución del catálogo por ids del perfil", () => {
  it("useAvailableSubjects usa la institución y la carrera del tutor", () => {
    const { result } = renderHook(() => useAvailableSubjects());

    expect(vi.mocked(useBasicSubjects)).toHaveBeenCalledWith("institution-unvm");
    expect(vi.mocked(useCareerSubjects)).toHaveBeenCalledWith("career-unvm");
    expect(result.current.careerSubjects).toEqual([unvmCareerSubject]);
    expect(result.current.basicSubjects).toEqual([unvmSharedSubject]);
    expect(result.current.isLoading).toBe(false);
  });

  it("useMySubjectsWithCatalogId resuelve todas las materias con su id de catálogo", () => {
    const { result } = renderHook(() => useMySubjectsWithCatalogId());

    expect(vi.mocked(useBasicSubjects)).toHaveBeenCalledWith("institution-unvm");
    expect(vi.mocked(useCareerSubjects)).toHaveBeenCalledWith("career-unvm");
    expect(result.current.subjects).toEqual([
      {
        tutorSubjectId: "ts-2",
        subjectName: "Medicina Veterinaria I",
        catalogSubjectId: "subject-unvm",
      },
      {
        tutorSubjectId: "ts-3",
        subjectName: "Contabilidad",
        catalogSubjectId: "subject-contabilidad",
      },
    ]);
  });
});
