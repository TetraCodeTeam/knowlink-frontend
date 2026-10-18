import { Alert, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import type { DuplicatedSubjectAlertProps } from "@/modules/catalog/components/interfaces/catalog-components.interface";

export default function DuplicatedSubjectAlert({
  message,
  subjectName,
  onEditAssociations,
  onClose,
}: DuplicatedSubjectAlertProps) {
  return (
    <Alert severity="warning" onClose={onClose} sx={{ mb: 2 }}>
      <Typography variant="body2" mb={1}>
        {message}
      </Typography>
      <AppButton appVariant="outline" type="button" onClick={onEditAssociations}>
        Editar asociaciones de {subjectName}
      </AppButton>
    </Alert>
  );
}