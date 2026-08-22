import { Grid, Stack } from "@mui/material";

import { AccountManagementCard } from "@/modules/student/profile/components/AccountManagementCard";
import { PersonalDataCard } from "@/modules/student/profile/components/PersonalDataCard";
import { ProfileHeader } from "@/modules/student/profile/components/ProfileHeader";
import { RoleCard as TutorRoleCard } from "@/shared/components/RoleCard";
import type { OwnProfileResponse } from "@/modules/student/profile/interfaces/ownProfileInterface";


const MOCK_PROFILE: OwnProfileResponse = {
  fullName: "Agustina Pereyra",
  email: "aguspereyra@gmail.com",
  phoneNumber: "+54 9 351 4346876",
  university: "Universidad Nacional de Córdoba",
  major: "Ingeniería en Sistemas de Información",
  profilePictureUrl: null,
  tutorRoleStatus: "ACTIVE",
};

export const OwnProfilePage = () => {
  const profile = MOCK_PROFILE;

  
  // TODO: el comportamiento real depende de tutorRoleStatus:
  // - ACTIVE: navigate a la interfaz de tutor.
  // - INACTIVE: mutación de reactivación, luego navigate.
  // - NEVER_REGISTERED: navigate al flujo de registro de tutor.
  const handleAccessTutorMode = () => {
    console.log(`Acción de rol de tutor para estado: ${profile.tutorRoleStatus}`);
  };

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
                    major={profile.major}
                    onEditProfile={() => console.log("Navegar a edición de perfil")}
                />
                <TutorRoleCard
                    status={profile.tutorRoleStatus}
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