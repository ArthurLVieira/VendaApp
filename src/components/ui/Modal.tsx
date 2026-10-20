import clsx from "clsx";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type SizeModal = "sm" | "md" | "lg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: SizeModal;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={clsx(
          "relative w-full bg-white dark:bg-neutral-800 shadow-xl",
          "rounded-t-2xl sm:rounded-2xl",
          "border border-neutral-200 dark:border-neutral-700",
          "max-h-[90vh] flex flex-col",
          sizeClasses[size],
        )}
      >
        {(title || description) && (
          <header className="flex items-start justify-between gap-4 p-5 border-b border-neutral-200 dark:border-neutral-700">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-primary-900 dark:text-primary-100"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && (
          <footer className="p-5 border-t border-neutral-200 dark:border-neutral-700">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
};
