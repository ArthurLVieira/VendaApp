import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  const max = 5;
  const start = Math.max(0, Math.min(page - 2, totalPages - max));
  const end = Math.min(totalPages - 1, start + max - 1);

  for (let i = start; i <= end; i++) pages.push(i);
  if (start > 0) pages.unshift(0, "…");
  if (end < totalPages - 1) pages.push("…", totalPages - 1);

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Paginação"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Página anterior"
        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed dark:hover:bg-neutral-800"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={clsx(
              "min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition",
              p === page
                ? "bg-primary-600 text-white"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
            )}
          >
            {p + 1}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Próxima página"
        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed dark:hover:bg-neutral-800"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
