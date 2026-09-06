export interface SubjectCardProps {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  isFree: boolean;
}

export interface PaymentSectionProps {
  mercadoPagoLinked: boolean;
  onLink: () => void;
  onUnlink: () => void;
}

export interface DataItemProps {
  label: string;
  value: string | null;
}

export interface ModalityChipProps {
  modality: string;
}
