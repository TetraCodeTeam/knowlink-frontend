export interface UpdateStudentProfileRequest {
  firstName: string;
  lastName: string;
  dni: string;
  phoneNumber: string;
  career: string;
  institutionalId?: string;
}

export interface UpdateTutorProfileRequest extends UpdateStudentProfileRequest {
  biography?: string;
  address?: string;
}
