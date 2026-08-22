import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";

import { AccountManagementCard } from "@/modules/student/profile/components/AccountManagementCard";
import { PersonalDataCard } from "@/modules/student/profile/components/PersonalDataCard";
import { ProfileHeader } from "@/modules/student/profile/components/ProfileHeader";
import { RoleCard as TutorRoleCard } from "@/shared/components/RoleCard";
import { useMyStudentProfile } from "@/modules/student/profile/hooks/useMyStudentProfile";


export const OwnProfilePage = () => {
  const { data: profile, isLoading, isError } = useMyStudentProfile();

  
  const handleAccessTutorMode = () => {
    if (!profile) return;

    console.log(`Acción de rol de tutor para usuario: ${profile.userId}`);
  };

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

  const tutorRoleStatus = profile.hasTutorProfile ? "ACTIVE" : "NEVER_REGISTERED";

  return (
    <Stack spacing={3} sx={{ mx: "auto", pr:5, pl:5, pt:3, pb:3 }}>
      <ProfileHeader
        fullName={profile.fullName}
        profilePictureUrl={profile.profilePictureUrl}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs:12, md:8}}>
             <Stack spacing={3}>
                <PersonalDataCard
                    email={profile.email}
                    phoneNumber={profile.phoneNumber}
                    major={profile.career}
                    onEditProfile={() => console.log("Navegar a edición de perfil")}
                />
                <TutorRoleCard
                    status={tutorRoleStatus}
                    onAccessTutorMode={handleAccessTutorMode}
                />
            </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AccountManagementCard
            onDeactivateAccount={() => console.log("Abrir confirmación de desactivación de cuenta")}
            onDeleteAccount={() => console.log("Abrir confirmación de eliminación de cuenta")}
          />
        </Grid>
      </Grid>

      
    </Stack>
  );
};