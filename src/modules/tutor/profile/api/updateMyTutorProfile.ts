import { httpClient } from "@/shared/lib/httpClient";
import type { TutorOwnProfileResponse } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";
import type { UpdateTutorProfileRequest } from "@/modules/users/interfaces/requests/edit-profile.interface";

export const updateMyTutorProfile = async (
  data: UpdateTutorProfileRequest
): Promise<TutorOwnProfileResponse> => {
  const { data: response } = await httpClient.put<TutorOwnProfileResponse>(
    "/api/v1/tutors/me/profile",
    data
  );
  return response;
};
