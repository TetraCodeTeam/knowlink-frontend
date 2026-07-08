import { httpClient } from "@/shared/lib/httpClient";
import type { LoginRequest } from "@/modules/auth/interfaces/requests/login-request.interface";
import type { UserRegisterRequest } from "@/modules/auth/interfaces/requests/user-register.interface";
import type { TutorRegisterRequest } from "@/modules/auth/interfaces/requests/tutor-register.interface";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/api/v1/auth/login", data);
  return response.data;
}

export async function registerUser(data: UserRegisterRequest): Promise<void> {
  await httpClient.post("/api/v1/auth/register", data);
}

export async function registerTutor(data: TutorRegisterRequest): Promise<void> {
  await httpClient.post("/api/v1/auth/register/tutor", data);
}

export async function verifyAccount(userId: string, token: string): Promise<void> {
  await httpClient.post(`/api/v1/users/${userId}/verify-account`, { token });
}

export async function resendConfirmationEmail(email: string): Promise<void> {
  await httpClient.post("/api/v1/users/resend-verification-account", { email });
}