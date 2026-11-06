import { Component, type ErrorInfo, type ReactNode } from "react";
import AppButton from "@/shared/components/AppButton";
import FrankieErrorPage from "@/shared/frankie/FrankieErrorPage";
import { ERROR_PAGE_COPY } from "@/shared/frankie/frankie.copy";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Red de seguridad de toda la app: si un componente falla al renderizar, en lugar de una pantalla
 * en blanco el usuario ve a Frankie explicando que no fue su culpa y ofreciéndole reintentar.
 */
export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error inesperado en la interfaz", error, info.componentStack);
  }

  private retry = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;

    const copy = ERROR_PAGE_COPY.crash;
    return (
      <FrankieErrorPage
        mood="sad"
        title={copy.title}
        message={copy.message}
        actions={
          <>
            <AppButton appVariant="primary" onClick={this.retry}>
              {copy.retry}
            </AppButton>
            <AppButton appVariant="outline" onClick={() => window.location.reload()}>
              {copy.reload}
            </AppButton>
          </>
        }
      />
    );
  }
}
