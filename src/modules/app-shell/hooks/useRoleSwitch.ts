import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useSwitchToTutorRole } from "@/modules/student/dual-role/hooks/useSwitchToTutorRole";
import { useSwitchToStudentRole } from "@/modules/tutor/dual-role/hooks/useSwitchToStudentRole";
import { studentPaths, tutorPaths } from "@/routes/paths";

type SwitchableRole = "STUDENT" | "TUTOR";

interface RoleTarget {
  role: SwitchableRole;
  /** "Tutor" / "Alumno": se usa en los textos del menú. */
  label: string;
  homePath: string;
  /** Perfil del rol actual: ahí está la tarjeta que activa el otro rol. */
  activationPath: string;
}

const TARGETS: Record<SwitchableRole, RoleTarget> = {
  STUDENT: {
    role: "TUTOR",
    label: "Tutor",
    homePath: "/tutor/home",
    activationPath: studentPaths.profile,
  },
  TUTOR: {
    role: "STUDENT",
    label: "Alumno",
    homePath: "/student/home",
    activationPath: tutorPaths.profile,
  },
};

/**
 * Cambio de modo alumno ↔ tutor desde el menú del avatar. Usa el mismo flujo que la tarjeta
 * del perfil y el aviso de notificaciones: pide el token del otro rol, muestra el diálogo
 * de redirección y recién entonces reemplaza la sesión.
 */
export function useRoleSwitch() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authResponse = useAuthStore((state) => state.authResponse);
  const login = useAuthStore((state) => state.login);
  const { mutateAsync: switchToTutor, isPending: isSwitchingToTutor } = useSwitchToTutorRole();
  const { mutateAsync: switchToStudent, isPending: isSwitchingToStudent } =
    useSwitchToStudentRole();
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  const activeRole = authResponse?.role;
  const target =
    activeRole === "STUDENT" || activeRole === "TUTOR" ? TARGETS[activeRole] : undefined;

  const switchRole = useCallback(async () => {
    if (!target) return;
    try {
      const { token } = target.role === "TUTOR" ? await switchToTutor() : await switchToStudent();
      setPendingToken(token);
    } catch {
      toast.error(`No se pudo cambiar a modo ${target.label.toLowerCase()}`);
    }
  }, [target, switchToTutor, switchToStudent]);

  const completeSwitch = useCallback(() => {
    if (!pendingToken || !authResponse || !target) return;
    void queryClient.invalidateQueries({
      queryKey: [target.role === "TUTOR" ? "myTutorProfile" : "myStudentProfile"],
    });
    login({ ...authResponse, token: pendingToken, role: target.role });
    navigate(target.homePath, { replace: true });
  }, [pendingToken, authResponse, target, queryClient, login, navigate]);

  return {
    target,
    switchRole,
    isSwitching: isSwitchingToTutor || isSwitchingToStudent,
    isRedirectDialogOpen: pendingToken !== null,
    completeSwitch,
  };
}
