import { IdCard, Mail, Phone, Pencil, GraduationCap } from "lucide-react";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";


import { ReactNode } from "react";
import AppButton from "@/shared/components/AppButton";

interface PersonalDataCardProps {
  email: string;
  phoneNumber: string;
  major: string;
  onEditProfile: () => void;
}

interface ReadOnlyFieldProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const ReadOnlyField = ({ icon, label, value }: ReadOnlyFieldProps) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={600} color="#636363" component="p" sx={{ mb: 0.75 }}>
      {label}
    </Typography>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "#E0E0FA",
        bgcolor: "#F4F3FB",
      }}
    >
      <Box sx={{ display: "flex", color: "#636363" }}>{icon}</Box>
      <Typography variant="body1" sx={{ color: "#636363" }}>
        {value}
      </Typography>
    </Stack>
  </Box>
);

export const PersonalDataCard = ({
  email,
  phoneNumber,
  major,
  onEditProfile,
}: PersonalDataCardProps) => {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%", border: "0.2px solid #e0e0fa" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IdCard size={28} color="#5865C8"/>
          <Typography variant="h6" component="h2" fontWeight={500}>
            Datos Personales
          </Typography>
        </Stack>
        {/* <AppButton appVariant="soft" size="small" startIcon={<Pencil size={16} color="#5865C8"/>} onClick={onEditProfile}>
          Editar Perfil
        </AppButton> */}
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ReadOnlyField icon={<Mail size={16} />} label="Correo Electrónico" value={email} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ReadOnlyField icon={<Phone size={16} />} label="Número de Celular" value={phoneNumber} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ReadOnlyField icon={<GraduationCap size={16} />} label="Carrera Universitaria" value={major} />
        </Grid>
      </Grid>
    </Paper>
  );
};