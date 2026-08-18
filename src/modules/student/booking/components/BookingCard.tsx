import { useMemo, useState } from "react";
import { Box, Divider, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import BookingModalityToggle from "@/modules/student/booking/components/BookingModalityToggle";
import BookingPricingRow from "@/modules/student/booking/components/BookingPricingRow";
import BookingSlotSelectionSummary from "@/modules/student/booking/components/BookingSlotSelectionSummary";
import { SERVICE_FEE_RATE } from "@/modules/student/booking/mockdata";
import { useBookingSubjects } from "@/modules/student/booking/hooks/use-booking-subjects";
import type { BookingCardProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import type { Modality } from "@/modules/student/booking/interfaces/modalityType";
import { MapPin } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const MODALITY_LABEL: Record<Modality, string> = {
  VIRTUAL: "Virtual",
  IN_PERSON: "Presencial",
};

export default function BookingCard({ selectedSlot = null }: BookingCardProps) {
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [modality, setModality] = useState<Modality>("VIRTUAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const subjects = useBookingSubjects();

  const hasSlot = selectedSlot !== null;
  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === subjectId) ?? null,
    [subjectId, subjects]
  );

  const availableModalities: Modality[] = selectedSubject?.availableModalities ?? [
    "VIRTUAL",
    "IN_PERSON",
  ];

  const handleSubjectChange = (event: SelectChangeEvent) => {
    const nextSubjectId = event.target.value;
    setSubjectId(nextSubjectId);

    const nextSubject = subjects.find((subject) => subject.id === nextSubjectId);
    if (nextSubject && !nextSubject.availableModalities.includes(modality)) {
      setModality(nextSubject.availableModalities[0]);
    }
  };

  const pricing = useMemo(() => {
    if (!selectedSubject) return null;
    const hourlyRate = selectedSubject.hourlyRate;
    const serviceFee = Math.round(hourlyRate * SERVICE_FEE_RATE);
    return {
      hourlyRate,
      serviceFee,
      total: hourlyRate + serviceFee,
    };
  }, [selectedSubject]);

  const canSubmit =
    hasSlot && subjectId !== "" && topic.trim() !== "" && !isSubmitting && !confirmedBookingId;

  const handleReserve = async () => {
    if (!selectedSlot || !canSubmit) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setConfirmedBookingId(selectedSlot.id);
    setIsSubmitting(false);
  };

  const isConfirmedForCurrentSlot = selectedSlot !== null && confirmedBookingId === selectedSlot.id;

  return (
    <Paper
      elevation={0}
      sx={{
        width: 350,
        p: 4,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Reserva una clase
      </Typography>

      <BookingSlotSelectionSummary slot={selectedSlot} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 550 }}>
          Materia
        </Typography>
        <Select
          value={subjectId}
          onChange={handleSubjectChange}
          displayEmpty
          size="small"
          sx={{ borderRadius: 2, fontSize: "14px", color: "#494949" }}
        >
          <MenuItem value="" disabled>
            Selecciona la materia
          </MenuItem>
          {subjects.map((subject) => (
            <MenuItem
              key={subject.id}
              value={subject.id}
              sx={{ fontSize: "14px", color: "#494949" }}
            >
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 550 }}>
          Tema a tratar
        </Typography>
        <TextField
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Ingresa el tema a tratar para que el tutor esté lo más preparado posible"
          multiline
          minRows={3}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
            "& .MuiInputBase-input::placeholder": { fontSize: "14px" },
            "& .MuiInputBase-input": { fontSize: "14px" },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 550 }}>
          Modalidad
        </Typography>
        <BookingModalityToggle
          value={modality}
          onChange={setModality}
          availableModalities={availableModalities}
        />
        {availableModalities.length === 1 && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            *El tutor solo ofrece clases {MODALITY_LABEL[availableModalities[0]].toLowerCase()}
            es para esta materia.
          </Typography>
        )}

        {/* Si es presencial se muestra la dirección si está definida por el tutor, si no un mensaje de a acordar */}
        {modality === "IN_PERSON" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 0.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#f7f7fb",
              border: "1px solid #ececf4",
            }}
          >
            <MapPin size={16} color="#8a8aa3" style={{ flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                color: selectedSubject?.address ? "#494949" : "text.secondary",
                fontSize: 14,
                fontStyle: selectedSubject?.address ? "normal" : "italic",
              }}
            >
              {selectedSubject?.address ?? "Ubicación a coordinar con el tutor"}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <BookingPricingRow
          label="Tarifa por hora"
          value={pricing?.hourlyRate}
          formatter={currencyFormatter}
        />
        <BookingPricingRow
          label="Tarifa de servicio (3%)"
          value={pricing?.serviceFee}
          formatter={currencyFormatter}
        />
        <Divider sx={{ my: 0.5 }} />
        <BookingPricingRow
          label="Total"
          value={pricing?.total}
          formatter={currencyFormatter}
          emphasized
        />
      </Box>

      {isConfirmedForCurrentSlot && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#e8f7ed",
            border: "1px solid #bfe7cc",
            color: "#1f6f46",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Reserva confirmada
          </Typography>
          <Typography variant="body2">
            Tu clase quedó registrada con éxito. Este es un mock de la confirmación del endpoint.
          </Typography>
        </Box>
      )}

      <AppButton appVariant="primary" disabled={!canSubmit} loading={isSubmitting} onClick={handleReserve} fullWidth>
        {isConfirmedForCurrentSlot ? "Reservado" : "Reservar"}
      </AppButton>
    </Paper>
  );
}
