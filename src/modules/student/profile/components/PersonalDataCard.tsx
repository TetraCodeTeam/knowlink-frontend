import { IdCard, Mail, Phone, GraduationCap, Pencil } from "lucide-react";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";

import type { ReactNode } from "react";
import AppButton from "@/shared/components/AppButton";

interface PersonalDataCardProps {
  email: string;
  phoneNumber: string;
  major: string;
  onEdit?: () => void;
}

interface ReadOnlyFieldProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const ReadOnlyField = ({ icon, label, value }: ReadOnlyFieldProps) => (
  <Box>
    <Typography
      variant="subtitle2"
      fontWeight={600}
      color="#636363"
      component="p"
      sx={{ mb: 0.5, fontSize: 12.5 }}
    >
      {label}
    </Typography>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        px: 1.25,
        py: 0.75,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "#E0E0FA",
        bgcolor: "#F4F3FB",
      }}
    >
      <Box sx={{ display: "flex", color: "#636363" }}>{icon}</Box>
      <Typography variant="body2" sx={{ color: "#636363", minWidth: 0, overflowWrap: "anywhere" }}>
        {value}
      </Typography>
    </Stack>
  </Box>
);

export const PersonalDataCard = ({ email, phoneNumber, major, onEdit }: PersonalDataCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        pt: 2,
        pb: 2,
        pr: 2.5,
        pl: 2.5,
        borderRadius: 3,
        height: "100%",
        border: "0.2px solid #e0e0fa",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IdCard size={24} color="#5865C8" />
          <Typography variant="h6" component="h2" fontWeight={500} sx={{ fontSize: 18 }}>
            Datos Personales
          </Typography>
        </Stack>

        {onEdit && (
          <AppButton
            appVariant="outline"
            size="small"
            sx={{ py: 0.75, fontSize: 14 }}
            onClick={onEdit}
            startIcon={<Pencil size={15} />}
          >
            Editar perfil
          </AppButton>
        )}
      </Stack>

      <Grid container spacing={1.75}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ReadOnlyField icon={<Mail size={16} />} label="Correo Electrónico" value={email} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ReadOnlyField icon={<Phone size={16} />} label="Número de Celular" value={phoneNumber} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ReadOnlyField
            icon={<GraduationCap size={16} />}
            label="Carrera Universitaria"
            value={major}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
