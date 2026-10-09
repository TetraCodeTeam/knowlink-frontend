export const ALLOWED_MIME_TYPES = ["image/png", "application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
export const MAX_FILE_SIZE_MB = 10; // 10 MB limit
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

export const FILE_TYPE_COLORS = {
    PDF: "#E3C0C0",
    PNG: "#D6C0E3",
    XLSX: "#C0E3C1",
};

export const FILE_TYPE_ICON_COLORS = {
    PDF: "#7A2323",
    PNG: "#5B2480",
    XLSX: "#1E6B30",
};

export const UPLOAD_BUTTON_COLORS = {
    background: "#EEEDFE",
    text: "#34306F", 
    border: "#C1BFE7",
} as const;

export const DROP_AREA_COLORS = {
    background: "#F4F3FB",
    border: "#C7C8FF",
    text: "#231D58",
    formats: "#4C458E",
} as const;

export const VALIDATION_MESSAGES = {
    noMaterial: "Debés asociar el material a una materia",
    invalidFormat: "El formato del archivo no está permitido",
    fileTooLarge: `El archivo no debe superar ${MAX_FILE_SIZE_MB}MB`,
    uploadError: "Error al subir el material. Intenta nuevamente.",
} as const;

export const ALLOWED_FORMATS = ["PNG", "PDF", "XLSX"];
