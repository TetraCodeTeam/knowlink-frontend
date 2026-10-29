import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Trophy, X } from "lucide-react";
import { useMyPodiumPosition } from "@/modules/community/hooks/useMyPodiumPosition";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";

interface MyPositionDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function MyPositionDialog({ open, onClose }: MyPositionDialogProps) {
  const { position, isLoading, isError } = useMyPodiumPosition(open);

  const renderBody = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} aria-label="Consultando tu posición" />
        </Box>
      );
    }
    if (isError || !position) {
      return (
        <Typography sx={{ color: COMMUNITY_COLORS.muted, textAlign: "center", py: 3 }}>
          No pudimos consultar tu posición. Intentá nuevamente en unos minutos.
        </Typography>
      );
    }
    if (!position.eligible) {
      return (
        <Typography sx={{ color: COMMUNITY_COLORS.muted, textAlign: "center", py: 3 }}>
          Solo los tutores con rol activo participan del ranking. Activá tu rol de tutor para
          aparecer en el podio.
        </Typography>
      );
    }
    if (position.position == null) {
      return (
        <Typography sx={{ color: COMMUNITY_COLORS.muted, textAlign: "center", py: 3 }}>
          Todavía no sumás puntaje en el ranking de este mes. Respondé consultas de la comunidad y
          dictá clases para escalar posiciones.
        </Typography>
      );
    }

    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.25, py: 1 }}
      >
        <Box
          sx={{
            textAlign: "center",
            border: "2px solid #C9CDF5",
            bgcolor: "#F3F4FF",
            borderRadius: "14px",
            px: 3,
            py: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1,
              color: COMMUNITY_COLORS.primaryDark,
            }}
          >
            PUESTO
          </Typography>
          <Typography sx={{ fontSize: 34, fontWeight: 800, color: "#3727C9", lineHeight: 1.1 }}>
            #{position.position}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 19, fontWeight: 700 }}>{position.fullName}</Typography>
        {position.careerName ? (
          <Typography sx={{ fontSize: 14, color: COMMUNITY_COLORS.muted }}>
            {position.careerName}
          </Typography>
        ) : null}

        {position.positionsToTopTen > 0 ? (
          <Box sx={{ width: "100%", bgcolor: "#F3F4FF", borderRadius: "10px", p: 1.5, mt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: COMMUNITY_COLORS.primaryDark }}
              >
                A solo {position.positionsToTopTen}{" "}
                {position.positionsToTopTen === 1 ? "puesto" : "puestos"} del Top 10
              </Typography>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: COMMUNITY_COLORS.primaryDark }}
              >
                {position.progressPercent}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={position.progressPercent}
              aria-label="Progreso hacia el Top 10"
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "#DDE0FA",
                "& .MuiLinearProgress-bar": { bgcolor: "#4F46E5" },
              }}
            />
          </Box>
        ) : (
          <Typography
            sx={{ fontSize: 14, fontWeight: 600, color: COMMUNITY_COLORS.success, mt: 1 }}
          >
            ¡Estás dentro del Top 10!
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
      aria-labelledby="my-position-title"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${COMMUNITY_COLORS.border}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              bgcolor: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trophy size={17} color="#FFFFFF" aria-hidden />
          </Box>
          <Typography id="my-position-title" sx={{ fontSize: 17, fontWeight: 700 }}>
            Tu posición en el podio
          </Typography>
        </Box>
        <IconButton size="small" aria-label="Cerrar" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </Box>
      <Box sx={{ px: 2.5, py: 2 }}>{renderBody()}</Box>
    </Dialog>
  );
}
