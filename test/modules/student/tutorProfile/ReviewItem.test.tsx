import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewItem } from "@/modules/student/tutorProfile/components/ReviewItem";
import type { TutorReview } from "@/modules/student/tutorProfile/interfaces/tutor.interface";

const maskedReview: TutorReview = {
  id: "review-1",
  studentName: "Usuario desactivado",
  studentAvatarUrl: null,
  subject: "Análisis Matemático I",
  rating: 5,
  comment: "Explica muy claro.",
};

describe("ReviewItem", () => {
  it("usa iniciales cuando el autor enmascarado no tiene avatar", () => {
    render(<ReviewItem review={maskedReview} />);

    expect(screen.getByText("Usuario desactivado")).toBeInTheDocument();
    expect(screen.getByText("UD")).toBeInTheDocument();
  });
});
