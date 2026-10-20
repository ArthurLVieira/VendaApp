import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
}

const variants: Record<Variant, string> = {
  primary: clsx(
    "bg-primary-600 text-white hover:bg-primary-700 shadow-lg",
    "shadow-primary-600/20 dark:bg-primary-500 dark:hover:bg-primary-600",
  ),
  secondary: clsx(
    "bg-white text-primary-900 border border-neutral-200 hover:bg-neutral-50",
    "dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700",
  ),
  ghost:
    "text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/40",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-3.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      loadingText,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition",
        "focus:outline-none focus:ring-2 focus:ring-primary-500/40",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin shrink-0" />}
      {loading ? (loadingText ?? children) : children}
    </button>
  ),
);

Button.displayName = "Button";
