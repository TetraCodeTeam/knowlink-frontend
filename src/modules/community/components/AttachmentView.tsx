import { Box, Link as MuiLink, Typography } from "@mui/material";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import type { CommunityAttachment } from "@/modules/community/interfaces/responses/community-attachment.interface";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";
import { formatFileSize } from "@/modules/community/utils/format-file-size";

interface AttachmentViewProps {
  attachment: CommunityAttachment;
}

export default function AttachmentView({ attachment }: AttachmentViewProps) {
  const isImage = attachment.contentType.startsWith("image/");
  const isSpreadsheet = attachment.contentType.includes("spreadsheet");
  const Icon = isSpreadsheet ? FileSpreadsheet : FileText;

  if (isImage && attachment.url) {
    return (
      <Box
        component="a"
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir imagen ${attachment.fileName}`}
        sx={{ display: "block", my: 1.5 }}
      >
        <Box
          component="img"
          src={attachment.url}
          alt={attachment.fileName}
          loading="lazy"
          sx={{
            display: "block",
            maxWidth: "100%",
            maxHeight: 340,
            borderRadius: "10px",
            border: `1px solid ${COMMUNITY_COLORS.border}`,
            objectFit: "contain",
            bgcolor: "#FAFAFD",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        bgcolor: COMMUNITY_COLORS.panel,
        borderRadius: "10px",
        px: 1.75,
        py: 1.25,
        my: 1.5,
      }}
    >
      <Icon size={22} color={COMMUNITY_COLORS.primaryDark} aria-hidden />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, color: COMMUNITY_COLORS.text }}>
          {attachment.fileName}
        </Typography>
        <Typography sx={{ fontSize: 12, color: COMMUNITY_COLORS.subtle }}>
          {formatFileSize(attachment.sizeInBytes)}
        </Typography>
      </Box>
      {attachment.url ? (
        <MuiLink
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: 13,
            fontWeight: 600,
            color: COMMUNITY_COLORS.primaryDark,
          }}
        >
          <Download size={15} aria-hidden />
          Descargar
        </MuiLink>
      ) : (
        <Typography sx={{ fontSize: 12, color: COMMUNITY_COLORS.subtle }}>No disponible</Typography>
      )}
    </Box>
  );
}
