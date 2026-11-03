import { httpClient, rawHttpClient } from "@/shared/lib/httpClient";
import type { UserResponse } from "@/modules/users/interfaces/responses/user.interface";
import type { UpdateUserRequest } from "@/modules/users/interfaces/requests/update-user.interface";

export async function getUserById(userId: string): Promise<UserResponse> {
  const response = await httpClient.get<UserResponse>(`/api/v1/users/${userId}`);
  return response.data;
}

export async function updateUser(userId: string, data: UpdateUserRequest): Promise<UserResponse> {
  const response = await httpClient.put<UserResponse>(`/api/v1/users/${userId}`, data);
  return response.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await httpClient.delete(`/api/v1/users/${userId}`);
}

export async function deactivateMyAccount(): Promise<void> {
  await rawHttpClient.patch("/api/v1/users/me/deactivate");
}

export async function deleteMyAccount(password: string): Promise<void> {
  await rawHttpClient.post("/api/v1/users/me/delete-account", { password });
}
