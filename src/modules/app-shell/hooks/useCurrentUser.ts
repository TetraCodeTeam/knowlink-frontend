import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useMyStudentProfile } from "@/modules/student/profile/hooks/useMyStudentProfile";
import { useMyTutorProfile } from "@/modules/tutor/profile/hooks/useMyTutorProfile";
import type { AuthRole } from "@/shared/types/role.type";

export interface CurrentUser {
  role: AuthRole | undefined;
  displayName: string;
  email: string;
  pictureUrl: string | null;
  /** `undefined` mientras se carga el perfil: aún no se sabe si tiene el otro rol. */
  hasOtherRole: boolean | undefined;
}

/** Datos del usuario para el topbar. El perfil solo se pide para alumno y tutor. */
export function useCurrentUser(): CurrentUser {
  const authResponse = useAuthStore((state) => state.authResponse);
  const role = authResponse?.role;
  const { data: studentProfile } = useMyStudentProfile(role === "STUDENT");
  const { data: tutorProfile } = useMyTutorProfile(role === "TUTOR");

  const profile = role === "STUDENT" ? studentProfile : role === "TUTOR" ? tutorProfile : undefined;
  const email = authResponse?.email ?? "";
  const hasOtherRole =
    role === "STUDENT"
      ? studentProfile?.hasTutorProfile
      : role === "TUTOR"
        ? tutorProfile?.hasStudentProfile
        : undefined;

  return {
    role,
    displayName: profile?.fullName || authResponse?.fullName || email.split("@")[0] || "Usuario",
    email,
    pictureUrl: profile?.profilePictureUrl ?? null,
    hasOtherRole,
  };
}
