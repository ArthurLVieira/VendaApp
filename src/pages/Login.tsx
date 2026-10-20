import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/schemas/authSchema";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Header } from "@/components/layout/Header";
import clsx from "clsx";
import { Input } from "@/components/ui/Input";
import {
  AlertTriangle,
  ArrowRight,
  LockIcon,
  MailIcon,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApiHealth } from "@/hooks/useApiHealth";
import { ApiStatusBanner } from "@/components/ui/ApiStatusBanner";

interface LocationState {
  from?: { pathname: string };
}

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const hasGreeted = useRef(false);
  const { status: apiStatus, lastCheckedAt, check: checkApi } = useApiHealth();

  const redirectTo =
    (location.state as LocationState | null)?.from?.pathname ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { username: "", password: "", rememberMe: true },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (apiStatus === "offline") {
      const online = await checkApi();
      if (!online) {
        toast.error(
          "Servidor indisponível no momento. Tente novamente em instantes.",
        );
        return;
      }
    }

    setLoading(true);
    try {
      await signIn({
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "E-mail ou senha inválidos";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasGreeted.current) {
      hasGreeted.current = true;
      toast.success(`Bem-vindo, ${user.nome}!`);
    }
  }, [user]);

  const isApiOffline = apiStatus === "offline";

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <aside
          aria-hidden
          className={clsx(
            "hidden lg:flex relative bg-primary-900 dark:bg-primary-950 text-white",
            "p-10 xl:p-14 flex-col justify-between overflow-hidden",
          )}
        >
          <div
            className={clsx(
              "absolute -top-24 -right-24 w-80 h-80",
              "rounded-full bg-primary-600/30 blur-3xl",
            )}
          />
          <div
            className={clsx(
              "absolute -bottom-32 -left-32 w-96 h-96",
              "rounded-full bg-primary-500/20 blur-3xl",
            )}
          />
          <div className="relative flex items-center gap-2">
            <div
              className={clsx(
                "w-10 h-10 rounded-xl bg-white text-primary-700",
                "flex items-center justify-center font-bold text-lg",
              )}
            >
              A
            </div>
            <span className="text-xl font-bold tracking-tight">App Venda</span>
          </div>
          <div className="relative max-w-md">
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-5">
              Controle total das suas vendas.
            </h2>
            <p className="text-primary-200 text-lg leading-relaxed">
              Gerencie produtos, clientes e relatórios em um só lugar — com
              segurança e simplicidade.
            </p>
            <ul className="mt-8 space-y-3 text-primary-100">
              {[
                "Autenticação JWT com refresh automático",
                "Multiempresa com isolamento de dados",
                "Relatórios em tempo real",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-primary-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative text-xs text-primary-300">
            &copy; 2026 ApiVenda. Todos os direitos reservados.
          </p>
        </aside>

        <main
          className={clsx(
            "w-full flex items-start sm:items-center",
            "justify-center p-4 sm:p-8 lg:p-12",
          )}
        >
          <div
            className={clsx(
              "w-full max-w-md bg-white dark:bg-neutral-800",
              "border border-neutral-200 dark:border-neutral-700",
              "rounded-2xl shadow-sm p-6 sm:p-8",
              "lg:bg-transparent lg:dark:bg-transparent",
              "lg:border-0 lg:shadow-none lg:rounded-none lg:p-0",
            )}
          >
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div
                className={clsx(
                  "w-10 h-10 rounded-xl bg-primary-600 text-white",
                  "flex items-center justify-center font-bold",
                )}
              >
                A
              </div>
              <span className="text-lg font-bold text-primary-900 dark:text-primary-100">
                ApiVenda
              </span>
            </div>
            <h1
              className={clsx(
                "text-2xl sm:text-3xl font-bold text-primary-950",
                "dark:text-primary-50 mb-2",
              )}
            >
              Entrar na conta
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mb-8">
              Bem-vindo de volta! Informe suas credenciais para acessar o
              painel.
            </p>

            <ApiStatusBanner
              status={apiStatus}
              lastCheckedAt={lastCheckedAt}
              onRetry={checkApi}
              className="hidden lg:flex mb-6"
            />

            {isApiOffline && (
              <div
                role="alert"
                className="lg:hidden flex items-center gap-2 rounded-lg border p-3 mb-5
                           bg-amber-50 border-amber-200 text-amber-900 text-sm
                           dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Servidor offline. Tente novamente em instantes.</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                icon={<MailIcon className="w-5 h-5" />}
                error={errors.username?.message}
                autoComplete="email"
                {...register("username")}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                icon={<LockIcon className="w-5 h-5" />}
                error={errors.password?.message}
                autoComplete="current-password"
                {...register("password")}
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600
                               focus:ring-primary-500/40 focus:ring-2
                               dark:border-neutral-600 dark:bg-neutral-800"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Lembrar-me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                loadingText="Entrando..."
                disabled={loading || !isValid || isApiOffline}
                className="w-full"
                title={
                  isApiOffline
                    ? "Servidor offline — verifique sua conexão"
                    : undefined
                }
              >
                {isApiOffline ? "Servidor offline" : "Entrar"}
                {!loading && !isApiOffline && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </form>
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
              Não tem conta?{" "}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Criar agora
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
