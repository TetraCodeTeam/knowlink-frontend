import { useCallback, useState } from "react";
import { Box, Paper, Switch, Typography } from "@mui/material";
import { GraduationCap, Info, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AppButton from "@/shared/components/AppButton";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useSwitchToTutorRole } from "@/modules/student/dual-role/hooks/useSwitchToTutorRole";
import ActivateTutorRoleDialog from "@/modules/student/dual-role/components/ActivateTutorRoleDialog";
import RoleRedirectDialog from "@/modules/student/dual-role/components/RoleRedirectDialog";

interface TutorRoleCardProps {
  hasTutorProfile: boolean;
  career?: string;
}

export default function TutorRoleCard({ hasTutorProfile, career }: TutorRoleCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authResponse, login } = useAuthStore();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRedirectDialog, setShowRedirectDialog] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  const { mutateAsync: switchAsync, isPending: isSwitching } = useSwitchToTutorRole();

  const handleActivateConfirm = () => {
    setShowConfirmDialog(false);
    navigate("/auth/register/tutor", { state: { startAtStep: 2, career: career ?? "" } });
  };

  const handleSwitchToggle = async () => {
    try {
      const { token } = await switchAsync();
      setPendingToken(token);
      setShowRedirectDialog(true);
    } catch {
      toast.error("No se pudo cambiar a modo tutor");
    }
  };

  const handleRedirect = useCallback(() => {
    if (pendingToken) {
      void queryClient.invalidateQueries({ queryKey: ["myTutorProfile"] });
      login({ ...authResponse!, token: pendingToken, role: "TUTOR" });
      navigate("/tutor/home", { replace: true });
    }
  }, [pendingToken, authResponse, login, navigate, queryClient]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{ pt: 3, pb: 3, pr: 3, pl: 3, borderRadius: 3, border: "0.2px solid #e0e0fa" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <GraduationCap size={28} color="#5865C8" />
          <Typography variant="h6" component="h2" fontWeight={500}>
            Rol Tutor
          </Typography>
        </Box>

        <Typography sx={{ color: "#636363", fontSize: "14px", lineHeight: 1.6, mb: 2 }}>
          {hasTutorProfile
            ? "Cambia tu vista actual para gestionar tus sesiones, materiales y disponibilidad como tutor."
            : "Tu perfil de tutor no está activo actualmente. Configura tu perfil para comenzar a impartir sesiones y compartir tus conocimientos."}
        </Typography>

        {hasTutorProfile ? (
          <Box sx={{ backgroundColor: "#EEEDFE", borderRadius: 2, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography fontWeight={600} fontSize="17px">
                Acceder a la Interfaz de Tutor
              </Typography>
              <Switch
                checked={false}
                onChange={() => void handleSwitchToggle()}
                disabled={isSwitching}
                sx={{ transform: "scale(1.25)", transformOrigin: "right center" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75 }}>
              <Info size={15} color="#5865C8" />
              <Typography sx={{ fontSize: "15px", color: "#5865C8" }}>
                Cambia a modo tutor
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              backgroundColor: "#EEEDFE",
              borderRadius: 2,
              p: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Info size={18} color="#6B7280" />
              <Typography sx={{ fontSize: "16px", color: "#6B7280", fontWeight: 500 }}>
                Perfil Pendiente de Activación
              </Typography>
            </Box>
            <AppButton
              appVariant="primary"
              startIcon={<Zap size={17} />}
              onClick={() => setShowConfirmDialog(true)}
            >
              Activar Rol Tutor
            </AppButton>
          </Box>
        )}
      </Paper>

      <ActivateTutorRoleDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleActivateConfirm}
      />

      <RoleRedirectDialog
        open={showRedirectDialog}
        variant="switch"
        onRedirect={handleRedirect}
      />
    </>
  );
}
