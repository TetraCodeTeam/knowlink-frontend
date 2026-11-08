import axios from "axios";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";
import { RATING_REQUIRED_CODE } from "@/modules/class-history/constants/ratingGate.constants";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function isRatingRequiredError(error: unknown): boolean {
  return (
    axios.isAxiosError<ErrorResponse>(error) &&
    error.response?.status === 423 &&
    error.response.data?.detail === RATING_REQUIRED_CODE
  );
}
