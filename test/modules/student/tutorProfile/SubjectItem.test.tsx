import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SubjectRateItem } from "@/modules/student/tutorProfile/components/SubjectItem";
import type { TutorSubjectRate } from "@/modules/student/tutorProfile/interfaces/tutor.interface";

const baseSubject: TutorSubjectRate = {
  id: "ts-1",
  subjectId: "subject-1",
  name: "Fisica 1",
  rating: 4.8,
  reviewsCount: 12,
  price: 8000,
  isFree: false,
  modalities: ["Virtual"],
  rawModality: "VIRTUAL",
  isVerified: true,
};

function renderSubject(overrides: Partial<TutorSubjectRate> = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <SubjectRateItem subject={{ ...baseSubject, ...overrides }} />
    </QueryClientProvider>
  );
}

describe("SubjectRateItem", () => {
  it("muestra el chip Tutor Verificado cuando la materia esta verificada", () => {
    renderSubject();

    expect(screen.getByText("Tutor Verificado")).toBeInTheDocument();
  });

  it("no muestra el chip de verificacion en una materia sin verificar", () => {
    renderSubject({ isVerified: false });

    expect(screen.queryByText("Tutor Verificado")).toBeNull();
  });
});