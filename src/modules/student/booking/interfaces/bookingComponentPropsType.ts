import type { ReactElement } from "react";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import type { Modality } from "@/modules/student/booking/constants/modality.constants";
import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";
import type { BookingFormValues } from "@/modules/student/booking/schemas/booking.schema";
import type { MockBookingSlotEvent } from "@/modules/student/booking/interfaces/mockBookingSlotEventType";

export interface AvailabilityBlockContentProps {
  blockStart: Date;
  blockEnd: Date;
  selectedWindow: ReservationWindow | null;
  unavailableWindows: ReservationWindow[];
  locked: boolean;
  onHoverWindow: (window: ReservationWindow | null) => void;
  onSelectWindow: (window: ReservationWindow) => void;
}

export interface BookingCalendarProps {
  selectedSlot: BookingSlot | null;
  bookingSlots?: MockBookingSlotEvent[];
  onSelectSlot: (slot: BookingSlot) => void;
}

export interface BookingCardProps {
  selectedSlot?: BookingSlot | null;
  onReserveBooking?: (slot: BookingSlot, data: BookingFormValues) => Promise<void>;
  onReleaseBooking?: (slot: BookingSlot) => Promise<void>;
  onCancelSelectedSlot?: () => void;
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
  value?: number | string;
  formatter: Intl.NumberFormat;
  emphasized?: boolean;
  valueColor?: string;
}
