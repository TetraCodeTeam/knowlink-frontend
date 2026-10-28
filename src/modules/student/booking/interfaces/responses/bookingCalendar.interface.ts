export interface BookingSlotApiResponse {
  id: string;
  start: string;
  end: string;
  status: "AVAILABLE" | "BLOCKED" | "RESERVED";
  unavailableWindows: { start: string; end: string; status: "BLOCKED" | "RESERVED" }[];
}

export interface BookingCalendarApiResponse {
  minimumNoticeMinutes: number | null;
  slots: BookingSlotApiResponse[];
}