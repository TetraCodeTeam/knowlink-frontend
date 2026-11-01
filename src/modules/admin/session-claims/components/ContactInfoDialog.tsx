import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Typography,
} from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import { useClaimContactInfo } from "@/modules/admin/session-claims/hooks/useClaimContactInfo";
import { SESSION_CLAIM_MESSAGES } from "@/modules/admin/session-claims/constants/session-claims.constants";
import {
  contactAvatarSx,
  contactCardSx,
  contactCardsSx,
  contactErrorSx,
  contactFieldLabelSx,
  contactFieldValueSx,
  contactGridSx,
  contactHeaderSx,
  contactLoadingSx,
  contactNameSx,
  contactRoleSx,
  dialogSubtitleSx,
  dialogTextSx,
  dialogTitleSx,
} from "@/modules/admin/session-claims/styles/session-claims.styles";

interface ContactInfoDialogProps {
  claimId: string;
  open: boolean;
  onClose: () => void;
}

interface ContactField {
  label: string;
  value: string;
}

interface ContactCardProps {
  fullName: string;
  roleLabel: string;
  fields: ContactField[];
}

function getInitials(fullName: string): string {
  const [first = "", second = ""] = fullName.trim().split(/\s+/);
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

function ContactCard({ fullName, roleLabel, fields }: ContactCardProps) {
  return (
    <Box sx={contactCardSx}>
      <Box sx={contactHeaderSx}>
        <Box sx={contactAvatarSx} aria-hidden="true">
          {getInitials(fullName)}
        </Box>
        <Box>
          <Typography sx={contactNameSx}>{fullName}</Typography>
          <Typography sx={contactRoleSx}>{roleLabel}</Typography>
        </Box>
      </Box>

      <Box sx={contactGridSx}>
        {fields.map((field) => (
          <Box key={field.label}>
            <Typography sx={contactFieldLabelSx}>{field.label}</Typography>
            <Typography sx={contactFieldValueSx}>{field.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function ContactInfoDialog({ claimId, open, onClose }: ContactInfoDialogProps) {
  const { contact, isLoading, isError, refetch } = useClaimContactInfo(claimId, open);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Typography sx={dialogTitleSx}>Datos de contacto</Typography>
        <Typography sx={dialogSubtitleSx}>Uso confidencial para mediación</Typography>
        <Typography sx={dialogTextSx}>
          Información registrada de las partes involucradas para resolver discrepancias de la
          sesión.
        </Typography>
      </DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Box sx={{ ...contactLoadingSx, mt: 1.5 }} aria-label="Cargando datos de contacto">
            <Skeleton variant="rounded" height={140} />
            <Skeleton variant="rounded" height={140} />
          </Box>
        ) : isError ? (
          <Box role="alert" sx={contactErrorSx}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
              {SESSION_CLAIM_MESSAGES.contactErrorTitle}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {SESSION_CLAIM_MESSAGES.contactErrorText}
            </Typography>
            <AppButton appVariant="dark" onClick={() => void refetch()}>
              Reintentar
            </AppButton>
          </Box>
        ) : contact ? (
          <Box sx={contactCardsSx}>
            <ContactCard
              fullName={contact.tutor.fullName}
              roleLabel="Tutor"
              fields={[
                { label: "Teléfono", value: contact.tutor.phone },
                { label: "Email", value: contact.tutor.email },
                { label: "Institución", value: contact.tutor.institution },
                { label: "Legajo", value: contact.tutor.fileNumber },
              ]}
            />
            <ContactCard
              fullName={contact.student.fullName}
              roleLabel="Alumno"
              fields={[
                { label: "Teléfono", value: contact.student.phone },
                { label: "Email", value: contact.student.email },
                { label: "Identificación / DNI", value: contact.student.nationalId },
              ]}
            />
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <AppButton appVariant="outline" fullWidth onClick={onClose}>
          Cerrar
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
