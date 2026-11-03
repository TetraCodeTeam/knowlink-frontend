export const studentPaths = {
  bookingWithTutor: (tutorId: string) => `/student/tutor/${tutorId}/booking`,
  profile: "/student/profile",
  editProfile: "/student/profile/edit",
  classes: "/student/classes",
};

export const tutorPaths = {
  profile: "/tutor/profile",
  editProfile: "/tutor/profile/edit",
  classes: "/tutor/classes",
};

export const adminPaths = {
  home: "/admin/home",
  materialReports: "/admin/material-reports",
  sessionClaims: "/admin/session-claims",
};
