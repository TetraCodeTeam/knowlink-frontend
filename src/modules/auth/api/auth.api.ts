import { rawHttpClient } from "@/shared/lib/http-client";
import type { LoginRequest } from "@/modules/auth/interfaces/requests/login-request.interface";
import type { TutorRegisterRequest } from "@/modules/auth/interfaces/requests/tutor-register.interface";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";
import type { StudentRegisterRequest } from "@/modules/auth/interfaces/requests/student-register.interface";

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await rawHttpClient.post<AuthResponse>("/api/v1/auth/login", data);
  return response.data;
}

export async function registerStudent(data: StudentRegisterRequest): Promise<void> {
  await rawHttpClient.post("/api/v1/auth/register/student", data);
}

export async function registerTutor(data: TutorRegisterRequest): Promise<void> {
  await rawHttpClient.post("/api/v1/auth/register/tutor", data);
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