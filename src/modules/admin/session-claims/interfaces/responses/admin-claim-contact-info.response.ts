export interface AdminTutorContactInfo {
  fullName: string;
  phone: string;
  email: string;
  institution: string;
  fileNumber: string;
}

export interface AdminStudentContactInfo {
  fullName: string;
  phone: string;
  email: string;
  nationalId: string;
}

export interface AdminClaimContactInfoResponse {
  tutor: AdminTutorContactInfo;
  student: AdminStudentContactInfo;
}
