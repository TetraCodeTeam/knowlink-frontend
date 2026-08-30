export interface LoginRequest {
  email: string;
  password: string;
  targetRole?: "TUTOR" | "STUDENT";
}
