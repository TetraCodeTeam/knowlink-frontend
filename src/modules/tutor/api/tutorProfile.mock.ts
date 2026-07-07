import type { TutorProfile } from "@/modules/tutor/interfaces/tutor.interface";

export const mockTutorProfile: TutorProfile = {
  id: "1",
  name: "Silvina Rubio",
  avatarUrl: null,
  rating: 4.9,
  reviewsCount: 128,
  subjects: ["Algoritmos y Estructuras de Datos", "Sistemas y Organizaciones", "Sistemas Operativos"],
  about:
    "¡Hola! Soy estudiante de último año de Ingeniería en Sistemas y me encanta enseñar. " +
    "He sido Ayudante de Cátedra durante 3 semestres consecutivos y disfruto adaptar la metodología " +
    "al ritmo de cada estudiante, ya que sé que necesitas preparar un examen urgente o entender a " +
    "fondo la teoría detrás del código.",
  subjectRates: [
    {
      id: "s1",
      name: "Algoritmos y Estructuras de Datos",
      rating: 4.9,
      reviewsCount: 128,
      price: 15000,
      isFree: false,
      modalities: ["Presencial", "Virtual"],
      isVerified: true,
    },
    {
      id: "s2",
      name: "Sistemas y Organizaciones",
      rating: 4.2,
      reviewsCount: 88,
      price: 0,
      isFree: true,
      modalities: ["Virtual"],
      isVerified: false,
    },
    {
      id: "s3",
      name: "Sistemas Operativos",
      rating: 4.0,
      reviewsCount: 35,
      price: 8000,
      isFree: false,
      modalities: ["Presencial", "Virtual"],
      isVerified: false,
    },
  ],
  reviews: [
    {
      id: "r1",
      studentName: "Lucía López",
      studentAvatarUrl: null,
      subject: "Algoritmos y Estructuras de Datos",
      rating: 5,
      comment:
        "Excelente explicando, muy clara en cada tema. Aprobé mi parcial gracias a ella, " +
        "tan muy paciente y predispuesta para ayudar todo momento.",
    },
    {
      id: "r2",
      studentName: "Ciro Gutierrez",
      studentAvatarUrl: null,
      subject: "Sistemas y Organizaciones",
      rating: 4,
      comment:
        "Clases muy estructuradas. A veces va un poco rápido, pero siempre se asegura " +
        "de que lo entiendas.",
    },
  ],
  material: [
    { id: "m1", title: "Guía de Árboles AVL", subject: "Algoritmos y Estructuras de Datos", fileUrl: "#" },
    { id: "m2", title: "Resumen Modelo OSI", subject: "Sistemas y Organizaciones", fileUrl: "#" },
  ],
  hasConfirmedBooking: false,
};