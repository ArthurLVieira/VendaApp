import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, hint, className, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label
            className={clsx(
              "block text-sm font-medium text-primary-900",
              "dark:text-primary-100 mb-1.5",
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span
              className={clsx(
                "absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400",
              )}
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            className={clsx(
              "w-full py-3 rounded-lg border outline-none transition",
              icon ? "pl-11" : "pl-4",
              isPassword ? "pr-11" : "pr-4",
              "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400",
              "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500",
              "focus:bg-white dark:focus:bg-neutral-800",
              "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {hint && !error && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {hint}
          </p>
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
