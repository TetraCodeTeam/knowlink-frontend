import { httpClient } from "@/shared/lib/httpClient";
import type { StudentSelfProfileResponse } from "@/modules/student/profile/interfaces/ownProfileInterface";
import type { TutorOwnProfileResponse } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";
import type { Role } from "@/shared/types/role.type";

const ENDPOINTS: Record<Role, string> = {
  STUDENT: "/api/v1/students/me/profile-picture",
  TUTOR: "/api/v1/tutors/me/profile-picture",
};

/** Sube la foto de perfil del usuario autenticado y devuelve su perfil actualizado. */
export async function uploadMyProfilePicture(
  role: Role,
  file: File
): Promise<StudentSelfProfileResponse | TutorOwnProfileResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await httpClient.post<StudentSelfProfileResponse | TutorOwnProfileResponse>(
    ENDPOINTS[role],
    formData
  );
  return response.data;
}
