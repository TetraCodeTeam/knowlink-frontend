import type { CommunityAuthor } from "@/modules/community/interfaces/responses/community-author.interface";
import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";

/**
 * Contenido ilustrativo de la comunidad para la landing. Son personas y publicaciones ficticias: la landing
 * es pública y la comunidad real solo se ve con sesión, así que no se consulta al backend.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const student = (id: string, fullName: string, careerName: string): CommunityAuthor => ({
  userId: `demo-${id}`,
  fullName,
  role: "STUDENT",
  profilePictureUrl: null,
  careerName,
  averageRating: null,
  verified: false,
  canBookClass: false,
});

const tutor = (
  id: string,
  fullName: string,
  careerName: string,
  averageRating: number
): CommunityAuthor => ({
  userId: `demo-${id}`,
  fullName,
  role: "TUTOR",
  profilePictureUrl: null,
  careerName,
  averageRating,
  verified: true,
  canBookClass: true,
});

const AUTHORS = {
  lucia: student("lucia", "Lucía Fernández", "Ingeniería en Sistemas"),
  martina: student("martina", "Martina Rossi", "Ingeniería Química"),
  valentina: student("valentina", "Valentina Cruz", "Ingeniería en Sistemas"),
  nicolas: student("nicolas", "Nicolás Ibarra", "Licenciatura en Administración"),
  agustina: student("agustina", "Agustina Luna", "Ingeniería en Sistemas"),
  joaquin: student("joaquin", "Joaquín Paz", "Contador Público"),
  sofia: tutor("sofia", "Lic. Sofía Albarracín", "Ingeniería en Sistemas", 4.9),
  julian: tutor("julian", "Prof. Julián Méndez", "Matemática", 4.9),
  mateo: tutor("mateo", "Mateo Rivas", "Ingeniería Química", 5.0),
};

export interface DemoTutor {
  author: CommunityAuthor;
  subjects: string;
}

/** Tutores del podio de ejemplo. */
export const DEMO_TUTORS: DemoTutor[] = [
  { author: AUTHORS.sofia, subjects: "Algoritmos & Estructuras de Datos" },
  { author: AUTHORS.julian, subjects: "Álgebra & Análisis Matemático" },
  { author: AUTHORS.mateo, subjects: "Fisicoquímica & Química" },
];

type DemoPostInput = Pick<
  CommunityPost,
  "postId" | "type" | "status" | "title" | "content" | "author" | "replyCount" | "helpfulCount"
> & {
  subject: string;
  ageMs: number;
  featuredBy?: { author: CommunityAuthor; excerpt: string; helpfulCount: number; ageMs: number };
};

const DEMO_POSTS: DemoPostInput[] = [
  {
    postId: "demo-1",
    type: "HELP_REQUEST",
    status: "OPEN",
    subject: "Álgebra",
    title: "¿Cómo diagonalizo una matriz con autovalores repetidos?",
    content:
      "Estoy trabada con el ejercicio 4b de la guía 3. Obtengo $λ = 2$ con multiplicidad algebraica 2, pero solo un autovector linealmente independiente. ¿Eso significa que **no es diagonalizable** o calculé mal el núcleo de (A - 2I)?",
    author: AUTHORS.lucia,
    replyCount: 4,
    helpfulCount: 3,
    ageMs: 25 * MINUTE,
  },
  {
    postId: "demo-2",
    type: "SHARED_CONTENT",
    status: "OPEN",
    subject: "Algoritmos",
    title: "Guía rápida para no confundir Big-O, Big-Omega y Big-Theta",
    content:
      "Un error súper frecuente antes de los parciales es usar O() para cotas ajustadas. Una regla mnemotécnica: **Big-O** es el techo, **Big-Omega** es el piso y **Big-Theta** es cuando coinciden. Si podés demostrar las dos cotas, decí Theta y listo.",
    author: AUTHORS.sofia,
    replyCount: 7,
    helpfulCount: 18,
    ageMs: 2 * HOUR,
  },
  {
    postId: "demo-3",
    type: "HELP_REQUEST",
    status: "RESOLVED",
    subject: "Análisis Matemático",
    title: "Duda con el cambio de variables a coordenadas cilíndricas en una integral triple",
    content:
      "¿Por qué en este cono $z = sqrt(x^2 + y^2)$ el jacobiano se incluye siempre antes de integrar dz dr dθ? ¡Ya me quedó claro gracias a la explicación de abajo!",
    author: AUTHORS.martina,
    replyCount: 3,
    helpfulCount: 5,
    ageMs: 3 * HOUR,
    featuredBy: {
      author: AUTHORS.julian,
      excerpt:
        "El factor $r$ surge del determinante de la matriz jacobiana al pasar del elemento de área cartesiano (dx dy) al polar (r dr dθ). Al proyectar la sombra del cono sobre el plano XY, la deformación métrica depende del radio.",
      helpfulCount: 5,
      ageMs: 2 * HOUR,
    },
  },
  {
    postId: "demo-4",
    type: "SHARED_CONTENT",
    status: "OPEN",
    subject: "Programación",
    title: "Mis apuntes de Java: colecciones y streams, con ejemplos",
    content:
      "Armé un resumen con las colecciones más usadas (List, Set, Map), su complejidad y los métodos de streams equivalentes a los bucles clásicos. Espero que les sirva para el final.",
    author: AUTHORS.valentina,
    replyCount: 2,
    helpfulCount: 4,
    ageMs: 5 * HOUR,
  },
  {
    postId: "demo-5",
    type: "HELP_REQUEST",
    status: "OPEN",
    subject: "Contabilidad",
    title: "¿Cómo se registra una amortización en el libro diario?",
    content:
      "Tengo que registrar la amortización anual de un rodado y no tengo claro qué cuenta va al debe y cuál al haber. ¿Alguien me da una mano con el asiento?",
    author: AUTHORS.nicolas,
    replyCount: 0,
    helpfulCount: 0,
    ageMs: 1 * DAY,
  },
  {
    postId: "demo-6",
    type: "HELP_REQUEST",
    status: "RESOLVED",
    subject: "Estructuras de Datos",
    title: "¿Cuándo conviene una tabla hash en lugar de un árbol AVL?",
    content:
      "Para la cátedra tengo que justificar la estructura de un diccionario de 100.000 palabras. Sé que el hash es O(1) promedio y el AVL O(log n), pero ¿qué otros criterios debería considerar?",
    author: AUTHORS.agustina,
    replyCount: 2,
    helpfulCount: 4,
    ageMs: 2 * DAY,
    featuredBy: {
      author: AUTHORS.sofia,
      excerpt:
        "Criterios clave: **orden** (el AVL permite recorrer ordenado y buscar rangos; el hash no), **memoria** y **peor caso** (el hash puede degradarse a O(n) con colisiones). Para un diccionario sin rangos, el hash gana.",
      helpfulCount: 4,
      ageMs: 2 * DAY - 40 * MINUTE,
    },
  },
  {
    postId: "demo-7",
    type: "HELP_REQUEST",
    status: "OPEN",
    subject: "Costos",
    title: "Cómo calcular el punto de equilibrio con varios productos",
    content:
      "Con un solo producto el punto de equilibrio es directo, pero con tres productos y costos fijos compartidos no sé cómo ponderar el margen de contribución.",
    author: AUTHORS.joaquin,
    replyCount: 2,
    helpfulCount: 1,
    ageMs: 3 * DAY,
  },
];

/** Arma las publicaciones de ejemplo con fechas relativas a `now`, para que siempre se vean recientes. */
export function createDemoPosts(now: number): CommunityPost[] {
  const iso = (ageMs: number) => new Date(now - ageMs).toISOString();

  return DEMO_POSTS.map(({ subject, ageMs, featuredBy, ...rest }) => ({
    ...rest,
    subject: { subjectId: `demo-subject-${subject}`, name: subject },
    attachment: null,
    createdAt: iso(ageMs),
    resolvedAt: featuredBy ? iso(featuredBy.ageMs) : null,
    featuredReply: featuredBy
      ? {
          replyId: `${rest.postId}-featured`,
          author: featuredBy.author,
          excerpt: featuredBy.excerpt,
          helpfulCount: featuredBy.helpfulCount,
          createdAt: iso(featuredBy.ageMs),
        }
      : null,
    ownedByMe: false,
    edited: false,
    canReply: rest.status === "OPEN",
  }));
}
