import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";
import { useState } from "react";
import { Container } from "./Container";
import { MenuIcon } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Link } from "react-router-dom";

export function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 border-b bg-white/80 backdrop-blur",
        "border-neutral-200 dark:bg-neutral-900/80 dark:border-neutral-800",
      )}
    >
      <Container className="flex items-center justify-between h-12">
        <Link to="/" className="flex items-center gap-2">
          <div
            className={clsx(
              "w-9 h-9 rounded-lg bg-primary-600 text-white",
              "flex items-center justify-center font-bold",
            )}
          >
            A
          </div>
          <span className="text-lg font-bold text-primary-900 dark:text-primary-100 ">
            App Venda
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-primary-700 dark:text-primary-300 font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="text-neutral-500 dark:text-neutral-400 text-sm hover:text-red-500"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-primary-700 dark:text-primary-300 font-medium"
              >
                Entrar
              </Link>
              <Link
                to="register"
                className="bg-primary-600 text-white px-2 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Criar Conta
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            aria-label="Abrir menu"
            onClick={() => setOpen((prev) => !prev)}
            className={clsx(
              "p-2 rounded-lg text-neutral-700 dark:text-neutral-200",
              "hover:bg-neutral-100 dark:bg-neutral-800",
            )}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </Container>

      <div
        className={clsx(
          "md:hidden border-t border-neutral-200",
          "dark:border-neutral-800 bg-white dark:bg-neutral-900",
          open ? "block" : "hidden",
        )}
      >
        <Container className="py-4 flex flex-col gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="py-2"
              >
                Dashboard
              </Link>
              <button onClick={signOut} className="py-2 text-left text-red-500">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="py-2">
                Entrar
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="bg-primary-600 text-white px-5 py-2.5 rounded-lg text-center font-medium"
              >
                Criar conta
              </Link>
            </>
          )}
        </Container>
      </div>
    </header>
  );
}
