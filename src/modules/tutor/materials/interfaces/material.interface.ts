export interface Material {
    id: string;
    name: string;
    originalFileName: string;
    tutorId: string;
    tutorName: string;
    subjectId: string;
    subjectName: string;
    format: string;
    downloadUrl: string;
    uploadedAt: string;
    sizeInBytes: number;
}

export interface CreateMaterialRequest {
    name: string;
    subjectId: string;
    file: File;
}

