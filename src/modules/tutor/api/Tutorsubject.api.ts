import { httpClient } from "@/shared/lib/http-client";
import { TutorSelfProfileResponse } from "../interfaces/TutorSelfProfileResponse";
import { TutorSubjectRequest } from "../interfaces/TutorSubjectRequest";
import { TutorSubjectResponse } from "../interfaces/TutorSubjectResponse";

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