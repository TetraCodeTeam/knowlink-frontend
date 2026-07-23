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
import { Mail, Map, Monitor, Building2, Phone } from "lucide-react";
import { useMyTutorProfile } from "@/modules/tutor/hooks/useMyTutorProfile";
import type {
  TutorModality,
  TutorOwnSubject,
} from "@/modules/tutor/interfaces/tutor-own-profile.interface";
import UnderConstructionPage from "@/shared/components/UnderConstructionPage";

const STAR_COLOR = "#E4CF8C";
const VIRTUAL_BG = "#A3AFF0";
const PRESENTIAL_BG = "#CEC0F0";
const PAYMENT_BG = "#EED6D0";
const LINKED_BORDER = "#229D59";
const UNLINKED_BORDER = "#9D3422";
const BIO_BG = "#F4F3FB";
const BIO_BORDER = "#676E99";
const BIO_TEXT = "#5B6ED9";
const SECTION_LABEL_SX = {
  fontSize: "19px",
  fontWeight: 700,
  color: "#333",
  letterSpacing: "0.5px",
  mb: "20px",
  textTransform: "uppercase" as const,
};

function ModalityChip({ modality }: { modality: TutorModality }) {
  const isVirtual = modality === "VIRTUAL";
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "18px",
        py: "10px",
        borderRadius: "20px",
        backgroundColor: isVirtual ? VIRTUAL_BG : PRESENTIAL_BG,
      }}
    >
      {isVirtual ? <Monitor size={22} /> : <Building2 size={22} />}
      <Typography sx={{ fontSize: "17px", fontWeight: 500, color: "#333" }}>
        {isVirtual ? "Virtual" : "Presencial"}
      </Typography>
    </Box>
  );
}

interface DataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}

function DataItem({ icon, label, value }: DataItemProps) {
  if (!value) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "18px", mb: "40px" }}>
      <Box sx={{ color: "#555", mt: "2px", flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: "17px", color: "#222", fontWeight: 600, mb: "4px" }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "19px", color: "#777", fontWeight: 400 }}>{value}</Typography>
      </Box>
    </Box>
  );
}

function SubjectCard({ subject }: { subject: TutorOwnSubject }) {
  const hasReviews =
    subject.averageRating !== null && subject.reviewCount !== null && subject.reviewCount > 0;
  const isFree = subject.compensationType === "FREE";

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        p: "24px 26px",
        boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <Typography
        sx={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", mb: "14px", lineHeight: 1.3 }}
      >
        {subject.subjectName}
      </Typography>

      {hasReviews ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "16px" }}>
          <Rating
            value={subject.averageRating}
            precision={0.5}
            readOnly
            size="medium"
            sx={{
              "& .MuiRating-iconFilled": { color: STAR_COLOR },
              "& .MuiRating-iconEmpty": { color: STAR_COLOR, opacity: 0.35 },
            }}
          />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: "#2435A1", opacity: 0.5, my: "3px" }}
          />
          <Typography sx={{ fontSize: "17px", color: "#2435A1", fontWeight: 500 }}>
            {subject.averageRating!.toFixed(1)} · {subject.reviewCount} Reseñas
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "inline-flex",
            px: "14px",
            py: "6px",
            borderRadius: "20px",
            backgroundColor: "#F0F0F6",
            mb: "16px",
          }}
        >
          <Typography sx={{ fontSize: "17px", color: "#767684" }}>Aún no hay reseñas</Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <ModalityChip modality={subject.modality} />
        <Typography sx={{ fontSize: "22px", fontWeight: 700, color: "#5B6ED9" }}>
          {isFree ? "Gratis" : `$${Number(subject.pricePerHour).toLocaleString("es-AR")}`}
        </Typography>
      </Box>
    </Box>
  );
}

function PaymentSection({ linked }: { linked: boolean }) {
  if (linked) {
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "16px",
          p: "14px 22px",
          borderRadius: "10px",
          backgroundColor: PAYMENT_BG,
          border: `1.5px solid ${LINKED_BORDER}`,
        }}
      >
        <Box
          component="img"
          src="/MercadoPago.png"
          alt="MercadoPago"
          sx={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }}
        />
        <Box>
          <Typography sx={{ fontSize: "17px", fontWeight: 600, color: "#1A6B3A" }}>
            Mercado pago vinculado
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: "14px",
              color: LINKED_BORDER,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Desvincular
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "16px",
          p: "14px 22px",
          borderRadius: "10px",
          backgroundColor: PAYMENT_BG,
          border: `1.5px solid ${UNLINKED_BORDER}`,
        }}
      >
        <Box
          component="img"
          src="/MercadoPago.png"
          alt="MercadoPago"
          sx={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }}
        />
        <Typography sx={{ fontSize: "17px", fontWeight: 600, color: "#9D3422" }}>
          Vincular Mercado Pago
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "15px", color: "#888", mt: "8px", lineHeight: 1.5 }}>
        Para comenzar a percibir pagos por tus tutorias, por favor finaliza la vinculación de tu
        cuenta en la sección de perfil.
      </Typography>
    </Box>
  );
}

export default function TutorProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: profile, isLoading, isError } = useMyTutorProfile();

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
  const allModalities = [...new Set(subjects.map((s) => s.modality))] as TutorModality[];

  const initials = (profile.fullName ?? "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
          TabIndicatorProps={{ style: { backgroundColor: "#4C5CB5" } }}
          sx={{
            px: "12px",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "19px",
              fontWeight: 500,
              color: "#888",
              minHeight: "60px",
              minWidth: 160,
              px: "24px",
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
              "&:hover": { backgroundColor: "#EEECF9" },
            }}
          >
            <Typography sx={{ fontSize: "20px", color: "#5B6ED9", fontWeight: 600 }}>
              + Agregar materia
            </Typography>
          </Box>
        </Box>
      )}

      {/* ── Tab: Availability ────────────────────────────────────── */}
      {activeTab === 2 && <Box />}

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
    </Box>
  );
}
