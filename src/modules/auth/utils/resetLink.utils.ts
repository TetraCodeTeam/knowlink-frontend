import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";
import { RESET_LINK_INVALID_CODE } from "@/modules/auth/constants";

/** El backend responde 422 con detail RESET_LINK_INVALID si el enlace fue usado, venció o no existe. */
export function isInvalidResetLinkError(error: unknown): boolean {
  const axiosError = error as AxiosError<ErrorResponse> | null | undefined;
  return (
    axiosError?.response?.status === 422 &&
    axiosError.response.data?.detail === RESET_LINK_INVALID_CODE
  );
}
