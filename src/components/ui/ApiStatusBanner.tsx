import type { ApiStatus } from "@/hooks/useApiHealth";
import clsx from "clsx";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

interface ApiStatusBannerProps {
  status: ApiStatus;
  lastCheckedAt: Date | null;
  onRetry: () => void;
  className?: string;
}

export function ApiStatusBanner({
  status,
  lastCheckedAt,
  onRetry,
  className,
}: ApiStatusBannerProps) {
  if (status === "online") return null;

  const isOffline = status === "offline";

  return (
    <div
      role="alert"
      className={clsx(
        "flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border p-4",
        isOffline
          ? "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200"
          : "bg-neutral-50 border-neutral-200 text-neutral-700 dark:bg-neutral-800/60 dark:border-neutral-700 dark:text-neutral-200",
        className,
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        {isOffline ? (
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        ) : (
          <Loader2 className="w-5 h-5 text-neutral-500 dark:text-neutral-400 animate-spin shrink-0" />
        )}

        <div className="flex-1 text-sm">
          {isOffline ? (
            <>
              <p className="font-semibold">Servidor offline</p>
              <p className="text-xs opacity-90">
                Não conseguimos conectar à API. Verifique sua conexão e tente
                novamente.
                {lastCheckedAt && (
                  <>
                    {" "}
                    Última verificação às{" "}
                    {lastCheckedAt.toLocaleTimeString("pt-BR")}.
                  </>
                )}
              </p>
            </>
          ) : (
            <p>Verificando disponibilidade do servidor...</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        disabled={status === "checking"}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          isOffline
            ? "bg-amber-600 text-white hover:bg-amber-700"
            : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600",
        )}
      >
        <RefreshCw
          className={clsx("w-4 h-4", status === "checking" && "animate-spin")}
        />
        Tentar novamente
      </button>
    </div>
  );
}

export function ApiStatusDot({ status }: { status: ApiStatus }) {
  const map = {
    checking: {
      label: "Verificando API",
      color: "bg-amber-400",
      pulse: "animate-pulse",
    },
    online: {
      label: "API online",
      color: "bg-emerald-500",
      pulse: "",
    },
    offline: {
      label: "API offline",
      color: "bg-red-500",
      pulse: "animate-pulse",
    },
  } as const;

  const { label, color, pulse } = map[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400"
      title={label}
    >
      <span className={clsx("w-2 h-2 rounded-full", color, pulse)} />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

export function ApiOnlineToastIcon() {
  return <CheckCircle2 className="w-5 h-5" />;
}
