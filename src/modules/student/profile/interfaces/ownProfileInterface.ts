
export type TutorRoleStatus = "ACTIVE" | "NEVER_REGISTERED" | "INACTIVE";
export type StudentRole = "STUDENT" | "TUTOR" ;

export interface StudentSelfProfileResponse {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  career: string;
  profilePictureUrl: string | null;
  role: StudentRole;
  hasTutorProfile: boolean;
}