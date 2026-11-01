import type { Modifier } from "@popperjs/core";
import { useMemo, useRef, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import {
  buildMateriaTutorsRoute,
  buildSearchResultsRoute,
  buildTutorProfileRoute,
  MAX_SEARCH_SUGGESTIONS,
  TUTOR_ROLE,
} from "../constants";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { useSearchTutorsAndMaterias } from "../hooks/useSearchTutorsAndMaterias";
import { deriveMateriasFromTutors } from "../utils/derive-materias";
import SearchFiltersPopover from "./SearchFiltersPopover";
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
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);

  const matchesSearchPage = useMatch("/student/buscar");
  const matchesTutoresPage = useMatch("/student/tutores");
  const { mode, filters, setFilters, activeFilterCount } = useSearchFilters();

  // Se dispara una solicitud por cada carácter ingresado (sin debounce),
  // según lo pedido: GET /api/v1/tutors/search/{query}.
  const { data, isFetching } = useSearchTutorsAndMaterias(inputValue);
  const tutors = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const materias = useMemo(() => deriveMateriasFromTutors(tutors), [tutors]);

  const showPanel = open && inputValue.trim().length > 0;
  const showFiltersButton = !isTutorModeActive && Boolean(matchesSearchPage || matchesTutoresPage);

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
            if (event.key === "Escape") {
              setOpen(false);
              return;
            }
            if (event.key === "Enter" && inputValue.trim().length > 0) {
              event.preventDefault();
              navigate(buildSearchResultsRoute(inputValue.trim()));
              setOpen(false);
            }
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
              endAdornment: showFiltersButton ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Filtros avanzados"
                    size="small"
                    onClick={(event) => {
                      setOpen(false);
                      setFiltersAnchor(event.currentTarget);
                    }}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "10px",
                      backgroundColor: "#DCD9F5",
                      color: "#3f4a9e",
                      "&:hover": { backgroundColor: "#d0ccf0" },
                    }}
                  >
                    <Badge
                      badgeContent={activeFilterCount}
                      overlap="circular"
                      sx={{ "& .MuiBadge-badge": { backgroundColor: "#5865C8" } }}
                    >
                      <TuneIcon sx={{ fontSize: 20 }} />
                    </Badge>
                  </IconButton>
                </InputAdornment>
              ) : undefined,
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
            materias={materias.slice(0, MAX_SEARCH_SUGGESTIONS)}
            tutors={tutors.slice(0, MAX_SEARCH_SUGGESTIONS)}
            loading={isFetching}
            onSelectMateria={handleSelectMateria}
            onSelectTutor={handleSelectTutor}
          />
        </Popper>
        <SearchFiltersPopover
          anchorEl={filtersAnchor}
          open={Boolean(filtersAnchor)}
          mode={mode}
          filters={filters}
          onApply={(next) => {
            setFilters(next);
            setFiltersAnchor(null);
          }}
          onClose={() => setFiltersAnchor(null)}
        />
      </Box>
    </ClickAwayListener>
  );
}
