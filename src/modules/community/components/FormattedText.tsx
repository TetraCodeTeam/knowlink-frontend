import { useMemo } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";
import { parseFormattedText } from "@/modules/community/utils/parse-formatted-text";

interface FormattedTextProps {
  text: string;
  sx?: SxProps<Theme>;
}

const monoSx: SxProps<Theme> = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

const inlineCodeSx: SxProps<Theme> = {
  ...monoSx,
  fontSize: "0.92em",
  bgcolor: "#F0F1F7",
  color: COMMUNITY_COLORS.text,
  px: 0.6,
  py: 0.1,
  borderRadius: "4px",
};

const mathSx: SxProps<Theme> = {
  ...monoSx,
  fontSize: "0.92em",
  fontWeight: 600,
  bgcolor: "#EAEDFF",
  color: "#2A2F9E",
  px: 0.6,
  py: 0.1,
  borderRadius: "4px",
};

const codeBlockSx: SxProps<Theme> = {
  ...monoSx,
  display: "block",
  fontSize: 13.5,
  bgcolor: "#F4F5FB",
  color: COMMUNITY_COLORS.text,
  p: 1.5,
  my: 1,
  borderRadius: "8px",
  overflowX: "auto",
  whiteSpace: "pre",
};

/** Renderiza el texto de la comunidad con su formato liviano, sin interpretar HTML. */
export default function FormattedText({ text, sx }: FormattedTextProps) {
  const segments = useMemo(() => parseFormattedText(text), [text]);

  return (
    <Box
      sx={[
        {
          fontSize: 15,
          lineHeight: 1.6,
          color: "#33334A",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {segments.map((segment, index) => {
        switch (segment.kind) {
          case "bold":
            return (
              <Box component="strong" key={index} sx={{ fontWeight: 700 }}>
                {segment.value}
              </Box>
            );
          case "italic":
            return (
              <Box component="em" key={index}>
                {segment.value}
              </Box>
            );
          case "underline":
            return (
              <Box component="u" key={index}>
                {segment.value}
              </Box>
            );
          case "code":
            return (
              <Box component="code" key={index} sx={inlineCodeSx}>
                {segment.value}
              </Box>
            );
          case "math":
            return (
              <Box component="span" key={index} sx={mathSx} aria-label={`Fórmula ${segment.value}`}>
                {segment.value}
              </Box>
            );
          case "codeBlock":
            return (
              <Box component="code" key={index} sx={codeBlockSx}>
                {segment.value}
              </Box>
            );
          default:
            return segment.value;
        }
      })}
    </Box>
  );
}
