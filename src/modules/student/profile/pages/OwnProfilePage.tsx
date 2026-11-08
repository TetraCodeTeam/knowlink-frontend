import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PersonalDataCard } from "@/modules/student/profile/components/PersonalDataCard";
import { ProfileHeader } from "@/modules/student/profile/components/ProfileHeader";
import TutorRoleCard from "@/modules/student/dual-role/components/TutorRoleCard";
import { useMyStudentProfile } from "@/modules/student/profile/hooks/useMyStudentProfile";
import AccountManagementSection from "@/modules/users/components/AccountManagementSection";
import { studentPaths } from "@/routes/paths";
import { getPageScaleSx } from "@/shared/utils/page-height.utils";

/** Hace que las tarjetas hijas crezcan para repartirse el alto del contenedor. */
const stretchChildrenSx = { "& > .MuiPaper-root": { flex: 1 } };

export const OwnProfilePage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useMyStudentProfile();

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
      >
        <CircularProgress sx={{ color: "#4C5CB5" }} />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
      >
        <Typography color="error">No se pudo cargar el perfil. Intenta de nuevo.</Typography>
      </Box>
    );
  }

  return (
    <Stack
      spacing={2}
      sx={{ mx: "auto", pr: 4, pl: 4, pt: 2, pb: 2, ...getPageScaleSx() }}
    >
      <ProfileHeader fullName={profile.fullName} profilePictureUrl={profile.profilePictureUrl} />

      {/* En pantallas altas las tarjetas se estiran para ocupar el alto disponible. */}
      <Grid container spacing={2} sx={{ flex: 1, alignItems: "stretch" }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: "flex" }}>
          <Stack spacing={2} sx={{ flex: 1, minWidth: 0, ...stretchChildrenSx }}>
            <PersonalDataCard
              email={profile.email}
              phoneNumber={profile.phoneNumber}
              major={profile.career}
              onEdit={() => navigate(studentPaths.editProfile)}
            />
            <TutorRoleCard
              hasTutorProfile={profile.hasTutorProfile}
              career={profile.career}
              institutionId={profile.institutionId}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AccountManagementSection classesPath={studentPaths.classes} />
        </Grid>
      </Grid>
    </Stack>
  );
};
