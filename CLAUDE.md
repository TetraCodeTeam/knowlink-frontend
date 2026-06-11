# KnowLink Frontend

> **Lee primero:** [`docs/base-standards.md`](docs/base-standards.md)
> Contiene versiones exactas de dependencias, estructura de módulos, convenciones y ejemplos de código.

---

## Instrucciones específicas para Claude

### Antes de generar código

1. Identificar a qué módulo pertenece la tarea (`auth`, `users`, u otro a crear)
2. Identificar qué capa se está implementando: `api/` → `hooks/` → `components/` o `pages/`
3. Determinar si el estado involucrado es de servidor (TanStack Query) o de cliente (Zustand)
4. Verificar si el componente es reutilizable (`components/`) o es una página específica (`pages/`)

### Reglas de generación

- Imports con alias `@/` siempre (ej: `@/shared/lib/httpClient`)
- Llamadas HTTP solo en `api/`, usando la instancia Axios de `shared/lib/httpClient`
- Data fetching con `useQuery`/`useMutation` en `hooks/` — nunca `useEffect` + `fetch`/`axios` en componentes
- Formularios: siempre `react-hook-form` + `zodResolver` — schema en `schemas/`
- Toasts/notificaciones: usar `sonner`
- Íconos: preferir `lucide-react`, fallback `react-icons`
- Estilos: MUI para estructura, Tailwind para utilidades
- Prettier: doble comilla, punto y coma, printWidth 100, 2 espacios (ver `.prettierrc.json`)
- No `any` en TypeScript

### Cuándo pedir aclaraciones

Preguntar antes de implementar si no está claro:
- Si el nuevo componente va en `shared/` (genuinamente reutilizable) o en el módulo específico
- Qué datos vienen del backend vs qué es estado local de UI
- Si la ruta es pública o requiere auth

### Contexto del equipo

Proyecto académico grupal desarrollado con múltiples IAs (Claude, Copilot, ChatGPT, Gemini). Todos los agentes apuntan a los mismos estándares en `docs/base-standards.md` para mantener consistencia entre integrantes del equipo.
