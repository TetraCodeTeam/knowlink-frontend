import { httpClient } from "@/shared/lib/httpClient";
import type { FundsTransfer } from "@/modules/payments/types/funds";

export async function getFundsTransfer(bookingId: string): Promise<FundsTransfer> {
  const response = await httpClient.get<FundsTransfer>("/api/v1/bookings/" + bookingId + "/funds");
  return response.data;
}

export async function retryFundsResolution(bookingId: string): Promise<void> {
  await httpClient.post("/api/v1/admin/bookings/" + bookingId + "/funds/retry");
}