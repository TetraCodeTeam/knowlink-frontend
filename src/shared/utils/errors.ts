import axios from "axios";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}