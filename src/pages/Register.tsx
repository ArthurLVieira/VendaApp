import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import {
  registerSchema,
  type RegisterFormData,
} from "@/schemas/registerSchema";
import { maskCpf, maskCpfCnpj } from "@/utils/functionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import {
  ArrowLeft,
  Building2,
  IdCard,
  LinkIcon,
  Loader2,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      empresa: { nomeRazao: "", cpfCnpj: "", email: "", logoUrl: "" },
      usuario: {
        nome: "",
        cpf: "",
        email: "",
        senha: "",
        confirmarSenha: "",
      },
    },
  });

  const cpfCnpjValue = watch("empresa.cpfCnpj") ?? "";
  const cpfValue = watch("usuario.cpf") ?? "";

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    console.log("passei aqui");
    try {
      await signUp({
        empresa: {
          nomeRazao: data.empresa.nomeRazao,
          cpfCnpj: data.empresa.cpfCnpj,
          email: data.empresa.email || undefined,
          logoUrl: data.empresa.logoUrl || undefined,
        },
        usuario: {
          email: data.usuario.email,
          senha: data.usuario.senha,
          nome: data.usuario.nome,
          cpf: data.usuario.cpf,
          ativo: true,
        },
      });
      toast.success("Conta criada! Faça login");
      navigate("/login");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao criar conta";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header />
      <Container className="py-8 sm:py-12 max-w-3xl">
        <Link
          to="/"
          className={clsx(
            "inline-flex items-center gap-1.5 text-sm text-neutral-500 transition mb-6",
            "dark:text-neutral-400hover:text-primary-600 dark:hover:text-primary-400",
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a home
        </Link>
        <div className="text-center mb-8">
          <div
            className={clsx(
              "inline-flex w-14 h-14 rounded-2xl bg-primary-600 text-white items-center",
              "justify-center font-bold text-2xl mb-4 shadow-lg shadow-primary-600/25",
            )}
          >
            A
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-950 dark:text-primary-50">
            Criar conta
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm sm:text-base">
            Cadastre sua empresa e comece a usar
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={clsx(
            "bg-white dark:bg-neutral-800 rounded-2xl shadow-sm",
            "border border-neutral-200 dark:border-neutral-700",
            "p-5 sm:p-8 space-y-8",
          )}
        >
          <section>
            <header className="flex items-center gap-2 mb-5">
              <div
                className={clsx(
                  "w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40",
                  "flex items-center justify-center",
                )}
              >
                <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-primary-900 dark:text-primary-100">
                Dados da Empresa
              </h2>
            </header>

            <div className="space-y-4">
              <Input
                label="Nome/Razão social da empresa"
                placeholder="Minha Empresa Ltda"
                error={errors.empresa?.nomeRazao?.message}
                {...register("empresa.nomeRazao")}
              />
              <Input
                label="CPF ou CNPJ *"
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                icon={<IdCard className="w-5 h-5" />}
                error={errors.empresa?.cpfCnpj?.message}
                value={cpfCnpjValue}
                onChange={(e) => {
                  const masked = maskCpfCnpj(e.target.value);
                  setValue("empresa.cpfCnpj", masked, {
                    shouldValidate: false,
                  });
                }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="E-mail da empresa"
                  type="email"
                  placeholder="contato@empresa.com"
                  autoComplete="email"
                  icon={<MailIcon className="w-5 h-5" />}
                  error={errors.empresa?.email?.message}
                  {...register("empresa.email")}
                />
                <Input
                  label="Logo (URL)"
                  type="url"
                  placeholder="https://..."
                  icon={<LinkIcon className="w-5 h-5" />}
                  error={errors.empresa?.logoUrl?.message}
                  hint="Opcional"
                  {...register("empresa.logoUrl")}
                />
              </div>
            </div>
          </section>

          <div className="relative">
            <hr className="border-neutral-200 dark:border-neutral-700" />
          </div>

          <section>
            <header className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-primary-900 dark:text-primary-100">
                Dados do Usuário
              </h2>
            </header>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  icon={<MailIcon className="w-5 h-5" />}
                  error={errors.usuario?.email?.message}
                  {...register("usuario.email")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    icon={<LockIcon className="w-5 h-5" />}
                    error={errors.usuario?.senha?.message}
                    {...register("usuario.senha")}
                  />
                  <Input
                    label="Confirmar senha *"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    icon={<LockIcon className="w-5 h-5" />}
                    error={errors.usuario?.confirmarSenha?.message}
                    {...register("usuario.confirmarSenha")}
                  />
                </div>

                <Input
                  label="Nome completo"
                  type="text"
                  placeholder="Meu nome completo"
                  icon={<UserIcon className="w-5 h-5" />}
                  error={errors.usuario?.nome?.message}
                  {...register("usuario.nome")}
                />
                <Input
                  label="CPF *"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  autoComplete="off"
                  icon={<IdCard className="w-5 h-5" />}
                  error={errors.usuario?.cpf?.message}
                  value={cpfValue}
                  onChange={(e) => {
                    const masked = maskCpf(e.target.value);
                    setValue("usuario.cpf", masked, { shouldValidate: false });
                  }}
                />
              </div>
            </div>
          </section>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
            Ao criar a conta você concorda com os{" "}
            <a
              href="#"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a
              href="#"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Política de Privacidade
            </a>
            .
          </p>

          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="w-full hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Entrar
          </Link>
        </p>
      </Container>
    </div>
  );
}
