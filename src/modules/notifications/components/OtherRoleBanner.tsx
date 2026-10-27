import { useCallback, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useSwitchToTutorRole } from "@/modules/student/dual-role/hooks/useSwitchToTutorRole";
import { useSwitchToStudentRole } from "@/modules/tutor/dual-role/hooks/useSwitchToStudentRole";
import StudentRoleRedirectDialog from "@/modules/student/dual-role/components/RoleRedirectDialog";
import TutorRoleRedirectDialog from "@/modules/tutor/dual-role/components/RoleRedirectDialog";
import type { OtherRoleBannerProps } from "@/modules/notifications/components/OtherRoleBanner.types";

const BANNER_BG = "#FFF7ED";
const BANNER_BORDER = "#FDE9C8";
const BANNER_TEXT = "#92400E";
const BANNER_SUBTITLE = "#A16207";

export default function OtherRoleBanner({ otherRoleCount }: OtherRoleBannerProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authResponse, login } = useAuthStore();
  const { mutateAsync: switchToTutor, isPending: isSwitchingToTutor } = useSwitchToTutorRole();
  const { mutateAsync: switchToStudent, isPending: isSwitchingToStudent } =
    useSwitchToStudentRole();
  const [showRedirectDialog, setShowRedirectDialog] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  const activeRole = authResponse?.role;
  const targetRole = activeRole === "STUDENT" ? "TUTOR" : "STUDENT";
  const targetLabel = targetRole === "TUTOR" ? "Tutor" : "Alumno";
  const targetPath = targetRole === "TUTOR" ? "/tutor/home" : "/student/home";
  const isPending = isSwitchingToTutor || isSwitchingToStudent;

  const handleSwitch = async () => {
    try {
      const { token } = targetRole === "TUTOR" ? await switchToTutor() : await switchToStudent();
      setPendingToken(token);
      setShowRedirectDialog(true);
    } catch {
      toast.error(`No se pudo cambiar a modo ${targetLabel.toLowerCase()}`);
    }
  };

  const handleRedirect = useCallback(() => {
    if (!pendingToken || !authResponse) return;
    void queryClient.invalidateQueries({
      queryKey: [targetRole === "TUTOR" ? "myTutorProfile" : "myStudentProfile"],
    });
    login({ ...authResponse, token: pendingToken, role: targetRole });
    navigate(targetPath, { replace: true });
  }, [pendingToken, authResponse, targetRole, targetPath, login, navigate, queryClient]);

  const isDualRole = activeRole === "STUDENT" || activeRole === "TUTOR";
  if (otherRoleCount <= 0 || !authResponse || !isDualRole) return null;

  return (
    <>
      <Box
        sx={{
          mx: 2,
          mt: 2,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: BANNER_BG,
          border: `1px solid ${BANNER_BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: "#FEF3C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ArrowLeftRight size={18} color={BANNER_TEXT} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: BANNER_TEXT }}>
            Tenés novedades en modo {targetLabel}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: BANNER_SUBTITLE }}>
            {otherRoleCount} sin leer en tu otro rol
          </Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          disabled={isPending}
          onClick={() => void handleSwitch()}
          sx={{
            flexShrink: 0,
            backgroundColor: BANNER_TEXT,
            "&:hover": { backgroundColor: "#7C360C" },
          }}
        >
          {isPending ? "Cambiando…" : `Ir a modo ${targetLabel}`}
        </Button>
      </Box>

      {activeRole === "STUDENT" ? (
        <StudentRoleRedirectDialog
          open={showRedirectDialog}
          variant="switch"
          onRedirect={handleRedirect}
        />
      ) : (
        <TutorRoleRedirectDialog
          open={showRedirectDialog}
          variant="switch"
          onRedirect={handleRedirect}
        />
      )}
    </>
  );
}
