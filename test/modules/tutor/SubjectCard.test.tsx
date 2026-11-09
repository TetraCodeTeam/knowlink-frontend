import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import SubjectCard from "@/modules/tutor/profile/components/SubjectCard";
import type { TutorOwnSubject } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";

const subject: TutorOwnSubject = {
  tutorSubjectId: "ts-1",
  subjectName: "Física 1",
  averageRating: null,
  reviewCount: null,
  modality: "VIRTUAL",
  compensationType: "PAID",
  pricePerHour: 8000,
  verificationStatus: "ACTIVE",
  active: true,
};

function renderCard(
  overrides: Partial<TutorOwnSubject> = {},
  onEdit?: (s: TutorOwnSubject) => void
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SubjectCard subject={{ ...subject, ...overrides }} onEdit={onEdit} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("SubjectCard", () => {
  it("no muestra el botón de editar cuando no recibe onEdit", () => {
    renderCard();

    expect(screen.queryByRole("button", { name: "Editar materia Física 1" })).toBeNull();
  });

  it("muestra el botón de editar y notifica la materia elegida", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    renderCard({}, onEdit);

    await user.click(screen.getByRole("button", { name: "Editar materia Física 1" }));

    expect(onEdit).toHaveBeenCalledWith(subject);
  });

  it("muestra el hint de verificacion en una materia activa sin verificar", () => {
    renderCard({ verificationStatus: "PENDING", verified: false, averageRating: 4.3, reviewCount: 7 });

    expect(screen.getByText("Promedio 4.3 · Necesitás 4.5 para verificarte")).toBeInTheDocument();
  });

  it("no muestra el hint cuando la materia ya esta verificada", () => {
    renderCard({ verificationStatus: "ACTIVE", verified: true, averageRating: 4.8, reviewCount: 7 });

    expect(screen.queryByText(/Necesitás 4.5 para verificarte/)).toBeNull();
  });

  it("no muestra el hint cuando el backend no informa la verificacion", () => {
    renderCard({ verificationStatus: "ACTIVE", averageRating: 4.8, reviewCount: 7 });

    expect(screen.queryByText(/Necesitás 4.5 para verificarte/)).toBeNull();
  });

  it("muestra el mensaje sin promedio cuando la materia nunca fue calificada", () => {
    renderCard({ verificationStatus: "PENDING", verified: false, averageRating: null, reviewCount: null });

    expect(
      screen.getByText("Necesitás un promedio de 4.5 en tus reseñas para verificarte")
    ).toBeInTheDocument();
  });

  it("muestra el chip Desactivada y el botón Reactivar en una materia inactiva", () => {
    renderCard({ active: false });

    expect(screen.getByText("Desactivada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reactivar" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Desactivar" })).toBeNull();
  });
});
