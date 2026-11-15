export interface StudentRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dni: string;
  phoneNumber: string;
  institutionId: string;
  career: string;
  institutionalId?: string;
  /** Foto elegida en el formulario. Se envía como parte "file" del multipart de registro. */
  profilePictureFile?: File;
}
