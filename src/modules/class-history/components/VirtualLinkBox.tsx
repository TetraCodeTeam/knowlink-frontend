import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Info, Link2, Video } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { useUpdateVirtualLink } from "@/modules/class-history/hooks/useUpdateVirtualLink";
import { virtualLinkBoxSx } from "@/modules/class-history/styles/classHistoryStyles";
import { VIRTUAL_LINK_EDIT_WINDOW_MINUTES } from "@/modules/class-history/constants/classHistory.constants";
import { normalizeVirtualLink } from "@/modules/class-history/utils/classHistory.utils";

interface VirtualLinkBoxProps {
  bookingId: string;
  virtualSessionLink: string | null;
  sessionDate: string;
  startTime: string;
  editable: boolean; // solo true en la categoría Reservadas
}

export default function VirtualLinkBox({
  bookingId,
  virtualSessionLink,
  editable,
}: VirtualLinkBoxProps) {
  const [link, setLink] = useState(virtualSessionLink ?? "");
  const [error, setError] = useState<string | null>(null);
  const { saveVirtualLink, isPending } = useUpdateVirtualLink(bookingId);

  const handleSave = async () => {
    const trimmed = link.trim();
    if (!trimmed) {
      setError("Ingresá un link para la videollamada");
      return;
    }
    const normalizedLink = normalizeVirtualLink(trimmed);
    if (!normalizedLink) {
      setError("Ingresá un link válido, por ejemplo: https://meet.google.com/xxx-xxxx-xxx");
      return;
    }
    setError(null);
    try {
      await saveVirtualLink({ virtualSessionLink: normalizedLink });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No se pudo guardar el link. Intentá de nuevo.";
      setError(message);
    }
  };

  return (
    <Box sx={virtualLinkBoxSx(editable)}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "10px" }}>
        <Video size={16} color="#5865C8" />
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#333" }}>
          Enlace de la videollamada para el alumno
        </Typography>
        {!editable && <Info size={14} color="#999" />}
      </Box>

      {editable ? (
        <Box sx={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <TextField
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              if (error) setError(null);
            }}
            fullWidth
            size="small"
            placeholder="https://meet.google.com/..."
            disabled={isPending}
            error={!!error}
            helperText={error ?? undefined}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#FFFFFF" },
              "& .MuiInputBase-input": { fontSize: "0.9rem" },
            }}
          />
          <AppButton appVariant="primary" onClick={() => void handleSave()} loading={isPending}>
            Guardar
          </AppButton>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <Box sx={{ flexShrink: 0, mt: "3px" }}>
            <Link2 size={14} color="#666" />
          </Box>
          <Typography sx={{ fontSize: "0.9rem", color: "#333", wordBreak: "break-all", flex: 1, minWidth: 0 }}>
            {virtualSessionLink ?? "Aún no se cargó un link"}
          </Typography>
        </Box>
      )}

      {editable && (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mt: "8px" }}>
          <Info size={14} color="#666" />
          <Typography sx={{ fontSize: "0.78rem", color: "#666" }}>
            Podés actualizar el link hasta {VIRTUAL_LINK_EDIT_WINDOW_MINUTES} minutos antes de la clase
          </Typography>
        </Box>
      )}
    </Box>
  );
}