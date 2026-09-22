export interface SelectableSlot {
  id: string;
  startIso: string;
  endIso: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
}

export interface BookingSlot extends SelectableSlot {
  expiresAt: string;
}