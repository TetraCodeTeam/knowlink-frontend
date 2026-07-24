import type React from "react";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { Laptop, LibraryBig } from "lucide-react";
import type { Step1Data } from "@/modules/auth/schemas/tutor-register.schema";
import type { Step2Data } from "@/modules/auth/schemas/tutor-register.schema";
import AppButton from "@/shared/components/AppButton";

interface Step4Props {
  step1: Step1Data;
  step2: Step2Data;
  mpLinked: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

const MODALITY_LABEL: Record<string, string> = {
  VIRTUAL: "Virtual",
  IN_PERSON: "Presencial",
  BOTH: "Virtual y Presencial",
};

const MODALITY_ICON: Record<string, React.ElementType> = {
  VIRTUAL: Laptop,
  IN_PERSON: LibraryBig,
};

export default function Step4Confirmation({
  step1,
  step2,
  mpLinked,
  isPending,
  onConfirm,
  onBack,
}: Step4Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        width: "100%",
        maxWidth: 440,
      }}
    >
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" mb={1}>
        Confirmación
      </Typography>

      {/* Datos personales */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="body2"
            fontWeight={700}
            mb={1.5}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Datos personales
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" mb={0.5}>
              Nombre completo: {step1.firstName} {step1.lastName}
            </Typography>
            <Typography component="li" variant="body2" mb={0.5}>
              Carrera: {step1.career}
            </Typography>
            <Typography component="li" variant="body2">
              Teléfono: {step1.phoneNumber}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Perfil académico */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="body2"
            fontWeight={700}
            mb={1.5}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Perfil académico
          </Typography>
          {step2.biography && (
            <Box mb={1.5}>
              <Typography variant="body2" fontWeight={500}>
                Biografía
              </Typography>
              <Typography variant="body2" color="text.secondary">
                "{step2.biography}"
              </Typography>
            </Box>
          )}
          {step2.subjects.map((subject, i) => {
            const modalitiesToShow =
              subject.modality === "BOTH"
                ? (["VIRTUAL", "IN_PERSON"] as const)
                : ([subject.modality] as const);

            return (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="body2" fontWeight={500} sx={{ minWidth: 72 }}>
                  Materia {i + 1}:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: "1px solid #e2e8f0",
                    borderRadius: 5,
                    pl: 1.5,
                    pr: 0.5,
                    py: 0.5,
                    flex: 1,
                    minWidth: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {subject.subjectName}
                  </Typography>
                  {modalitiesToShow.map((mod) => {
                    const ModalityIcon = MODALITY_ICON[mod];
                    return (
                      <Chip
                        key={mod}
                        icon={ModalityIcon ? <ModalityIcon size={14} /> : undefined}
                        label={MODALITY_LABEL[mod] ?? mod}
                        size="small"
                        color="primary"
                        sx={{ "& .MuiChip-icon": { color: "#fff" } }}
                      />
                    );
                  })}
                  <Chip
                    label={
                      subject.compensationType === "FREE"
                        ? "Gratis"
                        : `$${subject.pricePerHour?.toLocaleString("es-AR") ?? 0}/h`
                    }
                    size="small"
                    sx={{ bgcolor: "#fde8d0", flexShrink: 0 }}
                  />
                </Box>
              </Box>
            );
          })}
          {step2.subjects.some((s) => s.modality === "IN_PERSON" || s.modality === "BOTH") &&
            step2.address && (
              <Box mt={1.5}>
                <Typography variant="body2" fontWeight={500}>
                  Dirección para clases presenciales
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step2.address}
                </Typography>
              </Box>
            )}
        </CardContent>
      </Card>

      {/* Mercado Pago */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="body2"
            fontWeight={700}
            mb={1.5}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Mercado pago
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              Estado de vinculación
            </Typography>
            <Chip
              label={mpLinked ? "Vinculado" : "No vinculado"}
              size="small"
              sx={{
                bgcolor: mpLinked ? "#dcfce7" : "#fef9c3",
                color: mpLinked ? "#16a34a" : "#854d0e",
              }}
            />
          </Box>
          {!mpLinked && (
            <Box
              sx={{
                mt: 1,
                p: 1.5,
                bgcolor: "#faf3e8",
                border: "1px solid #f0e4d0",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#7a5c2e", display: "block", textAlign: "center" }}
              >
                No podrás recibir reservas pagas hasta que vincules tu cuenta de Mercado Pago. Podés
                hacerlo después desde tu perfil.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Botones */}
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <AppButton appVariant="outline" fullWidth onClick={onBack} disabled={isPending}>
          ← Volver
        </AppButton>
        <AppButton appVariant="primary" fullWidth onClick={onConfirm} loading={isPending}>
          → Finalizar registro
        </AppButton>
      </Box>
    </Box>
  );
}
