import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";
import clsx from "clsx";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
}

export function DashboardHeader({
  onOpenSidebar,
  title,
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useClickOutside(userMenuRef, () => setUserMenuOpen(false), userMenuOpen);
  useClickOutside(notifRef, () => setNotifOpen(false), notifOpen);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center gap-2 sm:gap-3 px-4 sm:px-6
                 border-b border-neutral-200 dark:border-neutral-800
                 bg-white/80 dark:bg-neutral-900/80 backdrop-blur"
    >
      {/* Hamburger mobile */}
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Abrir menu"
        className="lg:hidden p-2 -ml-2 rounded-lg text-neutral-600
                   hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Título */}
      {title && (
        <h1
          className="hidden sm:block text-lg font-semibold truncate
                       text-primary-900 dark:text-primary-100"
        >
          {title}
        </h1>
      )}

      {/* Busca (oculta em mobile) */}
      <div className="hidden md:block flex-1 max-w-md ml-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg outline-none transition
                       bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400
                       focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                       dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100
                       dark:focus:bg-neutral-800"
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-1 ml-auto">
        <ThemeToggle />

        {/* Notificações */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notificações"
            className="relative p-2 rounded-lg text-neutral-600
                       hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Bell className="w-5 h-5" />
            {/* Ponto de "há notificação" — remova se não usar */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden shadow-lg
                         bg-white dark:bg-neutral-800
                         border border-neutral-200 dark:border-neutral-700"
            >
              <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Notificações
                </p>
              </div>
              <div className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Nenhuma notificação no momento.
              </div>
            </div>
          )}
        </div>

        {/* Menu do usuário */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-lg
                       hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <div
              className="w-8 h-8 rounded-full bg-primary-600 text-white
                            flex items-center justify-center font-semibold text-sm"
            >
              {user?.iniciais ?? "?"}
            </div>
            <div className="hidden sm:block text-left max-w-[140px]">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {user?.nome ?? user?.email}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {user?.roles[0]?.label ?? "Usuário"}
              </p>
            </div>
            <ChevronDown
              className={clsx(
                "hidden sm:block w-4 h-4 text-neutral-400 transition-transform",
                userMenuOpen && "rotate-180",
              )}
            />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-60 rounded-xl overflow-hidden shadow-lg
                         bg-white dark:bg-neutral-800
                         border border-neutral-200 dark:border-neutral-700"
            >
              <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {user?.nome ?? user?.email}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {user?.email}
                </p>
              </div>

              <ul className="py-1">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/dashboard/perfil");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm
                               text-neutral-700 hover:bg-neutral-100
                               dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    <User className="w-4 h-4" />
                    Meu perfil
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/dashboard/configuracoes");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm
                               text-neutral-700 hover:bg-neutral-100
                               dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    <Settings className="w-4 h-4" />
                    Configurações
                  </button>
                </li>
              </ul>

              <div className="border-t border-neutral-200 dark:border-neutral-700 py-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm
                             text-red-600 hover:bg-red-50
                             dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
