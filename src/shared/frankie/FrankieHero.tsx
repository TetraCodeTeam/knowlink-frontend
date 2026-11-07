import Frankie, { type FrankieProps } from "@/shared/frankie/Frankie";

/**
 * Frankie al frente de un diálogo: reemplaza al clásico círculo con ícono. Un solo tamaño y
 * separación para que todos los diálogos se vean iguales.
 */
export default function FrankieHero({
  size = 128,
  style,
  ...rest
}: Omit<FrankieProps, "crop" | "entrance">) {
  return <Frankie {...rest} size={size} entrance style={{ marginBottom: 8, ...style }} />;
}
