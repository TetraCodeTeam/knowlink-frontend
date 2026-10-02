import type { TutorReview } from "../../interfaces/tutor.interface";

export interface SubjectsDialogProps {
  open: boolean;
  onClose: () => void;
  subjects: Array<{
    id: string;
    name: string;
    rating: number;
    reviewsCount: number;
    price: number;
    isFree: boolean;
  }>;
}

export interface ReviewsDialogProps {
  open: boolean;
  onClose: () => void;
  reviews: TutorReview[];
  subjectName: string;
}

export interface ReviewItemProps {
  review: TutorReview;
}
