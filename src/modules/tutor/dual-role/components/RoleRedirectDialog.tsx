import { useEffect } from "react";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import { ArrowLeftRight, GraduationCap } from "lucide-react";

interface RoleRedirectDialogProps {
  open: boolean;
  variant: "activation" | "switch";
  onRedirect: () => void;
}

const REDIRECT_DELAY_MS = 2500;

const VARIANT_CONFIG = {
  activation: {
    bgColor: "#E2F6E3",
    iconColor: "#638E73",
    Icon: GraduationCap,
    title: "Perfil de alumno activado",
    subtitle: "Te estamos redirigiendo al login…",
  },
  switch: {
    bgColor: "#EDE9FE",
    iconColor: "#4C1D95",
    Icon: ArrowLeftRight,
    title: "Cambiando a modo alumno…",
    subtitle: "Te estamos redirigiendo a tu interfaz de alumno.",
  },
};

export default function RoleRedirectDialog({ open, variant, onRedirect }: RoleRedirectDialogProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onRedirect, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open, onRedirect]);

  const { bgColor, iconColor, Icon, title, subtitle } = VARIANT_CONFIG[variant];
  
  return (
    <Dialog open={open} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogContent sx={{ textAlign: "center", py: 5, px: 4 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2.5,
          }}
        >
          <Icon size={36} color={iconColor} />
        </Box>
        <Typography variant="h6" fontWeight={600} mb={1}>
          {title}
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "15px" }}>{subtitle}</Typography>
      </DialogContent>
    </Dialog>
  );
}
