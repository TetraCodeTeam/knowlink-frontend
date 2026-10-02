import type { TutorProfile } from "../../interfaces/tutor.interface";

export interface TutorSubjectsCardProps {
  subjects: TutorProfile["subjectRates"];
}

export interface TutorReviewsCardProps {
  reviews: TutorProfile["reviews"];
  totalCount: number;
}

export interface TutorProfileHeaderProps {
  tutor: TutorProfile;
  onBook: () => void;
}

export interface TutorMaterialCardProps {
  material: TutorProfile["material"];
  hasConfirmedBooking: boolean;
}

export interface TutorAboutCardProps {
  about: string;
}

export interface TutorAvailabilityCardProps {
  onViewAvailability: () => void;
}
