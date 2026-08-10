import type { Modifier } from "@popperjs/core";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  ClickAwayListener,
  InputAdornment,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuthStore } from "@/modules/auth/hooks/use-auth-store";
import { buildMateriaTutorsRoute, buildTutorProfileRoute, TUTOR_ROLE } from "../constants";
import { useSearchTutorsAndMaterias } from "../hooks/useSearchTutorsAndMaterias";
import { SubjectSummary } from "../interfaces/tutor-search-result.interface";
import SearchResultsPanel from "./SearchResultsPanel";


const SEARCH_BAR_PLACEHOLDER = "Busca tutores, materias";
const SEARCH_BAR_MAX_WIDTH = 760;

const pillInputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDEBFA",
    borderRadius: "999px",
    "& fieldset": { border: "none" },
    "&:hover fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "none" },
  },
  "& .MuiInputBase-input": {
    paddingY: "12px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "text.secondary",
    opacity: 1,
  },
} as const;

// Mantiene el Popper con el mismo ancho que el input al que está anclado.
const sameWidthModifier: Partial<Modifier<"sameWidth", object>>[] = [
  {
    name: "sameWidth",
    enabled: true,
    phase: "beforeWrite",
    requires: ["computeStyles"],
    fn: ({ state }) => {
      state.styles.popper.width = `${state.rects.reference.width}px`;
    },
    effect: ({ state }) => {
      const reference = state.elements.reference as HTMLElement;
      state.elements.popper.style.width = `${reference.offsetWidth}px`;
    },
  },
];

export default function SearchBar() {
  const navigate = useNavigate();
  const activeRole = useAuthStore((state) => state.authResponse?.role);
  const isTutorModeActive = activeRole === TUTOR_ROLE;

  const anchorRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // Se dispara una solicitud por cada carácter ingresado (sin debounce),
  // según lo pedido: GET /api/v1/tutors/search/{query}.
  const { data, isFetching } = useSearchTutorsAndMaterias(inputValue);
  const tutors = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // El backend solo matchea por nombre de materia (ver search.api.ts), así
  // que las "Materias" se derivan de las subjects que cada tutor trajo como
  // coincidencia, deduplicadas por nombre (case-insensitive).
  const materias = useMemo(() => {
    const seen = new Map<string, SubjectSummary>();
    for (const tutor of tutors) {
      for (const subject of tutor.subjects) {
        const key = subject.name.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.set(key, subject);
        }
      }
    }
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [tutors]);

  const showPanel = open && inputValue.trim().length > 0;

  const handleSelectMateria = (nombre: string) => {
    navigate(buildMateriaTutorsRoute(nombre));
    setOpen(false);
  };

  const handleSelectTutor = (tutorId: string) => {
    navigate(buildTutorProfileRoute(tutorId));
    setOpen(false);
  };

  if (isTutorModeActive) {
    return (
      <Box sx={{ width: "100%", maxWidth: SEARCH_BAR_MAX_WIDTH }}>
        <TextField
          fullWidth
          size="small"
          disabled
          placeholder={SEARCH_BAR_PLACEHOLDER}
          aria-label={SEARCH_BAR_PLACEHOLDER}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "action.disabled", fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={pillInputSx}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.5, px: 1 }}
        >
          Cambiá tu rol a alumno para buscar tutores y materias.
        </Typography>
      </Box>
    );
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={anchorRef} sx={{ width: "100%", maxWidth: SEARCH_BAR_MAX_WIDTH }}>
        <TextField
          fullWidth
          size="small"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder={SEARCH_BAR_PLACEHOLDER}
          aria-label={SEARCH_BAR_PLACEHOLDER}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "action.active", fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={pillInputSx}
        />
        <Popper
          open={showPanel}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          modifiers={sameWidthModifier}
          sx={{ zIndex: (theme) => theme.zIndex.modal }}
        >
          <SearchResultsPanel
            query={inputValue}
            materias={materias}
            tutors={tutors}
            loading={isFetching}
            onSelectMateria={handleSelectMateria}
            onSelectTutor={handleSelectTutor}
          />
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}