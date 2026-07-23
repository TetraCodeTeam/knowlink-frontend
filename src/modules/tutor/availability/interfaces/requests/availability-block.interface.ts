export interface AvailabilityBlockRequest {
  date: string; // "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  repeatWeekly: boolean;
}