import { TutorSubjectResponse } from "./TutorSubjectResponse";

export interface TutorSelfProfileResponse {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  career: string;
  profilePictureUrl: string | null;
  biography: string | null;
  address: string | null;
  mercadoPagoLinked: boolean;
  averageRating: number | null;
  subjects: TutorSubjectResponse[];
}