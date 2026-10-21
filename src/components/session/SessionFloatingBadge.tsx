import clsx from "clsx";
import { AlertTriangle, Clock } from "lucide-react";

interface Props {
  remainingMs: number;
  onClick: () => void;
}

export function SessionFloatingBadge({ remainingMs, onClick }: Props) {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const isCritical = seconds <= 15;
  const isUrgent = seconds <= 30;

  const bg = isCritical
    ? "bg-red-600 hover:bg-red-700 animate-pulse"
    : isUrgent
      ? "bg-red-500 hover:bg-red-600"
      : seconds <= 45
        ? "bg-orange-500 hover:bg-orange-600"
        : "bg-amber-500 hover:bg-amber-600";

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "fixed bottom-4 right-4 z-40",
        "flex items-center gap-2 px-4 py-2.5 rounded-full",
        "text-white font-semibold text-sm shadow-lg shadow-black/20",
        "transition-all duration-200 hover:scale-105",
        "focus:outline-none focus:ring-4 focus:ring-white/40",
        bg,
      )}
      aria-label="Sessão expirando — clique para renovar"
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span className="tabular-nums">Expira em {seconds}s</span>
    </button>
  );
}
