import { getCurrentWeekMonday } from "@/shared/utils/calendarDateUtils";
import type { MockBookingSlotEvent } from "@/modules/student/booking/interfaces/mockBookingSlotEventType";
import type { SlotStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";


function isoAt(monday: Date, dayOffset: number, time: string): string {
  const date = new Date(monday);
  date.setDate(monday.getDate() + dayOffset);
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

const WEEKLY_PATTERN: Array<{
  slotKey: string;
  dayOffset: number;
  start: string;
  end: string;
  status: SlotStatus;
}> = [
  { slotKey: "a", dayOffset: 0, start: "09:00", end: "10:00", status: "AVAILABLE" },
  { slotKey: "b", dayOffset: 1, start: "10:00", end: "12:00", status: "AVAILABLE" },
  { slotKey: "c", dayOffset: 2, start: "10:30", end: "12:00", status: "AVAILABLE" },
  { slotKey: "d", dayOffset: 1, start: "16:00", end: "17:00", status: "BLOCKED" },
  { slotKey: "e", dayOffset: 3, start: "15:00", end: "16:30", status: "AVAILABLE" },
  { slotKey: "f", dayOffset: 4, start: "14:00", end: "17:30", status: "AVAILABLE" },
  { slotKey: "g", dayOffset: 4, start: "18:00", end: "19:30", status: "RESERVED" },
];

export function generateMockBookingSlots(weeksBefore = 1, weeksAfter = 3): MockBookingSlotEvent[] {
  const currentMonday = getCurrentWeekMonday();
  const slots: MockBookingSlotEvent[] = [];
  for (let weekOffset = -weeksBefore; weekOffset <= weeksAfter; weekOffset++) {
    const monday = new Date(currentMonday);
    monday.setDate(currentMonday.getDate() + weekOffset * 7);
    for (const item of WEEKLY_PATTERN) {
      slots.push({
        id: `slot-w${weekOffset}-${item.slotKey}`,
        start: isoAt(monday, item.dayOffset, item.start),
        end: isoAt(monday, item.dayOffset, item.end),
        status: item.status,
      });
    }
  }
  return slots;
}

export const MOCK_BOOKING_SLOTS: MockBookingSlotEvent[] = generateMockBookingSlots();
