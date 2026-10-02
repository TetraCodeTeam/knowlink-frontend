import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { PersonalDataCard } from "@/modules/student/profile/components/PersonalDataCard";
import { ProfileHeader } from "@/modules/student/profile/components/ProfileHeader";
import TutorRoleCard from "@/modules/student/dual-role/components/TutorRoleCard";
import { useMyStudentProfile } from "@/modules/student/profile/hooks/useMyStudentProfile";
import { useUploadStudentProfilePicture } from "@/modules/student/profile/hooks/useUploadStudentProfilePicture";


export const OwnProfilePage = () => {
  const { data: profile, isLoading, isError } = useMyStudentProfile();
  const uploadMutation = useUploadStudentProfilePicture();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#4C5CB5" }} />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Typography color="error">No se pudo cargar el perfil. Intenta de nuevo.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ mx: "auto", pr:5, pl:5, pt:3, pb:3 }}>
      <ProfileHeader
        fullName={profile.fullName}
        profilePictureUrl={profile.profilePictureUrl}
        onPictureChange={(file) => uploadMutation.mutate(file)}
        isUploading={uploadMutation.isPending}
      />

             <Stack spacing={3}>
                <PersonalDataCard
                    email={profile.email}
                    phoneNumber={profile.phoneNumber}
                    major={profile.career}
                    onEditProfile={() => {}}
                />
                <TutorRoleCard
                    hasTutorProfile={profile.hasTutorProfile}
                    career={profile.career}
                />
            </Stack>
    </Stack>
  );
};