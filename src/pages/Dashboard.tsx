import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
} from "lucide-react";

const metrics = [
  {
    label: "Vendas hoje",
    value: "42",
    trend: "+12%",
    up: true,
    icon: ShoppingCart,
  },
  {
    label: "Faturamento",
    value: "R$ 8.540",
    trend: "+5%",
    up: true,
    icon: DollarSign,
  },
  { label: "Clientes", value: "128", trend: "+3", up: true, icon: Users },
  { label: "Produtos", value: "86", trend: "-2", up: false, icon: Package },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Saudação */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary-950 dark:text-primary-50">
            Olá, {user?.nome ?? "Usuário"} 👋
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-1">
            Aqui está o resumo do seu negócio hoje.
          </p>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(({ label, value, trend, up, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl bg-white dark:bg-neutral-900
                         border border-neutral-200 dark:border-neutral-800
                         p-5 hover:border-primary-200 dark:hover:border-primary-800 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40
                                flex items-center justify-center"
                >
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <span
                  className={
                    up
                      ? "inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                      : "inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400"
                  }
                >
                  {up ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {trend}
                </span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {label}
              </p>
              <p className="text-2xl font-bold text-primary-900 dark:text-primary-100 mt-1">
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-neutral-900
                          border border-neutral-200 dark:border-neutral-800 p-6 min-h-[300px]"
          >
            <h3 className="text-base font-semibold text-primary-900 dark:text-primary-100">
              Vendas na semana
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Gráfico será implementado aqui.
            </p>
          </div>
          <div
            className="rounded-2xl bg-white dark:bg-neutral-900
                          border border-neutral-200 dark:border-neutral-800 p-6 min-h-[300px]"
          >
            <h3 className="text-base font-semibold text-primary-900 dark:text-primary-100">
              Últimas vendas
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Lista será implementada aqui.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
