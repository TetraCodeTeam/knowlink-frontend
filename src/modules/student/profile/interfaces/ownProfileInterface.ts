export type TutorRoleStatus = "ACTIVE" | "NEVER_REGISTERED" | "INACTIVE";
export type StudentRole = "STUDENT" | "TUTOR";

export interface StudentSelfProfileResponse {
  userId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  careerId: string;
  career: string;
  institutionId: string;
  institution: string;
  dni: string | null;
  institutionalId: string | null;
  profilePictureUrl: string | null;
  role: StudentRole;
  hasTutorProfile: boolean;
}
