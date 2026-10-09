import { useQuery } from "@tanstack/react-query";
import {
  getTutorRatingHistory,
  mapRatingComments,
} from "@/modules/student/tutorProfile/api/getTutorProfile";

interface UseTutorRatingHistoryParams {
  subjectId?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export const useTutorRatingHistory = (
  tutorId: string,
  { subjectId, page = 0, size = 10, enabled = true }: UseTutorRatingHistoryParams = {}
) => {
  return useQuery({
    queryKey: ["tutorRatingHistory", tutorId, subjectId ?? null, page, size],
    queryFn: async () => {
      const history = await getTutorRatingHistory(tutorId, { subjectId, page, size });
      return {
        ...history,
        comments: {
          ...history.comments,
          content: mapRatingComments(history.comments.content),
        },
      };
    },
    enabled: Boolean(tutorId) && enabled,
  });
};
