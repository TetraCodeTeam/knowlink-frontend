import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { ShieldCheck, X } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { useStudentMaterialReportingPolicy } from "@/modules/student/support/hooks/useStudentSupportDetailQueries";
import {
  ACCEPTED_FILE_FORMATS,
  FILE_FORMAT_META,
} from "@/modules/support/constants/file-format.constants";
import { FILE_RULES_SECTIONS } from "@/modules/support/constants/file-rules.constants";
import {
  dialogCloseSx,
  dialogHeaderSx,
  dialogPaperSx,
  getFormatChipSx,
  ruleBodySx,
  ruleFormatsSx,
  ruleHighlightSx,
  ruleItemSx,
  ruleSectionSx,
  ruleTitleSx,
} from "@/modules/support/styles/supportFileRulesDialog.styles";
import { getIconBoxSx, TONE_COLORS } from "@/modules/support/styles/supportShared.styles";

interface StudentFileRulesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StudentFileRulesDialog({ open, onClose }: StudentFileRulesDialogProps) {
  const { data: policy, isError } = useStudentMaterialReportingPolicy(open);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="student-file-rules-title"
      slotProps={{ paper: { sx: dialogPaperSx } }}
    >
      <DialogTitle component="div" sx={dialogHeaderSx}>
        <Box sx={getIconBoxSx(TONE_COLORS.info.bg, TONE_COLORS.info.fg)}>
          <ShieldCheck size={18} aria-hidden="true" />
        </Box>
        <Box>
          <Typography
            id="student-file-rules-title"
            component="h2"
            sx={{ fontSize: 15, fontWeight: 600 }}
          >
            Normativa de archivos — KnowLink
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
            Auditoría de Contenidos
          </Typography>
        </Box>
        <IconButton aria-label="Cerrar" size="small" onClick={onClose} sx={dialogCloseSx}>
          <X size={16} aria-hidden="true" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isError && (
          <Typography color="error" sx={{ mb: 2 }}>
            No se pudo actualizar la normativa desde el servidor. Se muestra la información
            disponible.
          </Typography>
        )}
        {FILE_RULES_SECTIONS.map((section) => {
          const SectionIcon = section.icon;
          const body =
            section.id === "allowed-content"
              ? (policy?.permittedContentPolicy ?? section.body)
              : section.id === "review-process"
                ? (policy?.reviewProcess ?? section.body)
                : section.body;

          return (
            <Box
              key={section.id}
              component="section"
              sx={section.highlighted ? { ...ruleSectionSx, ...ruleHighlightSx } : ruleSectionSx}
            >
              <Typography component="h3" sx={ruleTitleSx}>
                <SectionIcon size={14} aria-hidden="true" />
                {section.title}
              </Typography>

              {body ? <Typography sx={ruleBodySx}>{body}</Typography> : null}

              {section.showFormats ? (
                <Box sx={ruleFormatsSx}>
                  {(policy?.acceptedFormats ?? ACCEPTED_FILE_FORMATS)
                    .filter(
                      (format): format is keyof typeof FILE_FORMAT_META =>
                        format in FILE_FORMAT_META
                    )
                    .map((format) => {
                      const { icon: FormatIcon, label, bg, fg } = FILE_FORMAT_META[format];

                      return (
                        <Box key={format} component="span" sx={getFormatChipSx(bg, fg)}>
                          <FormatIcon size={11} aria-hidden="true" />
                          {label}
                        </Box>
                      );
                    })}
                </Box>
              ) : null}

              {section.id === "report-reasons" &&
                policy?.reportReasons.map((reason) => (
                  <Typography key={reason.code} sx={ruleBodySx}>
                    <Box component="strong" sx={{ color: "text.primary" }}>
                      {reason.label}:
                    </Box>{" "}
                    {reason.description}
                  </Typography>
                ))}

              {section.items?.map((item) => {
                const ItemIcon = item.icon;
                const itemText = policy
                  ? item.id === "infraction-confirmed"
                    ? policy.upheldOutcome
                    : item.id === "dismissed"
                      ? policy.dismissedOutcome
                      : policy.reporterNotification
                  : item.text;

                return (
                  <Box key={item.id} sx={ruleItemSx}>
                    <ItemIcon size={14} color={item.iconColor} aria-hidden="true" />
                    <Typography sx={ruleBodySx}>
                      <Box component="strong" sx={{ color: "text.primary" }}>
                        {item.title}:
                      </Box>{" "}
                      {itemText}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", py: 2 }}>
        <AppButton onClick={onClose}>Entendido, cerrar</AppButton>
      </DialogActions>
    </Dialog>
  );
}
