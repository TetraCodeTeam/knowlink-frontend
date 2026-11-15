# Spec frontend: el tutor no paga comisión (opción B)

Repo: `TetraCodeTeam/knowlink-frontend` · rama base: `dev` · leer primero `docs/base-standards.md`.
Depende del spec de backend `spec-backend-tutor-sin-comision.md`: ambos se despliegan juntos.

## 1. Contexto

La tarifa de servicio (3%) la paga solo el alumno. El tutor no paga comisión: recibe el precio completo de su clase (clase de $10.000 → el tutor ve $10.000). El backend deja de enviar `commissionPercentage` en las estadísticas del tutor, y el frontend debe dejar de mostrar "X% de comisión descontado", que ya no es verdad.

## 2. Cambios

### 2.1 Tipos
`src/modules/tutor/statistics/interfaces/responses/tutor-statistics.response.ts`
- Eliminar `commissionPercentage: number;` del tipo del resumen (línea ~21).
- Eliminar `commissionPercentage: number;` del tipo de fondos (línea ~52).

### 2.2 Tarjeta "Ingresos netos generados"
`src/modules/tutor/statistics/components/StatisticsSummaryCards.tsx` (líneas ~149-151)

Antes:
```tsx
<Typography sx={{ ...mutedTextSx, mt: 1 }}>
  Con el {summary.commissionPercentage}% de comisión ya descontado
</Typography>
```
Después:
```tsx
<Typography sx={{ ...mutedTextSx, mt: 1 }}>
  Es el precio de tus clases: la tarifa de servicio la paga el alumno
</Typography>
```
No cambiar la etiqueta ni la lógica de `value` (`summary.netIncome > 0 ? formatCurrency(...) : NO_VALUE`).

### 2.3 Tarjeta de estado de fondos
`src/modules/tutor/statistics/components/FundsStatusCard.tsx` (líneas ~71-74)

Antes:
```tsx
Montos netos registrados por KnowLink, con el {funds.commissionPercentage}% de comisión
descontado.
```
Después:
```tsx
Montos registrados por KnowLink. La tarifa de servicio la paga el alumno y no se descuenta de
tus ingresos.
```

### 2.4 Tests
- `test/modules/tutor/FundsStatusCard.test.tsx` (línea ~13): quitar `commissionPercentage: 3` del fixture. Si hay aserciones sobre el texto de comisión, reemplazarlas por el texto nuevo.
- Buscar otros fixtures o mocks: `grep -rn "commissionPercentage" src test`. Debe quedar en cero.
- Buscar tests del resumen (`StatisticsSummaryCards`) que aserten "% de comisión": `grep -rni "comisi" src test`.

### 2.5 Barrido de textos
`grep -rniE "comisi|retenci" src` y revisar cada resultado: borrar o reescribir todo texto que diga que al tutor se le descuenta una comisión o retención. No tocar textos de "Tarifa de servicio" del alumno.

## 3. Sin cambios (verificar solamente)

- `modules/student/booking/components/BookingCard.tsx` (línea ~218) ya muestra `Tarifa de servicio (3%)` al alumno con el total. Es el desglose correcto; no modificarlo.
- `SubjectPerformanceTable.tsx` conserva el encabezado "Ingresos netos" y `formatCurrency(subject.netIncome)`.
- `useBookingForm.ts` y `getBookingConfig` no cambian (`serviceFeeRate` sigue viniendo del backend).

## 4. Criterios de aceptación

1. Con una clase de $10.000 liberada, la tarjeta muestra `$10.000` y el texto "Es el precio de tus clases: la tarifa de servicio la paga el alumno".
2. La tarjeta de fondos ya no menciona ningún porcentaje de comisión.
3. `grep -rn "commissionPercentage" src test` no devuelve resultados.
4. `npm run lint`, `tsc --noEmit` y la suite de tests pasan.

## 5. Convenciones (de `CLAUDE.md`)
Imports con alias `@/`, sin `any`, Prettier (doble comilla, punto y coma, printWidth 100). Cambios mínimos: solo textos y tipos, sin lógica nueva.
