import { httpClient } from "@/shared/lib/httpClient";
import { TutorSelfProfileResponse } from "../interfaces/TutorSelfProfileResponse";
import { TutorSubjectRequest } from "../interfaces/TutorSubjectRequest";
import { TutorSubjectResponse } from "../interfaces/TutorSubjectResponse";
import type { UpdateTutorSubjectRequest } from "@/modules/tutor/interfaces/UpdateTutorSubjectRequest";

export async function getMyTutorProfile(): Promise<TutorSelfProfileResponse> {
  const response = await httpClient.get<TutorSelfProfileResponse>("/api/v1/tutors/me/profile");
  return response.data;
}

export async function createTutorSubject(
  request: TutorSubjectRequest
): Promise<TutorSubjectResponse> {
  const response = await httpClient.post<TutorSubjectResponse>("/api/v1/tutors/subjects", request);
  return response.data;
}

export async function updateTutorSubject(
  tutorSubjectId: string,
  request: UpdateTutorSubjectRequest
): Promise<TutorSubjectResponse> {
  const response = await httpClient.put<TutorSubjectResponse>(
    `/api/v1/tutors/subjects/${tutorSubjectId}`,
    request
  );
  return response.data;
}
