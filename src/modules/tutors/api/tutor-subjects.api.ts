import { rawHttpClient } from "@/shared/lib/httpClient";
import type { TutorSubjectResponse } from "@/modules/tutor/interfaces/TutorSubjectResponse";

export async function deactivateTutorSubject(
  tutorSubjectId: string
): Promise<TutorSubjectResponse> {
  const response = await rawHttpClient.patch<TutorSubjectResponse>(
    `/api/v1/tutors/subjects/${tutorSubjectId}/deactivate`
  );
  return response.data;
}

export async function reactivateTutorSubject(
  tutorSubjectId: string
): Promise<TutorSubjectResponse> {
  const response = await rawHttpClient.patch<TutorSubjectResponse>(
    `/api/v1/tutors/subjects/${tutorSubjectId}/reactivate`
  );
  return response.data;
}
