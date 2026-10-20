import { AlertTriangle, Loader2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

type ConfirmDialogVariant = "danger" | "primary";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  variant?: ConfirmDialogVariant;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  loading,
  variant = "danger",
}) => {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={
            variant === "danger"
              ? "w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-4"
              : "w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center mb-4"
          }
        >
          <AlertTriangle
            className={
              variant === "danger"
                ? "w-6 h-6 text-red-600 dark:text-red-400"
                : "w-6 h-6 text-primary-600 dark:text-primary-400"
            }
          />
        </div>
        <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
          {title}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          {message}
        </p>

        <div className="flex gap-2 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
