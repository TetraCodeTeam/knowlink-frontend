import { Box, Chip, MenuItem, Select, TextField, Typography } from "@mui/material";
import { AlarmClock } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { useMinNoticeDraft } from "@/modules/tutor/availability/hooks/use-min-notice-draft";
import type { MinNoticeUnit } from "@/modules/tutor/availability/constants/min-notice.constants";
import {
  minNoticePanelSx,
  minNoticeChipSx,
} from "@/modules/tutor/availability/styles/min-notice-hours-panel-sx";

export default function MinNoticeHoursPanel() {
  const {
    isLoading,
    isPending,
    presets,
    effectiveSelection,
    effectiveCustomValue,
    effectiveCustomUnit,
    isSaveDisabled,
    selectPreset,
    selectOther,
    setCustomValue,
    setCustomUnit,
    save,
  } = useMinNoticeDraft();

  if (isLoading) return null;

  return (
    <Box sx={minNoticePanelSx}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mb: 1.5 }}
      >
        <AlarmClock size={22} />
        <Typography variant="h5" fontWeight={700}>
          Antelación mínima para reservar
        </Typography>
      </Box>

      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        mb={1.5}
        sx={{ maxWidth: 590, mx: "auto" }}
      >
        ¿Con cuánto tiempo de antelación necesitás recibir reservas? Los alumnos solo podrán
        reservar clases que comiencen después de este margen de tiempo.
      </Typography>

      <Typography variant="body2" color="text.secondary" display="block" textAlign="center" mb={3}>
        Ejemplo: Si eliges 2 horas, una clase a las 17:00 dejará de estar disponible para reservas a
        las 15:01.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          justifyContent: "center",
          flexWrap: "wrap",
          mb: effectiveSelection === "OTHER" ? 2 : 3,
        }}
      >
        {presets.map((preset) => (
          <Chip
            key={preset.label}
            label={preset.label}
            onClick={() => selectPreset(preset.minutes)}
            color={effectiveSelection === preset.minutes ? "primary" : "default"}
            variant={effectiveSelection === preset.minutes ? "filled" : "outlined"}
            disabled={isPending}
            sx={minNoticeChipSx}
          />
        ))}
        <Chip
          label="Otro"
          onClick={selectOther}
          color={effectiveSelection === "OTHER" ? "primary" : "default"}
          variant={effectiveSelection === "OTHER" ? "filled" : "outlined"}
          disabled={isPending}
          sx={minNoticeChipSx}
        />
      </Box>

      {effectiveSelection === "OTHER" && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            maxWidth: 400,
            mx: "auto",
            mb: 3,
          }}
        >
          <TextField
            placeholder="Cantidad"
            type="number"
            size="small"
            value={effectiveCustomValue}
            onChange={(e) => setCustomValue(e.target.value)}
            inputProps={{ min: 1, step: 1 }}
            disabled={isPending}
            sx={{ flex: 1 }}
          />
          <Select
            size="small"
            value={effectiveCustomUnit}
            onChange={(e) => setCustomUnit(e.target.value as MinNoticeUnit)}
            disabled={isPending}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="MINUTES">Minutos</MenuItem>
            <MenuItem value="HOURS">Horas</MenuItem>
            <MenuItem value="DAYS">Días</MenuItem>
          </Select>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <AppButton
          appVariant="primary"
          onClick={save}
          loading={isPending}
          disabled={isSaveDisabled}
        >
          ✓ Guardar
        </AppButton>
      </Box>
    </Box>
  );
}
