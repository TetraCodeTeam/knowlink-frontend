import CloseIcon from "@mui/icons-material/Close";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { CompensationTypeRequest, ModalityRequest } from "../interfaces/TutorSubjectRequest";
import { useCreateTutorSubject } from "../hooks/Usecreatetutorsubject";
import { useAvailableSubjects } from "../availability/hooks/useAvailableSubjects";
import { useFeedbackDialog } from "@/shared/hooks/useFeedbackDialog";
import ModalityChip from "@/modules/tutor/profile/components/ModalityChip";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSubjectModal({ open, onClose, onSuccess }: Props) {
  const [basic, setBasic] = useState(true);
  const [free, setFree] = useState(false);
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("10000");
  const [virtualSelected, setVirtualSelected] = useState(true);
  const [inPersonSelected, setInPersonSelected] = useState(false);

  const modality: ModalityRequest | null =
    virtualSelected && inPersonSelected
      ? "BOTH"
      : virtualSelected
        ? "VIRTUAL"
        : inPersonSelected
          ? "IN_PERSON"
          : null;

  const { basicSubjects, careerSubjects, basicLoading, careerLoading } = useAvailableSubjects();
  const { openFeedbackDialog, feedbackDialog } = useFeedbackDialog();

  const availableSubjectOptions = basic ? basicSubjects : careerSubjects;
  const subjectsLoading = basic ? basicLoading : careerLoading;

  // Si "Básica" no tiene materias disponibles pero "Carrera" sí, arrancamos
  // mostrando la categoría que realmente tiene opciones para elegir.
  const autoSwitchedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      autoSwitchedRef.current = false;
      return;
    }

    if (basicLoading || careerLoading || autoSwitchedRef.current) return;

    if (!basicSubjects?.length && !!careerSubjects?.length) {
      setBasic(false);
    }

    autoSwitchedRef.current = true;
  }, [open, basicLoading, careerLoading, basicSubjects, careerSubjects]);

  const { mutate, isPending } = useCreateTutorSubject();

  // Cuando cambia el listado disponible (toggle Básica, o llega la carrera propia),
  // aseguramos que la materia seleccionada sea una opción válida.

  useEffect(() => {
    if (!availableSubjectOptions?.length) {
      setSubject("");
      return;
    }

    if (!availableSubjectOptions.some((s) => s.name === subject)) {
      setSubject(availableSubjectOptions[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSubjectOptions]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSubmit = () => {
    if (!subject || !modality) return;

    const compensationType: CompensationTypeRequest = free ? "FREE" : "PAID";
    const parsedPrice = Number(price);
    const pricePerHour = free
      ? null
      : Number.isFinite(parsedPrice) && parsedPrice > 0
        ? parsedPrice
        : null;

    if (!free && pricePerHour == null) return;

    mutate(
      {
        subjectName: subject,
        modality,
        compensationType,
        pricePerHour,
      },
      {
        onSuccess: () => {
          onSuccess();
          openFeedbackDialog({
            title: "¡Materia registrada exitosamente!",
            description:
              "Tu nueva materia está lista. Recuerda mantener tu disponibilidad actualizada para que los estudiantes puedan reservar sus sesiones.",
            variant: "success",
            actionLabel: "Volver a mi perfil"
          });
          handleClose();
        },
      }
    );
  };

  return (
    <>
      {feedbackDialog}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            fontSize: 24,
          }}
        >
          Agregar materia
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            {/* Materia */}

            <Box>
              <Typography mb={1} fontWeight={500}>
                Materia*
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                  control={<Switch checked={basic} onChange={(e) => setBasic(e.target.checked)} />}
                  label="Básica"
                />

                <Select
                  fullWidth
                  value={subject}
                  disabled={subjectsLoading || !availableSubjectOptions?.length}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {availableSubjectOptions?.map((item) => (
                    <MenuItem key={item.subjectId} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Box>

            {/* Precio */}

            <Box>
              <Typography mb={1} fontWeight={500}>
                Precio por hora*
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                  control={<Switch checked={free} onChange={(e) => setFree(e.target.checked)} />}
                  label="Gratis"
                />

                <TextField
                  disabled={free}
                  value={price}
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                  sx={{ width: 160 }}
                />
              </Stack>
            </Box>

            {/* Modalidad */}

            <Box>
              <Typography mb={1} fontWeight={500}>
                Selecciona una o ambas modalidades*
              </Typography>

              <Stack direction="row" spacing={2}>
                <ModalityChip
                  modality="VIRTUAL"
                  selected={virtualSelected}
                  onClick={() => setVirtualSelected((prev) => !prev)}
                />

                <ModalityChip
                  modality="IN_PERSON"
                  selected={inPersonSelected}
                  onClick={() => setInPersonSelected((prev) => !prev)}
                />
              </Stack>
            </Box>

            {/* Aviso */}

            <Box
              sx={{
                border: "2px dashed #D5D9FF",
                borderRadius: 3,
                bgcolor: "#F9FAFF",
                p: 2.5,
                textAlign: "center",
              }}
            >
              <Typography color="primary" fontWeight={600} fontSize={18} gutterBottom>
                Requisito para el cobro de sesiones
              </Typography>

              <Typography color="text.secondary">
                Para procesar la compensación de tus sesiones pagas, asegurate de tener tu cuenta de
                Mercado Pago correctamente vinculada en tu perfil.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isPending}
            sx={{
              borderRadius: 2,
              px: 4,
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isPending || !subject || !modality}
            sx={{
              flex: 1,
              borderRadius: 2,
              ml: 2,
            }}
          >
            {isPending ? <CircularProgress size={22} color="inherit" /> : "Agregar materia"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
