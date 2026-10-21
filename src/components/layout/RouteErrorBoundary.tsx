import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[RouteErrorBoundary]", error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleHome = () => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-6 text-center
                        bg-neutral-50 dark:bg-neutral-900"
        >
          <div
            className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40
                          flex items-center justify-center mb-4"
          >
            <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
            Algo deu errado
          </h1>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
            {this.state.error?.message ??
              "Ocorreu um erro inesperado ao carregar esta página."}
          </p>

          {import.meta.env.DEV && this.state.error?.stack && (
            <pre
              className="text-xs text-left text-red-700 dark:text-red-300
                            bg-red-50 dark:bg-red-950/40 rounded-lg p-4 mb-6
                            max-w-2xl max-h-64 overflow-auto whitespace-pre-wrap"
            >
              {this.state.error.stack}
            </pre>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold
                         hover:bg-primary-700 transition"
            >
              Recarregar página
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="px-6 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700
                         text-primary-900 dark:text-primary-100 font-semibold
                         hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
