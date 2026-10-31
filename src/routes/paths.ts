export const studentPaths = {
  bookingWithTutor: (tutorId: string) => `/student/tutor/${tutorId}/booking`,
  profile: "/student/profile",
  editProfile: "/student/profile/edit",
};

export const adminPaths = {
  home: "/admin/home",
  materialReports: "/admin/material-reports",
  sessionClaims: "/admin/session-claims",
};