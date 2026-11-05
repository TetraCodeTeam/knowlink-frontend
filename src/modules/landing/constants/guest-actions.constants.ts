/** Acciones de la comunidad que un invitado intenta hacer y que requieren una cuenta. */
export type GuestAction = "post" | "reply" | "helpful" | "thread" | "book" | "podium";

interface GuestActionCopy {
  title: string;
  body: string;
}

export const GUEST_ACTION_COPY: Record<GuestAction, GuestActionCopy> = {
  post: {
    title: "Para publicar necesitás una cuenta",
    body: "Pedí ayuda con una duda puntual o compartí un apunte con toda la comunidad.",
  },
  reply: {
    title: "Para responder necesitás una cuenta",
    body: "Contestá dudas, sumá marcas de «Esto me sirvió» y ganá lugar en el podio de tutores.",
  },
  helpful: {
    title: "Para marcar «Esto me sirvió» necesitás una cuenta",
    body: "Tu marca ayuda a que la mejor respuesta llegue a lo más alto de la publicación.",
  },
  thread: {
    title: "Para ver el hilo completo necesitás una cuenta",
    body: "Adentro ves todas las respuestas, los adjuntos y quién escribió cada una.",
  },
  book: {
    title: "Para reservar una clase necesitás una cuenta",
    body: "Elegís un horario con el tutor y tu turno queda retenido 15 minutos para completar el pago.",
  },
  podium: {
    title: "Para ver el podio completo necesitás una cuenta",
    body: "Ahí está el ranking mensual de tutores y, si sos tutor, tu puesto.",
  },
};
