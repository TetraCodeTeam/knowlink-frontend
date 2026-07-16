export interface StudentRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dni: string;
  phoneNumber: string;
  career: string;
  institutionalId?: string;
  profilePictureUrl?: string;
}