import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import clsx from "clsx";
import { ArrowRight, BarChart3, ShieldCheck, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: ShieldCheck,
    title: "Segurança",
    desc: "Autenticação JWT com criptografia de ponta a ponta.",
  },
  {
    icon: BarChart3,
    title: "Relatórios",
    desc: "Acompanhe vendas, clientes e produtos em tempo real.",
  },
  {
    icon: Users,
    title: "Multiempresa",
    desc: "Gerencie várias empresas com isolamento total.",
  },
  {
    icon: Zap,
    title: "Performance",
    desc: "Rápido, responsivo e feito para escalar.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Header />

      <section className="py-16 sm:py-24">
        <Container className="text-center">
          <span
            className={clsx(
              "inline-block bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400",
              "text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full mb-6",
            )}
          >
            Gestão de vendas completa
          </span>
          <h1
            className={clsx(
              "text-3xl sm:text-5xl lg:text-6xl font-extrabold",
              "text-primary-950 dark:text-primary-50 leading-tight max-w-4xl mx-auto",
            )}
          >
            Gerencie suas vendas com{" "}
            <span className="text-primary-600 dark:text-primary-400">
              simplicidade
            </span>{" "}
            e controle.
          </h1>
          <p
            className={clsx(
              "mt-6 text-base sm:text-lg text-neutral-500",
              "dark:text-neutral-400 max-w-2xl mx-auto",
            )}
          >
            Sistema completo para controle de produtos, clientes, vendas e
            relatórios.
          </p>
          <div
            className={clsx(
              "mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch",
              "sm:items-center justify-center gap-3 sm:gap-4",
            )}
          >
            <Link
              to="/register"
              className={clsx(
                "bg-primary-600 text-white px-6 sm:px-8 py-3.5 rounded-lg font-semibold",
                "hover:bg-primary-700 transition shadow-lg shadow-primary-600/20",
                "flex items-center justify-center gap-2",
              )}
            >
              Começar agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className={clsx(
                "border border-neutral-200 dark:border-neutral-700 text-primary-900",
                "dark:text-primary-100 px-6 sm:px-8 py-3.5 rounded-lg font-semibold",
                "hover:bg-neutral-50 dark:hover:bg-neutral-800 transition text-center",
              )}
            >
              Já tenho conta
            </Link>
          </div>
        </Container>
      </section>

      <section
        className={clsx(
          "bg-neutral-50 dark:bg-neutral-950 border-y",
          "border-neutral-200 dark:border-neutral-800 py-16 sm:py-20",
        )}
      >
        <Container>
          <h2
            className={clsx(
              "text-2xl sm:text-3xl font-bold text-primary-950",
              "dark:text-primary-50 text-center mb-10 sm:mb-12",
            )}
          >
            Tudo em um só lugar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className={clsx(
                  "bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200",
                  "dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800",
                  "hover:shadow-lg transition",
                )}
              >
                <div
                  className={clsx(
                    "w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/40",
                    "flex items-center justify-center mb-4",
                  )}
                >
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="bg-primary-600 dark:bg-primary-700 rounded-3xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">
              Crie sua conta em menos de 1 minuto.
            </p>
            <Link
              to="/register"
              className={clsx(
                "inline-block bg-white text-primary-700 px-6 sm:px-8 py-3.5",
                "rounded-lg font-semibold hover:bg-primary-50 transition",
              )}
            >
              Criar minha conta
            </Link>
          </div>
        </Container>
      </section>

      <footer
        className={clsx(
          "border-t border-neutral-200 dark:border-neutral-800",
          "py-8 text-center text-sm text-neutral-500 dark:text-neutral-400",
        )}
      >
        <Container>
          &copy; 2026 App Venda. Todos os direitos reservados.
        </Container>
      </footer>
    </div>
  );
}
