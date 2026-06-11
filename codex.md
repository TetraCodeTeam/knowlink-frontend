# KnowLink Frontend

> **Lee primero:** [`docs/base-standards.md`](docs/base-standards.md)

---

## Contexto rápido para ChatGPT

**Proyecto:** App web de KnowLink — plataforma de tutorías académicas  
**Stack:** React 19 · TypeScript 5.7 · Vite 6 · TanStack Query v5 · Zustand v5 · MUI v7 · Tailwind CSS v4 · react-hook-form v7 · Zod v4 · Axios v1 · react-router-dom v7 · sonner · lucide-react  
**Alias:** `@/` → `src/`

### Estructura de módulo

```
src/modules/{modulo}/
├── api/          # funciones axios, una por endpoint
├── hooks/        # useQuery/useMutation wrappers + Zustand stores
├── components/   # componentes React del módulo
├── pages/        # páginas mapeadas a rutas
├── interfaces/   # tipos TypeScript del módulo
└── schemas/      # schemas Zod
```

### Reglas no negociables

1. HTTP solo en `api/` usando `@/shared/lib/httpClient`
2. Data fetching con TanStack Query en `hooks/`, nunca `useEffect`+`fetch` en componentes
3. Formularios con `react-hook-form` + `zodResolver`, schema en `schemas/`
4. No `any` en TypeScript
5. Imports con `@/` siempre que sea posible
6. Prettier: doble comilla, punto y coma, printWidth 100, 2 espacios, LF
