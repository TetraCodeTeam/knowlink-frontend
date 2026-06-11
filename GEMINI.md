# KnowLink Frontend

> **Lee primero:** [`docs/base-standards.md`](docs/base-standards.md)

---

## Contexto para Gemini

**Proyecto:** App web de KnowLink — plataforma de tutorías académicas  
**Stack:** React 19 · TypeScript 5.7 · Vite 6 · TanStack Query v5 · Zustand v5 · MUI v7 · Tailwind CSS v4 · react-hook-form v7 · Zod v4 · Axios v1 · react-router-dom v7 · sonner · lucide-react  
**Alias `@/`** apunta a `src/`

### Convenciones críticas

- Estructura de módulos fija: `api/` → `hooks/` → `components/` / `pages/` / `interfaces/` / `schemas/`
- HTTP solo a través de `@/shared/lib/httpClient` (instancia Axios), nunca directo en componentes
- Data fetching: `useQuery`/`useMutation` de TanStack Query en `hooks/`, no `useEffect`
- Formularios: `react-hook-form` + `zodResolver` — schema Zod en `schemas/`, tipo inferido con `z.infer<>`
- Estado servidor → TanStack Query; estado cliente → Zustand
- No `any` en TypeScript
- Prettier: doble comilla, punto y coma, `printWidth: 100`, 2 espacios, LF

Consultar `docs/base-standards.md` para versiones exactas, ejemplos de código y estructura completa.
