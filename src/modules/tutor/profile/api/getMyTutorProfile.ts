import { httpClient } from "@/shared/lib/httpClient";
import type { TutorOwnProfileResponse } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";

export const getMyTutorProfile = async (): Promise<TutorOwnProfileResponse> => {
  const { data } = await httpClient.get<TutorOwnProfileResponse>("/api/v1/tutors/me/profile");
  return data;
};

export const uploadTutorProfilePicture = async (file: File): Promise<TutorOwnProfileResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await httpClient.post<TutorOwnProfileResponse>(
    "/api/v1/tutors/me/profile-picture",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};
