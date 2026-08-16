import { useMemo, useState } from "react";
import { Box, Divider, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { CalendarArrowDown, XCircle } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { MOCK_SUBJECTS, SERVICE_FEE_RATE } from "@/modules/student/booking/mockdata";

export type Modality = "VIRTUAL" | "IN_PERSON";

export interface BookingSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface BookingCardProps {
  selectedSlot?: BookingSlot | null;
}

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

  const hasSlot = selectedSlot !== null;
  const selectedSubject = useMemo(
    () => MOCK_SUBJECTS.find((subject) => subject.id === subjectId) ?? null,
    [subjectId],
  );

  const availableModalities: Modality[] =
    selectedSubject?.availableModalities ?? ["VIRTUAL", "IN_PERSON"];

  const handleSubjectChange = (event: SelectChangeEvent) => {
    const nextSubjectId = event.target.value;
    setSubjectId(nextSubjectId);

    const nextSubject = MOCK_SUBJECTS.find((subject) => subject.id === nextSubjectId);
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

  const canSubmit = hasSlot && subjectId !== "" && topic.trim() !== "";

  return (
    <Paper
      elevation={0}
      sx={{
        width: 450,
        p: 4,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Reserva una clase
      </Typography>

      {hasSlot ? (
        <SelectedSlotSummary slot={selectedSlot} />
      ) : (
        <EmptySlotPlaceholder />
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="h5" sx={{ fontWeight: 550 }}>
          Materia
        </Typography>
        <Select
          value={subjectId}
          onChange={handleSubjectChange}
          displayEmpty
          size="small"
          sx={{ borderRadius: 2 , fontSize: "20px", color:"#494949"}}
        >
          <MenuItem value="" disabled>
            Selecciona la materia
          </MenuItem>
          {MOCK_SUBJECTS.map((subject) => (
            <MenuItem key={subject.id} value={subject.id} sx={{ fontSize: "20px", color:"#494949" }}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="h5" sx={{ fontWeight: 550 }}>
          Tema a tratar
        </Typography>
        <TextField
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Ingresa el tema a tratar para que el tutor esté lo más preparado posible"
          multiline
          minRows={3}
          size="small"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, 
          "& .MuiInputBase-input::placeholder": {fontSize: "20px"},
          "& .MuiInputBase-input": {fontSize: "20px"}, }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="h5" sx={{ fontWeight: 550 }}>
          Modalidad
        </Typography>
        <ModalityToggle
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
      </Box>

      <Divider />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <PricingRow label="Tarifa por hora" value={pricing?.hourlyRate} formatter={currencyFormatter} />
        <PricingRow label="Tarifa de servicio (3%)" value={pricing?.serviceFee} formatter={currencyFormatter} />
        <Divider sx={{ my: 0.5 }} />
        <PricingRow
          label="Total"
          value={pricing?.total}
          formatter={currencyFormatter}
          emphasized
        />
      </Box>

      <AppButton appVariant="primary" disabled={!canSubmit} fullWidth>
        Reservar
      </AppButton>
    </Paper>
  );
}

function EmptySlotPlaceholder() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        py: 4,
        px: 2,
        borderRadius: 2,
        bgcolor: "#EEEDFE",
        textAlign: "center",
      }}
    >
      <CalendarArrowDown size={30} color="#494949" />
      <Typography variant="subtitle1" sx={{ color: "text.secondary", px: 5 }}>
        Selecciona un horario en el calendario para continuar
      </Typography>
    </Box>
  );
}

function SelectedSlotSummary({ slot }: { slot: BookingSlot }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.5,
        px: 2,
        borderRadius: 2,
        bgcolor: "#eef2ff",
      }}
    >
      <CalendarArrowDown size={30} color="#3A48AD" />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
          {slot.date}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          {slot.startTime} - {slot.endTime}
        </Typography>
      </Box>
    </Box>
  );
}


interface ModalityToggleProps {
  value: Modality;
  onChange: (modality: Modality) => void;
  availableModalities: Modality[];
}

const MODALITY_OPTIONS: Modality[] = ["VIRTUAL", "IN_PERSON"];

function ModalityToggle({ value, onChange, availableModalities }: ModalityToggleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        p: 1,
        borderRadius: 3,
        bgcolor: "#E0E0FA",
      }}
    >
      {MODALITY_OPTIONS.map((option) => {
        const isSelected = value === option;
        const isDisabled = !availableModalities.includes(option);

        return (
          <Box
            key={option}
            component="button"
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(option)}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              border: "none",
              borderRadius: 2.5,
              py: 1.5,
              px: 2,
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: isDisabled ? "not-allowed" : "pointer",
              bgcolor: isSelected ? "#fff" : "transparent",
              color: isDisabled ? "text.disabled" : isSelected ? "#5B6ED9" : "text.secondary",
              boxShadow: isSelected ? "0 1px 4px 0 rgba(15, 23, 42, 0.12)" : "none",
              transition: "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            {MODALITY_LABEL[option]}
            {isDisabled && <XCircle size={15} strokeWidth={2} />}
          </Box>
        );
      })}
    </Box>
  );
}


interface PricingRowProps {
  label: string;
  value?: number;
  formatter: Intl.NumberFormat;
  emphasized?: boolean;
}

function PricingRow({ label, value, formatter, emphasized = false }: PricingRowProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography
        variant="h6"
        sx={{ color: emphasized ? "text.primary" : "text.secondary", fontWeight: emphasized ? 700 : 400 }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontWeight: emphasized ? 700 : 500 }}
      >
        {value !== undefined ? formatter.format(value) : "-"}
      </Typography>
    </Box>
  );
}