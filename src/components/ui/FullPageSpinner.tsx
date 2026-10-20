import { Loader2 } from "lucide-react";

interface FullPageSpinnerProps {
  message?: string;
  inline?: boolean;
}

export function FullPageSpinner({
  message = "Carregando...",
  inline = false,
}: FullPageSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        inline
          ? "flex flex-col items-center justify-center gap-3 py-16"
          : "fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white dark:bg-neutral-900"
      }
    >
      <div className="relative">
        <Loader2 className="w-10 h-10 text-primary-600 dark:text-primary-400 animate-spin" />
        <span className="sr-only">Carregando</span>
      </div>

      {message && (
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {message}
        </p>
      )}
    </div>
  );
}
