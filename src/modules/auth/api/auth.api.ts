import { httpClient, rawHttpClient } from "@/shared/lib/httpClient";
import type { LoginRequest } from "@/modules/auth/interfaces/requests/login.interface";
import type { RegisterRequest } from "@/modules/auth/interfaces/requests/register.interface";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await rawHttpClient.post<AuthResponse>("/api/v1/auth/login", data);
  return response.data;
}

export async function registerUser(data: RegisterRequest): Promise<void> {
  await httpClient.post("/api/v1/auth/register", data);
}
