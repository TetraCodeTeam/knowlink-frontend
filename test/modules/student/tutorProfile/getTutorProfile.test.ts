import { describe, expect, it } from "vitest";

import { mapRatingComments } from "@/modules/student/tutorProfile/api/getTutorProfile";
import type { RatingCommentApiResponse } from "@/modules/student/tutorProfile/interfaces/responses/tutor-api.types";

const baseComment: RatingCommentApiResponse = {
  id: "rating-1",
  subjectId: "subject-1",
  subjectName: "Analisis Matematico I",
  author: {
    userId: "student-1",
    fullName: "Maria Lopez",
    profilePictureUrl: "https://cdn.test/avatar.png",
  },
  score: 5,
  comment: "Explica muy claro.",
  ratingDate: "2026-10-01T12:00:00",
};

describe("mapRatingComments", () => {
  it("usa el nombre y avatar reales del autor de la calificacion", () => {
    const [review] = mapRatingComments([baseComment]);

    expect(review.studentName).toBe("Maria Lopez");
    expect(review.studentAvatarUrl).toBe("https://cdn.test/avatar.png");
    expect(review.subject).toBe("Analisis Matematico I");
    expect(review.subjectId).toBe("subject-1");
    expect(review.rating).toBe(5);
    expect(review.comment).toBe("Explica muy claro.");
  });

  it("deja el avatar en null cuando el autor no tiene foto", () => {
    const [review] = mapRatingComments([
      {
        ...baseComment,
        author: { ...baseComment.author, profilePictureUrl: null },
      },
    ]);

    expect(review.studentName).toBe("Maria Lopez");
    expect(review.studentAvatarUrl).toBeNull();
  });
});
