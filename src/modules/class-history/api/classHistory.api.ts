import { httpClient } from "@/shared/lib/httpClient";
import type { BookingHistoryItem } from "@/modules/class-history/interfaces/responses/booking-history-item.interface";
import type { PagedResponse } from "@/modules/class-history/interfaces/responses/paged-response.interface";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { VirtualSessionLinkRequest } from "@/modules/class-history/interfaces/requests/virtual-session-link.interface";
import type { CancellationPreview } from "@/modules/class-history/interfaces/responses/cancellation-preview.interface";
import type { BookingCancellationResponse } from "@/modules/class-history/interfaces/responses/booking-cancellation-response.interface";

export async function getBookingHistory(params: {
  role: BookingRole;
  category: BookingHistoryCategory;
  page: number;
  size: number;
}): Promise<PagedResponse<BookingHistoryItem>> {
  const response = await httpClient.get<PagedResponse<BookingHistoryItem>>("/api/v1/bookings/mine", {
    params,
  });
  return response.data;
}

export async function getBookingDetail(bookingId: string): Promise<BookingHistoryDetail> {
  const response = await httpClient.get<BookingHistoryDetail>(`/api/v1/bookings/${bookingId}`);
  return response.data;
}

export async function updateVirtualLink(
  bookingId: string,
  data: VirtualSessionLinkRequest
): Promise<BookingHistoryDetail> {
  const response = await httpClient.patch<BookingHistoryDetail>(
    `/api/v1/bookings/${bookingId}/virtual-link`,
    data
  );
  return response.data;
}

export async function getCancellationPreview(bookingId: string): Promise<CancellationPreview> {
  const response = await httpClient.get<CancellationPreview>(
    `/api/v1/bookings/${bookingId}/cancellations/preview`
  );
  return response.data;
}

export async function cancelBooking(bookingId: string): Promise<BookingCancellationResponse> {
  const response = await httpClient.post<BookingCancellationResponse>(
    `/api/v1/bookings/${bookingId}/cancellations`
  );
  return response.data;
}
