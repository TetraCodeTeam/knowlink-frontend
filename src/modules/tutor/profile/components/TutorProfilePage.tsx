import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Rating,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Mail, Map, Pencil, Phone } from "lucide-react";
import { useMyTutorProfile } from "@/modules/tutor/profile/hooks/useMyTutorProfile";
import { getInitials, getUniqueModalities } from "@/modules/tutor/profile/utils/profile.utils";
import { SECTION_LABEL_SX } from "@/modules/tutor/profile/styles/profileStyles";
import {
  STAR_COLOR,
  BIO_BG,
  BIO_BORDER,
  BIO_TEXT,
} from "@/modules/tutor/profile/constants/profileColors.constants";
import ModalityChip from "@/modules/tutor/profile/components/ModalityChip";
import DataItem from "@/modules/tutor/profile/components/DataItem";
import SubjectCard from "@/modules/tutor/profile/components/SubjectCard";
import PaymentSection from "@/modules/tutor/profile/components/PaymentSection";
import MaterialsSection from "@/modules/tutor/materials/components/MaterialsSection";
import AvailabilityEditor from "@/modules/tutor/availability/components/AvailabilityEditor";
import MinNoticeHoursPanel from "@/modules/tutor/availability/components/MinNoticeHoursPanel";
import AddSubjectModal from "@/modules/tutor/components/AddSubjectModal";
import EditSubjectModal from "@/modules/tutor/components/EditSubjectModal";
import type { TutorOwnSubject } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";
import { useFeedbackDialog } from "@/shared/hooks/useFeedbackDialog";
import { useAvailableSubjects } from "@/modules/tutor/availability/hooks/useAvailableSubjects";
import { useQueryClient } from "@tanstack/react-query";
import StudentRoleCard from "@/modules/tutor/dual-role/components/StudentRoleCard";
import AccountManagementSection from "@/modules/users/components/AccountManagementSection";
import AppButton from "@/shared/components/AppButton";
import { tutorPaths } from "@/routes/paths";

export default function TutorProfilePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const { data: profile, isLoading, isError } = useMyTutorProfile();
  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [editingSubject, setEditingSubject] = useState<TutorOwnSubject | null>(null);
  const { hasAvailableSubjects, isLoading: subjectsLoading } = useAvailableSubjects();
  const { openFeedbackDialog, feedbackDialog } = useFeedbackDialog();

  const handleSubjectAdded = () => {
    setOpenAddSubject(false);
    queryClient.invalidateQueries({ queryKey: ["myTutorProfile"] });
  };

  const handleAddSubjectClick = () => {
    if (subjectsLoading) return;

    if (!hasAvailableSubjects) {
      openFeedbackDialog({
        title: "No se encuentran materias disponibles",
        description: "No se encuentran materias disponibles para agregar",
        variant: "warning",
      });
      return;
    }

    setOpenAddSubject(true);
  };

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
      >
        <CircularProgress sx={{ color: "#4C5CB5" }} />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
      >
        <Typography color="error">No se pudo cargar el perfil. Intenta de nuevo.</Typography>
      </Box>
    );
  }

  const subjects = profile.subjects ?? [];
  const allModalities = getUniqueModalities(subjects);
  const initials = getInitials(profile.fullName ?? "");

  return (
    <Box sx={{ p: { xs: "12px", md: "16px 32px" }, minHeight: "100vh" }}>
      {/* ── Header card ──────────────────────────────────────────── */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
          mb: "14px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "14px", md: "20px" },
            p: { xs: "16px", md: "18px 24px" },
          }}
        >
          <Avatar
            src={profile.profilePictureUrl ?? undefined}
            sx={{
              width: { xs: 64, md: 84 },
              height: { xs: 64, md: 84 },
              fontSize: { xs: "22px", md: "28px" },
              fontWeight: 600,
              bgcolor: "#4C5CB5",
              flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "22px", md: "26px" },
                fontWeight: 700,
                color: "#1a1a2e",
                lineHeight: 1.15,
                mb: "4px",
              }}
            >
              {profile.fullName}
            </Typography>
            <Typography sx={{ fontSize: { xs: "15px", md: "16px" }, color: "#666", mb: "6px" }}>
              {profile.career}
            </Typography>

            {profile.averageRating !== null ? (
              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px 8px" }}>
                <Rating
                  value={profile.averageRating}
                  precision={0.5}
                  readOnly
                  size="medium"
                  sx={{
                    "& .MuiRating-iconFilled": { color: STAR_COLOR },
                    "& .MuiRating-iconEmpty": { color: STAR_COLOR, opacity: 0.35 },
                  }}
                />
                <Typography sx={{ fontSize: "15px", color: "#666", fontWeight: 500 }}>
                  {profile.averageRating.toFixed(1)} Promedio
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: "14px", color: "#aaa" }}>
                Sin calificaciones aún
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mx: { xs: "16px", md: "24px" } }} />

        <Tabs
          value={activeTab}
          onChange={(_, newVal: number) => setActiveTab(newVal)}
          variant={isCompact ? "scrollable" : "fullWidth"}
          allowScrollButtonsMobile
          TabIndicatorProps={{ sx: { backgroundColor: "#4C5CB5" } }}
          sx={{
            minHeight: "46px",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 500,
              color: "#888",
              minHeight: "46px",
              letterSpacing: "0.3px",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#4C5CB5",
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Información personal" />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                Materias
                {subjects.length > 0 && (
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: activeTab === 1 ? "#4C5CB5" : "#C7C8FF",
                      color: activeTab === 1 ? "#fff" : "#3A3F9A",
                      fontSize: "12px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {subjects.length}
                  </Box>
                )}
              </Box>
            }
          />
          <Tab label="Disponibilidad" />
          <Tab label="Recursos" />
        </Tabs>
      </Box>

      {/* ── Tab: Personal information ────────────────────────────── */}
      {activeTab === 0 && (
        <>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "stretch",
                p: { xs: "16px", md: "20px 28px" },
              }}
            >
              <Box sx={{ flex: { md: "0 0 40%" }, pr: { md: "16px" }, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: "16px",
                  }}
                >
                  <Typography sx={{ ...SECTION_LABEL_SX, mb: 0 }}>Datos personales</Typography>
                  <AppButton
                    appVariant="outline"
                    size="small"
                    sx={{ py: 0.75, fontSize: 14 }}
                    onClick={() => navigate(tutorPaths.editProfile)}
                    startIcon={<Pencil size={15} />}
                  >
                    Editar perfil
                  </AppButton>
                </Box>
                <DataItem icon={<Mail size={22} />} label="Correo" value={profile.email} />
                <DataItem icon={<Phone size={22} />} label="Celular" value={profile.phoneNumber} />
                <DataItem
                  icon={<Map size={22} />}
                  label="Dirección clases presenciales"
                  value={profile.address}
                />
              </Box>

              <Divider
                orientation={isCompact ? "horizontal" : "vertical"}
                flexItem
                sx={{ my: "8px", mx: { xs: 0, md: "20px" } }}
              />

              <Box sx={{ flex: 1, pl: { md: "16px" }, minWidth: 0 }}>
                <Typography sx={SECTION_LABEL_SX}>Modalidad</Typography>
                <Box sx={{ display: "flex", gap: "8px", mb: "16px", flexWrap: "wrap" }}>
                  {allModalities.length > 0 ? (
                    allModalities.map((mod) => <ModalityChip key={mod} modality={mod} size="sm" />)
                  ) : (
                    <Typography sx={{ fontSize: "14px", color: "#aaa" }}>
                      No hay modalidades configuradas
                    </Typography>
                  )}
                </Box>

                <Typography sx={SECTION_LABEL_SX}>Pagos</Typography>
                <Box sx={{ mb: "16px" }}>
                  <PaymentSection linked={profile.mercadoPagoLinked} />
                </Box>

                <Typography sx={SECTION_LABEL_SX}>Biografía</Typography>
                <Box
                  sx={{
                    border: `1.5px dashed ${BIO_BORDER}`,
                    borderRadius: "10px",
                    backgroundColor: BIO_BG,
                    p: "12px 16px",
                    minHeight: "64px",
                    display: "flex",
                    alignItems: profile.biography ? "flex-start" : "center",
                    justifyContent: profile.biography ? "flex-start" : "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: BIO_TEXT,
                      textAlign: profile.biography ? "left" : "center",
                      lineHeight: 1.7,
                    }}
                  >
                    {profile.biography ??
                      "Completa tu biografía para aumentar tus chances de recibir reservas"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <StudentRoleCard hasStudentProfile={profile.hasStudentProfile} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <AccountManagementSection classesPath={tutorPaths.classes} />
          </Box>
        </>
      )}

      {/* ── Tab: Subjects ────────────────────────────────────────── */}
      {activeTab === 1 && (
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "12px",
              mb: "14px",
            }}
          >
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.tutorSubjectId}
                subject={subject}
                onEdit={setEditingSubject}
              />
            ))}
          </Box>

          <Box
            role="button"
            tabIndex={0}
            onClick={handleAddSubjectClick}
            sx={{
              border: "1.5px dashed #676E99",
              borderRadius: "16px",
              backgroundColor: "#F4F3FB",
              p: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
              "&:hover": { backgroundColor: "#ECEAF8" },
            }}
          >
            <Typography sx={{ fontSize: "16px", color: "#5B6ED9", fontWeight: 600 }}>
              + Agregar materia
            </Typography>
          </Box>
        </Box>
      )}

      {/* ── Tab: Availability ────────────────────────────────────── */}
      {activeTab === 2 && (
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
            p: { xs: "14px", md: "20px 24px" },
          }}
        >
          <AvailabilityEditor />
          <Box sx={{ mt: 3 }}>
            <MinNoticeHoursPanel />
          </Box>
        </Box>
      )}

      {/* ── Tab: Resources ───────────────────────────────────────── */}
      {activeTab === 3 && (
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
            p: { xs: "14px", md: "20px 24px" },
          }}
        >
          <MaterialsSection />
        </Box>
      )}
      {feedbackDialog}
      <AddSubjectModal
        open={openAddSubject}
        onClose={() => setOpenAddSubject(false)}
        onSuccess={() => handleSubjectAdded()}
      />
      {editingSubject && (
        <EditSubjectModal
          key={editingSubject.tutorSubjectId}
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
        />
      )}
    </Box>
  );
}
