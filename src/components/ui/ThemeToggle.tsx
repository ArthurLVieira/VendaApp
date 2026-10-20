import { useTheme } from "@/hooks/useTheme";
import { MoonIcon, SunIcon } from "lucide-react";
import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ThemeToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children" | "onClick"
>;

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? SunIcon : MoonIcon;

  return (
    <button
      type="button"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      onClick={toggleTheme}
      className={clsx(
        "p-2 rounded-lg transition",
        "text-neutral-600 hover:bg-neutral-100",
        "dark:text-neutral-300 dark:hover:bg-neutral-800",
        "focus:outline-none focus:ring-2 focus:ring-primary-500/40",
        className,
      )}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
