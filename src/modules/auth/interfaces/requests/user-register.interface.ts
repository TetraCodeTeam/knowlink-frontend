export interface UserRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: "STUDENT" | "TUTOR";
}