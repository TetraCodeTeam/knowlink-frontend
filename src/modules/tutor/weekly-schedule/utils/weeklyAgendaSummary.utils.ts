import type { AvailabilityBlockResponse, BookedSessionResponse } from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";
import { isBeforeNowAtTime, resolveDateForDayOfWeek } from "@/shared/utils/calendarDateUtils";

export function countConfirmedBookings(sessions: BookedSessionResponse[]): number {
  return sessions.length;
}

export function countFreeBlocks(blocks: AvailabilityBlockResponse[], weekStart: Date): number {
  return blocks.filter((block) => {
    const blockDate = resolveDateForDayOfWeek(weekStart, block.dayOfWeek);
    return !isBeforeNowAtTime(blockDate, block.endTime);
  }).length;
}