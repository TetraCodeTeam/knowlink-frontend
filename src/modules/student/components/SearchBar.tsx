import { useMemo, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Avatar, Box, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { buildMateriaTutorsRoute, buildTutorProfileRoute, TUTOR_ROLE } from "@/modules/student/constants";
import { useSearchTutorsAndMaterias } from "@/modules/student/hooks/useSearchTutorsAndMaterias";
import { MateriaSearchResult } from "../interfaces/materia-search-result.interface";
import { TutorSearchResult } from "../interfaces/tutor-search-result.interface";

const SEARCH_BAR_PLACEHOLDER = "Busca tutores, materias";

type SearchOption =
  | { kind: "materia"; id: string; nombre: string }
  | { kind: "tutor"; id: string; nombre: string; profilePicture?: string };

const pillInputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDEBFA",
    borderRadius: "999px",
    "& fieldset": { border: "none" },
    "&:hover fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "none" },
  },
  "& .MuiInputBase-input": {
    paddingY: "10px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "text.secondary",
    opacity: 1,
  },
  "& .MuiAutocomplete-popupIndicator": {
    display: "none",
  },
} as const;

export default function SearchBar() {
  const navigate = useNavigate();
  const activeRole = useAuthStore((state) => state.authResponse?.role);
  const isTutorModeActive = activeRole === TUTOR_ROLE;

  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // Se dispara una solicitud por cada carácter ingresado (sin debounce),
  // según lo pedido: GET /api/v1/tutors/search/{query}.
  const { data, isFetching } = useSearchTutorsAndMaterias(inputValue);

  const options: SearchOption[] = useMemo(() => {
    const tutors: TutorSearchResult[] = Array.isArray(data) ? data : [];

    // El backend solo matchea por nombre de materia (ver search.api.ts), así
    // que las "Materias" se derivan de las subjects que cada tutor trajo
    // como coincidencia, deduplicadas por nombre (case-insensitive).
    const seenMaterias = new Map<string, string>();
    for (const tutor of tutors) {
      for (const subjectName of tutor.subjects) {
        const key = subjectName.trim().toLowerCase();
        if (!seenMaterias.has(key)) {
          seenMaterias.set(key, subjectName);
        }
      }
    }

    const materiaOptions: SearchOption[] = [...seenMaterias.values()]
      .sort((a, b) => a.localeCompare(b))
      .map((nombre) => ({ kind: "materia", id: nombre, nombre }));

    const tutorOptions: SearchOption[] = tutors.map((tutor) => ({
      kind: "tutor",
      id: tutor.tutorId,
      nombre: tutor.fullName,
      profilePicture: tutor.photoProfile ?? undefined,
    }));

    return [...materiaOptions, ...tutorOptions];
  }, [data]);

  const handleChange = (_event: SyntheticEvent, value: SearchOption | null) => {
    if (!value) return;

    if (value.kind === "materia") {
      navigate(buildMateriaTutorsRoute(value.id));
    } else {
      navigate(buildTutorProfileRoute(value.id));
    }
  };

  if (isTutorModeActive) {
    return (
      <Box sx={{ width: "100%", maxWidth: 480 }}>
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
    <Autocomplete<SearchOption, false, false, false>
      fullWidth
      clearOnBlur={false}
      selectOnFocus={false}
      handleHomeEndKeys={false}
      sx={{ width: "100%", maxWidth: 480, ...pillInputSx }}
      open={open && inputValue.trim().length > 0}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={isFetching}
      loadingText="Buscando…"
      noOptionsText="No se encontraron resultados para tu búsqueda"
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
      onChange={handleChange}
      groupBy={(option) => (option.kind === "materia" ? "Materias" : "Tutores")}
      getOptionLabel={(option) => option.nombre}
      isOptionEqualToValue={(option, value) => option.kind === value.kind && option.id === value.id}
      filterOptions={(x) => x}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            {option.kind === "materia" ? (
              <MenuBookIcon fontSize="small" sx={{ color: "action.active" }} />
            ) : (
              <Avatar src={option.profilePicture} sx={{ width: 24, height: 24, fontSize: 12 }}>
                {option.nombre.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Typography variant="body2" noWrap>
              {option.nombre}
            </Typography>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={SEARCH_BAR_PLACEHOLDER}
          aria-label={SEARCH_BAR_PLACEHOLDER}
          size="small"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "action.active", fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}