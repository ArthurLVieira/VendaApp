import clsx from "clsx";
import type React from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white border-neutral-200 shadow-sm",
        "dark:bg-neutral-800 dark:border-neutral-700",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
