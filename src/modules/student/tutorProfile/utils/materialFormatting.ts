import type { TutorMaterialItem } from "@/modules/student/tutorProfile/interfaces/tutor.interface";

export const formatFileSize = (sizeMB: number) => {
  return sizeMB % 1 === 0
    ? `${sizeMB} MB`
    : `${sizeMB.toFixed(2).replace(/\.0+$/, "").replace(".", ",")} MB`;
};

export const formatMaterialMetadata = (item: TutorMaterialItem) => {
  if (item.fileSizeMB > 0) {
    return `${item.fileType} · ${formatFileSize(item.fileSizeMB)}`;
  }

  return item.fileType;
};
