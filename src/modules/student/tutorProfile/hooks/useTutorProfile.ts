import { useQuery } from "@tanstack/react-query";
import {
  checkTutorMaterialAccess,
  getAccessibleTutorMaterials,
  getTutorProfile,
  getTutorRatingHistory,
  mapRatingComments,
  mapTutorMaterials,
} from "@/modules/student/tutorProfile/api/getTutorProfile";

const REVIEWS_PREVIEW_SIZE = 10;

const DIACRITICS_PATTERN = new RegExp("[̀-ͯ]", "g");

const normalizeSubjectName = (name: string) =>
  name
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const useTutorProfile = (tutorId: string) => {
  return useQuery({
    queryKey: ["tutorProfile", tutorId],
    queryFn: async () => {
      const [profile, hasConfirmedBooking, ratingHistory] = await Promise.all([
        getTutorProfile(tutorId),
        checkTutorMaterialAccess(tutorId),
        getTutorRatingHistory(tutorId, { page: 0, size: REVIEWS_PREVIEW_SIZE }),
      ]);
      const materials = hasConfirmedBooking
        ? mapTutorMaterials(await getAccessibleTutorMaterials(tutorId))
        : [];

      const ratingsBySubjectName = new Map(
        ratingHistory.subjects.map((subject) => [normalizeSubjectName(subject.name), subject])
      );

      const subjectRates = profile.subjectRates.map((subject) => {
        const match = ratingsBySubjectName.get(normalizeSubjectName(subject.name));
        if (!match) {
          return {
            ...subject,
            subjectId: undefined,
            rating: 0,
            reviewsCount: 0,
          };
        }

        return {
          ...subject,
          subjectId: match.subjectId,
          rating: match.average ?? 0,
          reviewsCount: match.count,
        };
      });

      return {
        ...profile,
        subjectRates,
        reviews: mapRatingComments(ratingHistory.comments.content),
        reviewsCount: ratingHistory.totalRatings,
        reviewsTotalElements: ratingHistory.comments.totalElements,
        rating: ratingHistory.averageRating ?? 0,
        hasRatings: ratingHistory.averageRating !== null,
        material: materials,
        hasConfirmedBooking,
      };
    },
    enabled: Boolean(tutorId),
  });
};
