import { TutorSubjectResponse } from "./TutorSubjectResponse";

export interface TutorSelfProfileResponse {
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
  biography: string | null;
  address: string | null;
  mercadoPagoLinked: boolean;
  averageRating: number | null;
  hasStudentProfile: boolean;
  subjects: TutorSubjectResponse[];
}
