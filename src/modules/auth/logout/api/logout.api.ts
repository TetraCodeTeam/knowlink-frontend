import { rawHttpClient } from "@/shared/lib/httpClient";

export async function logoutUser(): Promise<void> {
  await rawHttpClient.post("/api/v1/auth/logout");
}