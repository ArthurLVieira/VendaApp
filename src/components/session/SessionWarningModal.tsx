import clsx from "clsx";
import { Modal } from "../ui/Modal";
import { AlertTriangle, Clock, LogOut, RefreshCcw } from "lucide-react";
import { Button } from "../ui/Button";

const TOTAL_MS = 60_000;

interface Props {
  open: boolean;
  remainingMs: number;
  refreshing: boolean;
  onContinue: () => void;
  onLogout: () => void;
  onMinimize: () => void;
}

export function SessionWarningModal({
  open,
  remainingMs,
  refreshing,
  onContinue,
  onLogout,
  onMinimize,
}: Props) {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const percent = Math.max(0, Math.min(100, (remainingMs / TOTAL_MS) * 100));

  const isCritical = seconds <= 15;
  const isUrgent = seconds <= 30;

  const barColor = isCritical
    ? "bg-red-600 animate-pulse"
    : isUrgent
      ? "bg-red-500"
      : seconds <= 45
        ? "bg-orange-500"
        : "bg-amber-500";

  const iconBg = isCritical
    ? "bg-red-100 dark:bg-red-950/40 animate-pulse"
    : isUrgent
      ? "bg-red-100 dark:bg-red-950/40"
      : "bg-amber-100 dark:bg-amber-950/40";

  const iconColor =
    isCritical || isUrgent
      ? "text-red-600 dark:text-red-400"
      : "text-amber-600 dark:text-amber-400";

  const secondsColor = isCritical
    ? "text-red-600 dark:text-red-400"
    : isUrgent
      ? "text-red-500 dark:text-red-400"
      : "text-amber-600 dark:text-amber-400";

  return (
    <Modal open={open} onClose={onMinimize} size="sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={clsx(
            "w-14 h-14 rounded-full flex",
            "items-center justify-center mb-4 transition-all",
            iconBg,
          )}
        >
          <AlertTriangle
            className={clsx("w-7 h-7 transition-colors", iconColor)}
          />
        </div>

        <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
          Sua sessão está expirando
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Por segurança, você será desconectado em instantes. Deseja continuar
          conectado?
        </p>

        <div className="w-full mb-6">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Tempo restante
            </span>
            <span
              className={clsx(
                "tabular-nums font-bold transition-colors",
                secondsColor,
              )}
            >
              {seconds}s
            </span>
          </div>

          <div
            className={clsx(
              "h-2 w-full rounded-full bg-neutral-200",
              "dark:bg-neutral-700 overflow-hidden",
            )}
          >
            <div
              className={clsx(
                "h-full rounded-full transition-all duration-1000 ease-linear",
                barColor,
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={onContinue}
            loading={refreshing}
            loadingText="Renovando..."
            className="w-full"
          >
            <RefreshCcw className="w-4 h-4" />
            Continuar conectado
          </Button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onMinimize}
              className="flex-1"
              disabled={refreshing}
            >
              Minimizar
            </Button>
            <Button
              variant="ghost"
              onClick={onLogout}
              className={clsx(
                "flex-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-950/30",
              )}
              disabled={refreshing}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
