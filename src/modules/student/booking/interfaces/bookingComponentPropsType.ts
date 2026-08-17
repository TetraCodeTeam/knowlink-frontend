import type { ReactElement } from "react";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import type { Modality } from "@/modules/student/booking/interfaces/modalityType";
import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";

export interface AvailabilityBlockContentProps {
  blockStart: Date;
  blockEnd: Date;
  selectedWindow: ReservationWindow | null;
  locked: boolean;
  onHoverWindow: (window: ReservationWindow | null) => void;
  onSelectWindow: (window: ReservationWindow) => void;
}

export interface BookingCalendarProps {
  selectedSlot: BookingSlot | null;
  onSelectSlot: (slot: BookingSlot) => void;
}

export interface BookingCardProps {
  selectedSlot?: BookingSlot | null;
}

export interface BookingSlotSelectionSummaryProps {
  slot: BookingSlot | null;
}

export interface InfoTooltipProps {
  message: string;
  children: ReactElement;
}

export interface ModalityToggleProps {
  value: Modality;
  onChange: (modality: Modality) => void;
  availableModalities: Modality[];
}

export interface PricingRowProps {
  label: string;
  value?: number;
  formatter: Intl.NumberFormat;
  emphasized?: boolean;
}
