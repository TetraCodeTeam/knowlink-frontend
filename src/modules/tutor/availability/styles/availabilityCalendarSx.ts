import type { SxProps, Theme } from "@mui/material";

export const availabilityCalendarSx: SxProps<Theme> = {
  border: "1px solid #e8e8f0",
  borderRadius: 4,
  p: 3,
  bgcolor: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

  "& .fc": {
    fontFamily: "inherit",
  },

  // Encabezados de día (LU/8, MA/9, etc.)
  "& .fc-col-header": {
    borderBottom: "1px solid #ececf4",
  },
  "& .fc-col-header-cell": {
    bgcolor: "transparent",
    borderColor: "#ececf4",
    py: 1,
  },
  "& .fc-col-header-cell.fc-day-today": {
    "& .fc-col-header-cell-cushion": {
      color: "#5B6ED9",
    },
  },

  // Eje de horas
  "& .fc-timegrid-axis": {
    borderColor: "#ececf4",
  },
  "& .fc-timegrid-slot-label": {
    fontSize: "0.78rem",
    color: "#8a8aa3",
    fontWeight: 500,
  },
  "& .fc-timegrid-slot": {
    borderColor: "#f2f2f8",
  },
  "& .fc-timegrid-slot-lane": {
    borderColor: "#f2f2f8",
  },
  "& .fc-timegrid-col.fc-day-today": {
    bgcolor: "rgba(91, 110, 217, 0.03)",
  },

  // Selección en curso (arrastre)
  "& .fc-highlight": {
    bgcolor: "rgba(91, 110, 217, 0.25) !important",
    borderRadius: "6px",
  },

  // Bloques ya guardados/dibujados
  "& .fc-timegrid-event": {
    borderRadius: "8px",
    border: "none",
  },
  "& .fc-event": {
    bgcolor: "#5B6ED9 !important",
    borderColor: "#5B6ED9 !important",
    boxShadow: "0 2px 4px rgba(91, 110, 217, 0.25)",
    cursor: "pointer",
    transition: "opacity 0.15s ease",
  },
  "& .fc-event:hover": {
    opacity: 0.85,
  },

  // Scroll interno
  "& .fc-scroller": {
    overflowY: "auto !important",
  },
  "& .fc-scroller::-webkit-scrollbar": {
    width: "8px",
  },
  "& .fc-scroller::-webkit-scrollbar-thumb": {
    bgcolor: "#d8d8e6",
    borderRadius: "4px",
  },

  // Días pasados
  "& .fc-past-day": {
    bgcolor: "#f7f7fb !important",
    cursor: "not-allowed",
  },

  // Bordes generales de la grilla, más suaves
  "& .fc-scrollgrid": {
    border: "1px solid #ececf4",
    borderRadius: "12px",
    overflow: "hidden",
  },
  "& .fc-scrollgrid-section > *": {
    borderColor: "#ececf4",
  },
  "& .fc-toolbar": {
    mb: 2,
  },
  "& .fc-toolbar-title": {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1a1a2e",
  },
  "& .fc-button-group": {
    bgcolor: "#eef0fb",
    borderRadius: "8px",
    p: "2px",
  },
  "& .fc-prev-button, & .fc-next-button": {
    bgcolor: "transparent !important",
    border: "none !important",
    color: "#5B6ED9 !important",
    boxShadow: "none !important",
    "&:hover": {
      bgcolor: "rgba(91, 110, 217, 0.1) !important",
    },
    "&:disabled": {
      opacity: 0.35,
    },
  },
};
