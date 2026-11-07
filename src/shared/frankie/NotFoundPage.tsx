import { useNavigate } from "react-router-dom";
import AppButton from "@/shared/components/AppButton";
import FrankieErrorPage from "@/shared/frankie/FrankieErrorPage";
import { ERROR_PAGE_COPY } from "@/shared/frankie/frankie.copy";

interface NotFoundPageProps {
  /** Dentro de un layout (menú + barra superior), sin ocupar toda la pantalla. */
  embedded?: boolean;
}

/** Página inexistente: Frankie se perdió, pero sabe cómo volver. */
export default function NotFoundPage({ embedded = false }: NotFoundPageProps) {
  const navigate = useNavigate();
  const copy = ERROR_PAGE_COPY.notFound;

  return (
    <FrankieErrorPage
      embedded={embedded}
      mood="thinking"
      accessories={["question"]}
      title={copy.title}
      message={copy.message}
      actions={
        <AppButton appVariant="primary" onClick={() => navigate("/", { replace: true })}>
          {copy.home}
        </AppButton>
      }
    />
  );
}
