# KnowLink Frontend

> **Lee primero:** [`docs/base-standards.md`](docs/base-standards.md)

---

## Reglas para GitHub Copilot

### Flujo de capas — no saltear ninguna

```
src/modules/{modulo}/api/       → función axios (ej: getTutores)
src/modules/{modulo}/hooks/     → useQuery/useMutation wrapper (ej: useTutores)
src/modules/{modulo}/components/ o pages/ → consume el hook
```

### Lo que siempre debe hacer

- Imports con alias `@/` (ej: `import { httpClient } from "@/shared/lib/httpClient"`)
- HTTP solo a través de `shared/lib/httpClient` (instancia Axios configurada)
- Formularios: `react-hook-form` + `zodResolver` con schema en `schemas/`
- Estado servidor: `useQuery` / `useMutation` de TanStack Query
- Estado cliente: Zustand store en `hooks/` del módulo o `shared/hooks/`
- Tipos inferidos de Zod: `z.infer<typeof miSchema>`
- Toasts: `sonner`
- El código implementado (clases, métodos, variables, comentarios y logs) debe estar escrito en inglés, a excepción de los mensajes de texto dirigidos al usuario final (errores de validación, notificaciones, contenido de UI).
- Las interfaces (props, tipos de datos, etc.) no deben declararse dentro del archivo del componente. Deben definirse en archivos separados (por ejemplo ComponentName.types.ts o dentro de una carpeta types/) y luego importarse en el componente.

### Lo que nunca debe hacer

- `useEffect` + `axios`/`fetch` directo para cargar datos del servidor
- `any` en TypeScript
- Llamar axios directamente en componentes o páginas
- `style={{}}` inline salvo casos extremos
- Crear en `shared/` algo que solo usa un módulo

### Prettier (respetar al generar)

```
doble comilla · punto y coma · trailing comma ES5 · printWidth 100 · 2 espacios · LF
```

### Convención de commits

```
feat: descripción en español
fix: descripción en español
style: cambios de estilos/formato
refactor: sin nueva funcionalidad
test: tests
ci: pipeline
docs: documentación
perf: mejoras de rendimiento
build: cambios de compilación o dependencias
chore: tareas de mantenimiento
```
