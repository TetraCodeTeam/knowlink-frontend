import { useCallback, useState } from "react";
import { Box, Paper, Switch, Typography } from "@mui/material";
import { GraduationCap, Info, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AppButton from "@/shared/components/AppButton";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useActivateStudentRole } from "@/modules/tutor/dual-role/hooks/useActivateStudentRole";
import { useSwitchToStudentRole } from "@/modules/tutor/dual-role/hooks/useSwitchToStudentRole";
import ActivateStudentRoleDialog from "@/modules/tutor/dual-role/components/ActivateStudentRoleDialog";
import RoleRedirectDialog from "@/modules/tutor/dual-role/components/RoleRedirectDialog";

interface StudentRoleCardProps {
  hasStudentProfile: boolean;
}

export default function StudentRoleCard({ hasStudentProfile }: StudentRoleCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authResponse, login, logout } = useAuthStore();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [redirectVariant, setRedirectVariant] = useState<"activation" | "switch" | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  const { mutateAsync: activateAsync, isPending: isActivating } = useActivateStudentRole();
  const { mutateAsync: switchAsync, isPending: isSwitching } = useSwitchToStudentRole();

  const handleActivateConfirm = async () => {
    try {
      const { token } = await activateAsync();
      setPendingToken(token);
      setShowConfirmDialog(false);
      setRedirectVariant("activation");
    } catch {
      toast.error("No se pudo activar el rol de alumno");
    }
  };

  const handleSwitchToggle = async () => {
    try {
      const { token } = await switchAsync();
      setPendingToken(token);
      setRedirectVariant("switch");
    } catch {
      toast.error("No se pudo cambiar a modo alumno");
    }
  };

  const handleRedirect = useCallback(() => {
    if (redirectVariant === "activation") {
      logout();
      navigate("/auth/login", { replace: true });
    } else if (redirectVariant === "switch" && pendingToken) {
      void queryClient.invalidateQueries({ queryKey: ["myStudentProfile"] });
      login({ ...authResponse!, token: pendingToken, role: "STUDENT" });
      navigate("/student/home", { replace: true });
    }
  }, [redirectVariant, pendingToken, authResponse, login, logout, navigate, queryClient]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: "14px", md: "16px 24px" },
          borderRadius: "16px",
          boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <GraduationCap size={22} color="#5865C8" />
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#333",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Rol Alumno
          </Typography>
        </Box>

        <Typography sx={{ color: "#777", fontSize: "13px", lineHeight: 1.55, mb: 1.5 }}>
          {hasStudentProfile
            ? "Cambiá tu vista actual para reservar sesiones, ver tu material de estudio y gestionar tus reservas como alumno."
            : "Tu perfil de estudiante no está activo actualmente. Configurá tu perfil para comenzar a reservar sesiones y acceder a material de estudio."}
        </Typography>

        {hasStudentProfile ? (
          <Box sx={{ backgroundColor: "#EEEDFE", borderRadius: 2, p: 1.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography fontWeight={600} fontSize="14px">
                Acceder a la Interfaz de Alumno
              </Typography>
              <Switch
                checked={isSwitching}
                onChange={() => void handleSwitchToggle()}
                disabled={isSwitching}
                sx={{ transform: "scale(1.1)", transformOrigin: "right center" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75 }}>
              <Info size={15} color="#5865C8" />
              <Typography sx={{ fontSize: "13px", color: "#5865C8" }}>
                Cambia a modo alumno
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              backgroundColor: "#EEEDFE",
              borderRadius: 2,
              p: 1.75,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Info size={16} color="#6B7280" />
              <Typography sx={{ fontSize: "14px", color: "#6B7280", fontWeight: 500 }}>
                Perfil Pendiente de Activación
              </Typography>
            </Box>
            <AppButton
              appVariant="primary"
              size="small"
              sx={{ py: 0.75, fontSize: 14 }}
              startIcon={<Zap size={15} />}
              onClick={() => setShowConfirmDialog(true)}
            >
              Activar Rol Alumno
            </AppButton>
          </Box>
        )}
      </Paper>

      <ActivateStudentRoleDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => void handleActivateConfirm()}
        isPending={isActivating}
      />

      <RoleRedirectDialog
        open={redirectVariant !== null}
        variant={redirectVariant ?? "activation"}
        onRedirect={handleRedirect}
      />
    </>
  );
}
