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
│   │   ├── interfaces/
│   │   │   ├── requests/     # Un archivo por tipo de request
│   │   │   └── responses/    # Un archivo por tipo de response
│   │   ├── pages/            # Páginas (componentes mapeados a rutas)
│   │   └── schemas/          # Schemas Zod para validación de formularios
│   ├── users/
│   │   └── (misma estructura)
│   └── tutor/
│       └── availability/     # Submódulos anidados cuando el dominio lo justifica
│           ├── api/          # Un archivo por recurso, no un único archivo por módulo
│           ├── components/
│           ├── constants/    # Datos de dominio: labels, colores, mapeos fijos
│           ├── hooks/
│           ├── interfaces/
│           │   ├── requests/
│           │   └── responses/
│           ├── pages/
│           ├── styles/       # SxProps<Theme> reutilizables para componentes complejos
│           └── utils/        # Funciones puras (fechas, formateo, comparaciones)
├── providers/                # Providers globales: QueryClientProvider, RouterProvider, etc.
├── routes/                   # Definición de rutas con react-router-dom v7
└── shared/
    ├── components/           # Componentes reutilizables entre módulos: AppButton, AppConfirmDialog
    ├── hooks/                # Hooks y Zustand stores de uso global
    ├── interfaces/           # Interfaces TypeScript compartidas entre módulos
    ├── lib/                  # Configuraciones: instancia Axios (httpClient), constantes
   ├── styles/                # SxProps<Theme> compartidos: buttonSx.ts, etc.
    └── utils/                # Funciones utilitarias puras
```

Los tipos de request/response van en archivos individuales dentro de
`interfaces/requests/` e `interfaces/responses/`, importados directo
desde su archivo (`import type { X } from ".../interfaces/requests/x.interface"`).
No se usa el patrón de barrel (`index.ts`) para reexportar estos tipos.

La forma de estos tipos no es una decisión libre del frontend: debe
reflejar exactamente el contrato que expone el backend (los `record` de
`requests`/`responses` en los controllers). Si el backend cambia un
campo (nombre, tipo, opcionalidad), el archivo correspondiente en
`interfaces/requests/` o `interfaces/responses/` se actualiza para
seguirlo — no al revés. Ante cualquier duda sobre la forma real de un
endpoint, confirmar contra el DTO del backend (o la respuesta real en
Network) antes de tipar a ciegas.

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
| Archivos de componentes | PascalCase | `TutorCard.tsx`, `LoginForm.tsx`, `AvailabilityEditor.tsx` |
| Archivos que no son componentes | kebab-case | `tutor.api.ts`, `use-auth-store.ts`, `login.schema.ts` |

### Flujo de datos obligatorio

```
api/ (axios) → hooks/ (useQuery/useMutation) → components/ o pages/
```

Nunca llamar axios directamente en un componente o página.

Dentro de cada módulo, todos los endpoints que use ese módulo van en
**un único archivo** `<modulo>.api.ts` dentro de `api/` — no un archivo
por endpoint ni por recurso. Ejemplo: `auth/api/auth.api.ts` contiene
`loginUser`, `registerUser`, `checkAvailability`, etc., todos juntos.

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

---

### Estilos

- **MUI** para estructura, layout, dialogs, inputs, navegación
- No usar `style={{}}` inline salvo casos absolutamente excepcionales

### Componentes de terceros con estado interno pesado (ej. FullCalendar)

Para componentes de librerías externas que recalculan su estado interno
cuando cambia la *referencia* de sus props (no solo el valor):

- Toda configuración que no dependa de una variable va como constante
  fuera del componente (no recreada en cada render).
- Toda configuración que sí dependa de una variable va envuelta en
  `useMemo`.
- Todo callback pasado como prop va envuelto en `useCallback`.

Un objeto/función recreado en cada render puede disparar comportamiento
inesperado en la librería (ej. reseteo de estado, refetch innecesario)
aunque el valor no haya cambiado realmente.

Si estas constantes de configuración crecen mucho, extraerlas a
`<Componente>.config.ts` en la misma carpeta del componente — no a
`constants/`, que se reserva para datos de dominio reutilizables entre
componentes, no para configuración de una librería externa.

### TypeScript

- No usar `any` bajo ningún concepto
- Tipos de respuestas de API en `interfaces/` del módulo correspondiente
- Inferir tipos desde schemas Zod (`z.infer<typeof schema>`)

---

### Manejo de errores de API

El campo `message` de la respuesta de error del backend es siempre texto
seguro para mostrar directo al usuario (ver estándar de backend, sección
"Manejo de errores"). Leerlo así, sin inventar texto propio salvo como
respaldo final si la API no responde con el formato esperado:

```typescript
catch (error: unknown) {
  const message =
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
    "Texto genérico de respaldo si la API no responde con el formato esperado.";
  toast.error(message); // o setError() si es un campo de formulario
}
```

No usar `alert()`. Errores generales van con `toast.error` (sonner);
errores de un campo específico de un formulario van con `setError` de
react-hook-form.

---

### Componentes compartidos reutilizables

Ubicación: `shared/components/`. Antes de escribir un botón, diálogo de
confirmación, o similar dentro de un módulo, revisar si ya existe una
versión genérica en `shared/components/` (ej. `AppButton`,
`AppConfirmDialog`) y extenderla en vez de duplicar estilos o lógica.

- `AppButton`: variantes de color (`appVariant`) centralizadas en
  `shared/styles/buttonSx.ts`. Nunca definir colores de botón con `sx`
  inline en un componente de módulo.
- `AppConfirmDialog`: diálogos de confirmación con severidad
  (`warning`/`danger`) centralizan ícono y color — no pasar un ícono
  custom por prop salvo necesidad real de un ícono distinto al estándar.

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
