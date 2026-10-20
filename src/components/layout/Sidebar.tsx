import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Building2,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: "Principal",
    items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Vendas",
    items: [
      { label: "Vendas", to: "/dashboard/vendas", icon: ShoppingCart },
      { label: "Produtos", to: "/dashboard/produtos", icon: Package },
      { label: "Clientes", to: "/dashboard/clientes", icon: Users },
    ],
  },
  {
    title: "Administração",
    items: [
      {
        label: "Empresas",
        to: "/dashboard/empresas",
        icon: Building2,
        roles: ["ROLE_ADMIN"],
      },
      {
        label: "Usuários",
        to: "/dashboard/usuarios",
        icon: UserCog,
        roles: ["ROLE_ADMIN", "ROLE_GERENTE"],
      },
      {
        label: "Relatórios",
        to: "/dashboard/relatorios",
        icon: BarChart3,
        roles: ["ROLE_ADMIN", "ROLE_GERENTE"],
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        label: "Configurações",
        to: "/dashboard/configuracoes",
        icon: Settings,
        roles: ["ROLE_ADMIN"],
      },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const canSee = (item: NavItem) =>
    !item.roles?.length || item.roles.some((r) => user?.hasRole(r));

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
          "bg-white dark:bg-neutral-900",
          "border-r border-neutral-200 dark:border-neutral-800",
          "transform transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-lg font-bold text-primary-900 dark:text-primary-100">
              ApiVenda
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {SECTIONS.map((section) => {
            const items = section.items.filter(canSee);
            if (items.length === 0) return null;

            return (
              <div key={section.title} className="mb-6 last:mb-0">
                <p
                  className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider
                              text-neutral-400 dark:text-neutral-500"
                >
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/dashboard"}
                        className={({ isActive }) =>
                          clsx(
                            "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                            isActive
                              ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={clsx(
                                "w-5 h-5 shrink-0",
                                isActive
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300",
                              )}
                            />
                            <span className="flex-1">{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
              {user?.iniciais ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {user?.nome ?? user?.email}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {user?.roles[0]?.label ?? "Usuário"}
              </p>
            </div>
            <button
              type="button"
              onClick={signOut}
              title="Sair"
              aria-label="Sair"
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-red-500 dark:hover:bg-neutral-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
