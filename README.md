# KnowLink Frontend

Aplicación web para la plataforma KnowLink, construida con React 19 + TypeScript + Vite.

## Requisitos

- Node.js 20+
- npm 10+

## Configuración del entorno

| Variable                        | Descripción                                             | Valor por defecto       |
| ------------------------------- | ------------------------------------------------------- | ----------------------- |
| `VITE_BACKEND_URL`              | URL base del backend                                    | `http://localhost:8080` |
| `VITE_BOOKING_REALTIME_ENABLED` | Activa SSE y comandos reales de hold/reserva/liberación | `false`                 |

### Booking realtime

El módulo de booking usa SSE y comandos de hold/reserva/liberación y espera estos contratos de backend:

- `GET /api/v1/tutors/{tutorId}/booking-slots/events` as an SSE stream. Each `data:` message is JSON with `{ "slotId": string, "status": "AVAILABLE" | "BLOCKED" | "RESERVED", "windowStart": string, "windowEnd": string }`. `slotId` identifies the calendar availability block.
- `POST /api/v1/tutors/{tutorId}/booking-slots/hold` with `{ slotId, start, end }`.
- `DELETE /api/v1/tutors/{tutorId}/booking-slots/hold` with the same fields in the request body.
- `POST /api/v1/bookings` with `{ bookingSlotId, tutorSubjectId, topic, modality, tutorId, start, end }`.

The browser applies `BLOCKED` optimistically when a student selects a window. A successful booking publishes `RESERVED`; expiry or cancellation publishes `AVAILABLE`. SSE remains the authoritative cross-user update, and the client reconnects three seconds after an interrupted stream.

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

El dev server tiene proxy configurado: `/api` y `/auth` se redirigen automáticamente al backend.

## Scripts disponibles

| Comando                 | Descripción                                |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Servidor de desarrollo (puerto 5173)       |
| `npm run build`         | Build de producción                        |
| `npm run preview`       | Vista previa del build de producción       |
| `npm run lint`          | Ejecutar ESLint                            |
| `npm run lint:fix`      | Corregir errores de ESLint automáticamente |
| `npm run format`        | Formatear con Prettier                     |
| `npm run format:check`  | Verificar formato sin modificar            |
| `npm run type-check`    | Verificar tipos con TypeScript             |
| `npm run test`          | Ejecutar tests con Vitest                  |
| `npm run test:watch`    | Ejecutar tests en modo watch               |
| `npm run test:coverage` | Generar reporte de cobertura               |

## Docker

```bash
docker build -t knowlink-frontend .
docker run -p 80:80 knowlink-frontend
```

## Estructura del proyecto

```
src/
├── modules/              # Módulos de dominio
│   ├── auth/
│   │   ├── api/          # Llamadas HTTP
│   │   ├── components/   # Componentes del módulo
│   │   ├── hooks/        # Custom hooks + Zustand stores
│   │   ├── interfaces/   # Tipos TypeScript (requests/responses)
│   │   ├── pages/        # Páginas del módulo
│   │   └── schemas/      # Esquemas de validación Zod
│   └── users/
├── providers/            # Providers globales (QueryClient, Router, etc.)
├── routes/               # Definición de rutas
└── shared/               # Código compartido
    ├── hooks/            # Hooks globales (Zustand stores)
    ├── interfaces/       # Interfaces compartidas
    ├── lib/              # Librerías configuradas (httpClient, constants)
    └── utils/            # Funciones utilitarias
```

## Tecnologías

| Tecnología               | Uso                      |
| ------------------------ | ------------------------ |
| React 19 + TypeScript    | Framework                |
| Vite 6                   | Bundler                  |
| TanStack Query v5        | Data fetching            |
| Zustand v5               | Estado global            |
| MUI v7                   | Componentes UI           |
| react-hook-form + zod    | Formularios y validación |
| Axios                    | HTTP client              |
| Vitest + Testing Library | Tests                    |
| ESLint 9 + Prettier 3    | Linting y formateo       |
