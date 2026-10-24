import clsx from "clsx";
import type React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled,
  label,
  description,
}) => {
  return (
    <div className="flex items-start justify-between gap-4">
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {label}
            </p>
          )}
          {description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/40",
        )}
      >
        <span
          className={clsx(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
};
