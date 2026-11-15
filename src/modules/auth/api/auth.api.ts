import { rawHttpClient } from "@/shared/lib/httpClient";
import type { LoginRequest } from "@/modules/auth/interfaces/requests/login-request.interface";
import type { ReactivateRequest } from "@/modules/auth/interfaces/requests/reactivate-request.interface";
import type { TutorRegisterRequest } from "@/modules/auth/interfaces/requests/tutor-register.interface";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";
import type { StudentRegisterRequest } from "@/modules/auth/interfaces/requests/student-register.interface";
import type { ResetPasswordRequest } from "@/modules/auth/interfaces/requests/reset-password-request.interface";

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await rawHttpClient.post<AuthResponse>("/api/v1/auth/login", data);
  return response.data;
}

export async function reactivateAccount(data: ReactivateRequest): Promise<AuthResponse> {
  const response = await rawHttpClient.post<AuthResponse>("/api/v1/auth/reactivate", data);
  return response.data;
}

export async function registerStudent(data: StudentRegisterRequest): Promise<void> {
  await rawHttpClient.post("/api/v1/auth/register/student", buildRegistrationForm(data));
}

export async function registerTutor(data: TutorRegisterRequest): Promise<void> {
  await rawHttpClient.post("/api/v1/auth/register/tutor", buildRegistrationForm(data));
}

/**
 * El registro es multipart: los datos viajan en la parte "data" (JSON) y la foto de
 * perfil, si la hay, en la parte "file". La URL blob del preview nunca se envía.
 */
function buildRegistrationForm(data: StudentRegisterRequest | TutorRegisterRequest): FormData {
  const { profilePictureFile, ...payload } = data;

  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  if (profilePictureFile) {
    formData.append("file", profilePictureFile);
  }
  return formData;
}

export async function checkAvailability(params: { email?: string; dni?: string }): Promise<void> {
  await rawHttpClient.get("/api/v1/users/availability", { params });
}

export async function verifyAccount(userId: string, token: string): Promise<void> {
  await rawHttpClient.post(`/api/v1/users/${userId}/verify-account`, { token });
}

export async function resendConfirmationEmail(email: string): Promise<void> {
  await rawHttpClient.post("/api/v1/users/resend-verification-account", { email });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await rawHttpClient.post("/api/v1/users/reset-password/email", { email });
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await rawHttpClient.post("/api/v1/users/reset-password", data);
}
