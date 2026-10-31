import { httpClient } from "@/shared/lib/httpClient";
import type {
  WeeklyAgendaResponse,
  WeeklyAgendaSummary,
} from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";
import type {
  BackendWeeklyScheduleResponse,
  BackendWeeklyScheduleSummary,
} from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda-backend.interface";
import { dayOfWeekFromDate } from "@/shared/utils/calendarDateUtils";

function mapSummary(summary: BackendWeeklyScheduleSummary): WeeklyAgendaSummary {
  return {
    confirmedBookingsCount: summary.confirmedBookingsCount,
    freeBlocksCount: summary.freeBlocksCount,
    nextClass: summary.nextClass
      ? {
          bookingId: summary.nextClass.bookingId,
          date: summary.nextClass.sessionDate,
          startTime: summary.nextClass.startTime,
          endTime: summary.nextClass.endTime,
        }
      : null,
  };
}

export async function getWeeklyAgenda(from: string, to: string): Promise<WeeklyAgendaResponse> {
  const response = await httpClient.get<BackendWeeklyScheduleResponse>(
    "/api/v1/tutors/me/weekly-schedule",
    { params: { from, to } }
  );

  return {
    weekStart: response.data.from,
    availabilityBlocks: response.data.availabilityBlocks.map((block) => ({
      id: block.availabilityBlockId,
      dayOfWeek: dayOfWeekFromDate(block.date),
      startTime: block.startTime,
      endTime: block.endTime,
    })),
    bookedSessions: response.data.bookings.map((booking) => ({
      id: booking.bookingId,
      subjectName: booking.tutorSubjectName,
      studentName: booking.studentFullName,
      date: booking.sessionDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      modality: booking.modality,
    })),
    summary: mapSummary(response.data.summary),
  };
}
