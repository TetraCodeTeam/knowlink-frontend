import CloseIcon from "@mui/icons-material/Close";
import ComputerIcon from "@mui/icons-material/Computer";
import ApartmentIcon from "@mui/icons-material/Apartment";

import {
  Box,
  Button,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { mockSubjects } from "../utils/mockSubjects";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSubjectModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [basic, setBasic] = useState(true);
  const [free, setFree] = useState(false);
  const [subject, setSubject] = useState(mockSubjects[1]);
  const [price, setPrice] = useState("10000");
  const [modality, setModality] = useState(["virtual"]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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

        <IconButton onClick={onClose}>
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
                control={
                  <Switch
                    checked={basic}
                    onChange={(e) => setBasic(e.target.checked)}
                  />
                }
                label="Básica"
              />

              <Select
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {mockSubjects.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
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
                control={
                  <Switch
                    checked={free}
                    onChange={(e) => setFree(e.target.checked)}
                  />
                }
                label="Gratis"
              />

              <TextField
                disabled={free}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ width: 160 }}
              />
            </Stack>
          </Box>

          {/* Modalidad */}

          <Box>
            <Typography mb={1} fontWeight={500}>
              Selecciona al menos una modalidad*
            </Typography>

            <ToggleButtonGroup
              value={modality}
              onChange={(_, value) => value.length && setModality(value)}
            >
              <ToggleButton
                value="virtual"
                sx={{
                  borderRadius: 5,
                  textTransform: "none",
                  px: 2,
                }}
              >
                <ComputerIcon sx={{ mr: 1 }} fontSize="small" />
                Virtual
              </ToggleButton>

              <ToggleButton
                value="presencial"
                sx={{
                  borderRadius: 5,
                  textTransform: "none",
                  px: 2,
                }}
              >
                <ApartmentIcon sx={{ mr: 1 }} fontSize="small" />
                Presencial
              </ToggleButton>
            </ToggleButtonGroup>
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
            <Typography
              color="primary"
              fontWeight={600}
              fontSize={18}
              gutterBottom
            >
              Requisito para el cobro de sesiones
            </Typography>

            <Typography color="text.secondary">
              Para procesar la compensación de tus sesiones pagas,
              asegurate de tener tu cuenta de Mercado Pago correctamente
              vinculada en tu perfil.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            px: 4,
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onSuccess}
          sx={{
            flex: 1,
            borderRadius: 2,
            ml: 2,
          }}
        >
          Agregar materia
        </Button>
      </DialogActions>
    </Dialog>
  );
}