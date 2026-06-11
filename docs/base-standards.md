# KnowLink Frontend — Estándares del proyecto

## Contexto

KnowLink es una plataforma de tutorías académicas que conecta alumnos con tutores.
Este repositorio es la **aplicación web** del sistema.

- Repo frontend: https://github.com/TetraCodeTeam/knowlink-frontend
- Repo backend: https://github.com/TetraCodeTeam/knowlink-backend
- Dev server: http://localhost:5173
- Backend (dev): http://localhost:8080 (proxy configurado en Vite)

---

## Stack exacto

### Dependencias de producción

| Paquete | Versión | Uso |
|---|---|---|
| react + react-dom | ^19.0.0 | Framework |
| typescript | ^5.7.2 | Tipado |
| vite | ^6.3.5 | Bundler y dev server |
| @tanstack/react-query | ^5.89.0 | Data fetching y caché de servidor |
| @tanstack/react-query-devtools | ^5.89.0 | DevTools de React Query |
| zustand | ^5.0.8 | Estado global del cliente |
| @mui/material + @mui/icons-material | ^7.3.7 | Componentes UI base |
| @emotion/react + @emotion/styled | ^11.x | Motor de estilos de MUI |
| react-hook-form | ^7.63.0 | Manejo de formularios |
| @hookform/resolvers | ^5.2.2 | Integración zod con react-hook-form |
| zod | ^4.1.12 | Validación y schemas |
| axios | ^1.12.2 | HTTP client |
| react-router-dom | ^7.9.1 | Routing |
| sonner | ^2.0.7 | Notificaciones/toasts |
| lucide-react | ^0.577.0 | Íconos |
| react-icons | ^5.6.0 | Íconos adicionales |

### Herramientas de desarrollo

| Paquete | Uso |
|---|---|
| vitest ^3.0.5 | Test runner |
| @testing-library/react ^16.2.0 | Tests de componentes |
| @testing-library/user-event ^14.6.1 | Simulación de interacciones |
| @testing-library/jest-dom ^6.6.3 | Matchers de DOM |
| eslint ^9.0.0 + @typescript-eslint | Linting |
| prettier ^3.4.2 | Formateo de código |
| vite-tsconfig-paths ^5.1.4 | Alias `@/` en TypeScript |

---

## Configuración de Prettier (`.prettierrc.json`)

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Todo código generado debe respetar estas reglas: **doble comilla**, **punto y coma**, **trailing comma ES5**, **líneas máximo 100 chars**, **2 espacios** de indentación.

---

## Alias de imports

El alias `@/` apunta a `src/`. Usar siempre en lugar de rutas relativas largas:

```ts
// ✅ Correcto
import { httpClient } from "@/shared/lib/httpClient";

// ❌ Incorrecto
import { httpClient } from "../../../shared/lib/httpClient";
```

---

## Proxy de desarrollo (vite.config.ts)

```
/api  → http://localhost:8080
/auth → http://localhost:8080
```

Los endpoints del backend se llaman sin CORS en desarrollo porque el proxy los redirige.

---

## Estructura del proyecto

```
src/
├── modules/                  # Módulos de dominio (uno por bounded context)
│   ├── auth/
│   │   ├── api/              # Funciones axios: loginUser(), registerUser(), etc.
│   │   ├── components/       # Componentes React del módulo (no páginas)
│   │   ├── hooks/            # useQuery/useMutation wrappers + Zustand stores del módulo
│   │   ├── interfaces/       # Types e interfaces TypeScript del módulo
│   │   ├── pages/            # Páginas (componentes mapeados a rutas)
│   │   └── schemas/          # Schemas Zod para validación de formularios
│   └── users/
│       └── (misma estructura)
├── providers/                # Providers globales: QueryClientProvider, RouterProvider, etc.
├── routes/                   # Definición de rutas con react-router-dom v7
└── shared/
    ├── hooks/                # Hooks y Zustand stores de uso global
    ├── interfaces/           # Interfaces TypeScript compartidas entre módulos
    ├── lib/                  # Configuraciones: instancia Axios (httpClient), constantes
    └── utils/                # Funciones utilitarias puras
```

---

## Convenciones de código

### Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `TutorCard`, `LoginForm` |
| Hooks custom | camelCase con `use` | `useAuthStore`, `useTutores` |
| Funciones API | camelCase con verbo | `getTutores`, `createReserva`, `loginUser` |
| Interfaces / Types | PascalCase, sin prefijo `I` | `Usuario`, `ReservaResponse` |
| Schemas Zod | camelCase con sufijo `Schema` | `loginSchema`, `crearReservaSchema` |
| Archivos | kebab-case | `tutor-card.tsx`, `login-page.tsx`, `use-auth-store.ts` |
| Archivos de barrel | `index.ts` en cada capa |  |

### Flujo de datos obligatorio

```
api/ (axios) → hooks/ (useQuery/useMutation) → components/ o pages/
```

Nunca llamar axios directamente en un componente o página.

### Estado

| Tipo de estado | Librería | Ubicación |
|---|---|---|
| Datos del servidor (API) | TanStack Query (`useQuery`, `useMutation`) | `hooks/` del módulo |
| Estado del cliente (UI, sesión, carrito) | Zustand store | `hooks/` del módulo o `shared/hooks/` |
| Estado de formulario | react-hook-form | dentro del componente de formulario |

No usar `useEffect` + `useState` para fetch de datos — usar `useQuery`.

### Formularios

Siempre `react-hook-form` con resolver Zod:

```ts
// schemas/loginSchema.ts
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// En el componente:
const { register, handleSubmit } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

### Estilos

- **MUI** para estructura, layout, dialogs, inputs, navegación
- **Tailwind** para utilidades de espaciado, colores específicos, ajustes rápidos
- No usar `style={{}}` inline salvo casos absolutamente excepcionales

### TypeScript

- No usar `any` bajo ningún concepto
- Tipos de respuestas de API en `interfaces/` del módulo correspondiente
- Inferir tipos desde schemas Zod (`z.infer<typeof schema>`)

---

## Variables de entorno

Prefijo obligatorio `VITE_` para que sean accesibles en el cliente:

```
VITE_BACKEND_URL=http://localhost:8080   # única variable actual
```

Acceso en código: `import.meta.env.VITE_BACKEND_URL`

---

## Scripts

```bash
npm install               # Instalar dependencias
npm run dev               # Dev server en puerto 5173
npm run build             # Build de producción (tsc -b && vite build)
npm run lint              # ESLint (0 warnings permitidos)
npm run lint:fix          # Corregir automáticamente
npm run format            # Prettier en src/**/*.{ts,tsx,css}
npm run format:check      # Verificar formato sin modificar
npm run type-check        # tsc --noEmit
npm run test              # Vitest (modo run, una sola vez)
npm run test:watch        # Vitest en modo watch
npm run test:coverage     # Reporte de cobertura con v8
```
