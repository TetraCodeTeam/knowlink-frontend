export interface UserResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}
