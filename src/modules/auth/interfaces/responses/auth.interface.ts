export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string | null;
  token: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
}