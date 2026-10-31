import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
};

describe("SubjectCard", () => {
  it("no muestra el botón de editar cuando no recibe onEdit", () => {
    render(<SubjectCard subject={subject} />);

    expect(screen.queryByRole("button", { name: "Editar materia Física 1" })).toBeNull();
  });

  it("muestra el botón de editar y notifica la materia elegida", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<SubjectCard subject={subject} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Editar materia Física 1" }));

    expect(onEdit).toHaveBeenCalledWith(subject);
  });
});
