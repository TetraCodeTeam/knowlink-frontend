import { Box, Chip, MenuItem, Select, TextField, Typography } from "@mui/material";
import { AlarmClock } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { useMinNoticeDraft } from "@/modules/tutor/availability/hooks/useMinNoticeDraft";
import type { MinNoticeUnit } from "@/modules/tutor/availability/constants/minNotice.constants";
import {
  minNoticePanelSx,
  minNoticeChipSx,
} from "@/modules/tutor/availability/styles/minNoticeHoursPanelSx";

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mb: 1 }}>
        <AlarmClock size={18} />
        <Typography fontSize={{ xs: 16, md: 18 }} fontWeight={700}>
          Antelación mínima para reservar
        </Typography>
      </Box>

      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mb={1}
        sx={{ maxWidth: 590, mx: "auto" }}
      >
        ¿Con cuánto tiempo de antelación necesitás recibir reservas? Los alumnos solo podrán
        reservar clases que comiencen después de este margen de tiempo.
      </Typography>

      <Typography fontSize={12.5} color="text.secondary" display="block" textAlign="center" mb={2}>
        Ejemplo: Si eliges 2 horas, una clase a las 17:00 dejará de estar disponible para reservas a
        las 15:01.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          flexWrap: "wrap",
          mb: effectiveSelection === "OTHER" ? 1.5 : 2,
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
            mb: 2,
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
          size="small"
          sx={{ py: 0.75, fontSize: 14 }}
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
