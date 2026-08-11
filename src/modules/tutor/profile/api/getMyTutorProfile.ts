import { httpClient } from "@/shared/lib/httpClient";
import type { TutorOwnProfileResponse } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";

export const getMyTutorProfile = async (): Promise<TutorOwnProfileResponse> => {
  const { data } = await httpClient.get<TutorOwnProfileResponse>("/api/v1/tutors/me/profile");
  return data;
};
