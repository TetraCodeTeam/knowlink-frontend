export interface SubjectRateItemProps {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  isFree: boolean;
}

export interface SubjectFilterBarProps {
  subjects: Array<{ id: string; name: string }>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export interface AddSubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
