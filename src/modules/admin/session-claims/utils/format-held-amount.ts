const ARS_FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formatea el monto retenido en pesos argentinos, sin centavos. */
export function formatHeldAmount(amount: number): string {
  return ARS_FORMATTER.format(amount);
}
