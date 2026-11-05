import { useEffect, useRef, useState } from "react";

/**
 * true la primera vez que el elemento entra en pantalla (y se queda en true). Se dispara con que asome un
 * poco, no con un porcentaje: un contenedor muy alto (la comunidad en un celular) nunca mostraría el 18 %.
 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
