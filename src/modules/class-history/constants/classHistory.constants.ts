import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";

export const HISTORY_PAGE_SIZE = 10;

export const CATEGORY_TABS: { category: BookingHistoryCategory; label: string }[] = [
    { category: "RESERVED", label: "Reservadas" },
    { category: "IN_PROGRESS", label: "En Curso" },
    { category: "COMPLETED", label: "Realizadas" },
    { category: "CANCELLED", label: "Canceladas" },
];

export const EMPTY_STATE_MESSAGE = "No hay registros de clases para mostrar en esta sección";

export const VIRTUAL_LINK_EDIT_WINDOW_MINUTES = 10;