import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";
import { EXCLUDED_BEARER_ROUTES } from "@/shared/lib/constants";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";
import { isTokenExpired } from "@/shared/utils/jwt.utils";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const httpClient = axios.create({ baseURL: BASE_URL });

/**
 * rawHttpClient: no muestra snackbar ni ejecuta logout automático.
 * Usar para llamadas "best-effort" o donde el manejo de errores es manual.
 */
export const rawHttpClient = axios.create({ baseURL: BASE_URL });

// ── Request interceptor (shared logic) ───────────────────────────────────────

function attachToken(config: InternalAxiosRequestConfig) {
  const { authResponse } = useAuthStore.getState();
  if (!authResponse) return config;

  const { token } = authResponse;

  if (isTokenExpired(token)) {
    return Promise.reject(new axios.Cancel("Token expirado"));
  }

  const shouldExclude = EXCLUDED_BEARER_ROUTES.some((path) => {
    const urlWithoutBase = config.url?.split("?")[0];
    return urlWithoutBase === path || urlWithoutBase === `${path}/`;
  });

  if (!shouldExclude && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

httpClient.interceptors.request.use(attachToken);
rawHttpClient.interceptors.request.use(attachToken);

// ── Response interceptor (httpClient only) ───────────────────────────────────

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const data = error.response?.data;
    const errorMessage =
      data?.message ??
      data?.detail ??
      (error.response?.status === 403 || error.response?.status === 401
        ? "No estás autorizado para acceder a este recurso."
        : "Ocurrió un error inesperado.");

    useSnackbarStore.getState().showMessage(errorMessage, "error");

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);
