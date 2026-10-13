import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { ShieldCheck, X } from "lucide-react";
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
  getIconBoxSx,
  ruleBodySx,
  ruleFormatsSx,
  ruleHighlightSx,
  ruleItemSx,
  ruleSectionSx,
  ruleTitleSx,
  TONE_COLORS,
} from "@/modules/support/styles/support.styles";

interface FileRulesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function FileRulesDialog({ open, onClose }: FileRulesDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="file-rules-title"
      slotProps={{ paper: { sx: dialogPaperSx } }}
    >
      <DialogTitle component="div" sx={dialogHeaderSx}>
        <Box sx={getIconBoxSx(TONE_COLORS.info.bg, TONE_COLORS.info.fg)}>
          <ShieldCheck size={18} aria-hidden="true" />
        </Box>
        <Box>
          <Typography id="file-rules-title" component="h2" sx={{ fontSize: 15, fontWeight: 600 }}>
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
        {FILE_RULES_SECTIONS.map((section) => {
          const SectionIcon = section.icon;

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

              {section.body ? <Typography sx={ruleBodySx}>{section.body}</Typography> : null}

              {section.showFormats ? (
                <Box sx={ruleFormatsSx}>
                  {ACCEPTED_FILE_FORMATS.map((format) => {
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

              {section.items?.map((item) => {
                const ItemIcon = item.icon;

                return (
                  <Box key={item.id} sx={ruleItemSx}>
                    <ItemIcon size={14} color={item.iconColor} aria-hidden="true" />
                    <Typography sx={ruleBodySx}>
                      <Box component="strong" sx={{ color: "text.primary" }}>
                        {item.title}:
                      </Box>{" "}
                      {item.text}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", py: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Entendido, cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
