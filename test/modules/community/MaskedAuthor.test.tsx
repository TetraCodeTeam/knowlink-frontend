import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthorHeader from "@/modules/community/components/AuthorHeader";
import ReplyCard from "@/modules/community/components/ReplyCard";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { CommunityAuthor } from "@/modules/community/interfaces/responses/community-author.interface";
import type { CommunityReply } from "@/modules/community/interfaces/responses/community-reply.interface";

const maskedAuthor: CommunityAuthor = {
  userId: "deactivated-1",
  fullName: "Usuario desactivado",
  role: "TUTOR",
  profilePictureUrl: null,
  careerName: null,
  averageRating: null,
  verified: false,
  canBookClass: false,
};

const reply: CommunityReply = {
  replyId: "reply-1",
  postId: "post-1",
  author: maskedAuthor,
  content: "Una respuesta útil",
  attachment: null,
  helpfulCount: 0,
  markedHelpfulByMe: false,
  featured: false,
  bookingCard: { question: "¿Me ayudás con esto?" },
  createdAt: "2026-11-01T10:00:00",
  edited: false,
  ownedByMe: false,
};

function renderReply(author: CommunityAuthor) {
  render(
    <MemoryRouter initialEntries={["/student/home"]}>
      <ReplyCard
        reply={{ ...reply, author }}
        isHelpfulPending={false}
        isSaving={false}
        isEditing={false}
        isEditLocked={false}
        onToggleHelpful={vi.fn()}
        onStartEdit={vi.fn()}
        onCancelEdit={vi.fn()}
        onSaveEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    </MemoryRouter>
  );
}

describe("Autores enmascarados en la comunidad", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: true,
      authResponse: {
        userId: "student-1",
        email: "alumno@test.com",
        fullName: "Alumno Test",
        token: "token",
        role: "STUDENT",
      },
    });
  });

  it("un autor desactivado se renderiza sin link a su perfil", () => {
    render(
      <MemoryRouter initialEntries={["/student/home"]}>
        <AuthorHeader author={maskedAuthor} createdAt="2026-11-01T10:00:00" showRoleLabel />
      </MemoryRouter>
    );

    expect(screen.getByText("Usuario desactivado")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("un autor desactivado no muestra el CTA de reserva aunque tenga tarjeta de vinculación", () => {
    renderReply(maskedAuthor);

    expect(screen.getByText("Usuario desactivado")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Agendar clase/ })).not.toBeInTheDocument();
  });

  it("un tutor activo conserva el CTA de reserva", () => {
    renderReply({
      ...maskedAuthor,
      userId: "tutor-1",
      fullName: "Carlos López",
      canBookClass: true,
    });

    expect(screen.getByRole("button", { name: "Agendar clase con Carlos" })).toBeInTheDocument();
  });
});
