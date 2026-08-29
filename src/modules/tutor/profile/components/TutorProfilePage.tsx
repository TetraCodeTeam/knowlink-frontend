import { useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Rating,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Mail, Map, Phone } from "lucide-react";
import { useMyTutorProfile } from "@/modules/tutor/profile/hooks/useMyTutorProfile";
import { getInitials, getUniqueModalities } from "@/modules/tutor/profile/utils/profile.utils";
import { SECTION_LABEL_SX } from "@/modules/tutor/profile/styles/profileStyles";
import { STAR_COLOR, BIO_BG, BIO_BORDER, BIO_TEXT } from "@/modules/tutor/profile/constants/profileColors.constants";
import ModalityChip from "@/modules/tutor/profile/components/ModalityChip";
import DataItem from "@/modules/tutor/profile/components/DataItem";
import SubjectCard from "@/modules/tutor/profile/components/SubjectCard";
import PaymentSection from "@/modules/tutor/profile/components/PaymentSection";
import UnderConstructionPage from "@/shared/components/UnderConstructionPage";
import AvailabilityEditor from "@/modules/tutor/availability/components/AvailabilityEditor";
import MinNoticeHoursPanel from "@/modules/tutor/availability/components/MinNoticeHoursPanel";
import AddSubjectModal from "../../../student/tutorProfile/components/components/AddSubjectModal";
import { useFeedbackDialog } from "@/shared/hooks/useFeedbackDialog";
import { useAvailableSubjects } from "../../availability/hooks/useAvailableSubjects";
import { useQueryClient } from "@tanstack/react-query";

export default function TutorProfilePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const { data: profile, isLoading, isError } = useMyTutorProfile();
  const [openAddSubject, setOpenAddSubject] = useState(false);
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
    <Box sx={{ p: "28px 32px", minHeight: "100vh" }}>
      {/* ── Header card ──────────────────────────────────────────── */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
          mb: "20px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "28px", p: "28px 32px" }}>
          <Avatar
            src={profile.profilePictureUrl ?? undefined}
            sx={{
              width: 120,
              height: 120,
              fontSize: "40px",
              fontWeight: 600,
              bgcolor: "#4C5CB5",
              flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#1a1a2e",
                lineHeight: 1.15,
                mb: "4px",
              }}
            >
              {profile.fullName}
            </Typography>
            <Typography sx={{ fontSize: "22px", color: "#666", mb: "10px" }}>
              {profile.career}
            </Typography>

            {profile.averageRating !== null ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Rating
                  value={profile.averageRating}
                  precision={0.5}
                  readOnly
                  size="large"
                  sx={{
                    "& .MuiRating-iconFilled": { color: STAR_COLOR },
                    "& .MuiRating-iconEmpty": { color: STAR_COLOR, opacity: 0.35 },
                  }}
                />
                <Typography sx={{ fontSize: "20px", color: "#666", fontWeight: 500 }}>
                  {profile.averageRating.toFixed(1)} Promedio
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: "17px", color: "#aaa" }}>
                Sin calificaciones aún
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mx: "28px" }} />

        <Tabs
          value={activeTab}
          onChange={(_, newVal: number) => setActiveTab(newVal)}
          variant="fullWidth"
          TabIndicatorProps={{ sx: { backgroundColor: "#4C5CB5" } }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "19px",
              fontWeight: 500,
              color: "#888",
              minHeight: "60px",
              letterSpacing: "0.4px",
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
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: activeTab === 1 ? "#4C5CB5" : "#C7C8FF",
                      color: activeTab === 1 ? "#fff" : "#3A3F9A",
                      fontSize: "13px",
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
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "stretch", p: "36px 40px" }}>
            <Box sx={{ flex: "0 0 40%", pr: "16px" }}>
              <Typography sx={{ ...SECTION_LABEL_SX, mb: "26px" }}>Datos personales</Typography>
              <DataItem icon={<Mail size={30} />} label="Correo" value={profile.email} />
              <DataItem icon={<Phone size={30} />} label="Celular" value={profile.phoneNumber} />
              <DataItem
                icon={<Map size={30} />}
                label="Dirección clases presenciales"
                value={profile.address}
              />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ my: "12px", mx: "24px" }} />

            <Box sx={{ flex: 1, pl: "16px" }}>
              <Typography sx={SECTION_LABEL_SX}>Modalidad</Typography>
              <Box sx={{ display: "flex", gap: "12px", mb: "30px", flexWrap: "wrap" }}>
                {allModalities.length > 0 ? (
                  allModalities.map((mod) => <ModalityChip key={mod} modality={mod} />)
                ) : (
                  <Typography sx={{ fontSize: "17px", color: "#aaa" }}>
                    No hay modalidades configuradas
                  </Typography>
                )}
              </Box>

              <Typography sx={SECTION_LABEL_SX}>Pagos</Typography>
              <Box sx={{ mb: "30px" }}>
                <PaymentSection linked={profile.mercadoPagoLinked} />
              </Box>

              <Typography sx={SECTION_LABEL_SX}>Biografía</Typography>
              <Box
                sx={{
                  border: `1.5px dashed ${BIO_BORDER}`,
                  borderRadius: "10px",
                  backgroundColor: BIO_BG,
                  p: "20px 24px",
                  minHeight: "100px",
                  display: "flex",
                  alignItems: profile.biography ? "flex-start" : "center",
                  justifyContent: profile.biography ? "flex-start" : "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "17px",
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
      )}

      {/* ── Tab: Subjects ────────────────────────────────────────── */}
      {activeTab === 1 && (
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              mb: "20px",
            }}
          >
            {subjects.map((subject) => (
              <SubjectCard key={subject.tutorSubjectId} subject={subject} />
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
              p: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
              "&:hover": { backgroundColor: "#ECEAF8" },
            }}
          >
            <Typography sx={{ fontSize: "20px", color: "#5B6ED9", fontWeight: 600 }}>
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
            p: "28px 32px",
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
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UnderConstructionPage />
        </Box>
      )}
      {feedbackDialog}
      <AddSubjectModal
        open={openAddSubject}
        onClose={() => setOpenAddSubject(false)}
        onSuccess={() => handleSubjectAdded()}
      />
    </Box>
  );
}
