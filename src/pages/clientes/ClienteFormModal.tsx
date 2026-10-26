import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Cliente } from "@/models/Cliente";
import { clienteSchema, type ClienteFormData } from "@/schemas/clienteSchema";
import type { ClientePayload } from "@/types/api";
import { extractApiError } from "@/utils/apiError";
import {
  maskCpf,
  maskCpfCnpj,
  onlyDigits,
  toLocalDateISO,
} from "@/utils/functionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Calendar, IdCard, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ClienteFormModalProps {
  open: boolean;
  onClose: () => void;
  cliente?: Cliente | null;
  fornecedorContext?: boolean;
  onSubmit: (payload: ClientePayload) => Promise<void>;
}

export function ClienteFormModal({
  open,
  onClose,
  cliente,
  fornecedorContext = false,
  onSubmit,
}: ClienteFormModalProps) {
  const isEdit = Boolean(cliente);

  const titulo = isEdit
    ? `Editar ${cliente?.fornecedor ? "fornecedor" : "cliente"}`
    : fornecedorContext
      ? "Novo fornecedor"
      : "Novo cliente";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nomeRazao: "",
      cpfCnpj: "",
      nomeFantazia: "",
      dataNascimentoCriacao: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      nomeRazao: cliente?.nomeRazao ?? "",
      cpfCnpj: cliente?.cpfCnpj ? maskCpf(cliente.cpfCnpj) : "",
      nomeFantazia: cliente?.nomeFantazia ?? "",
      dataNascimentoCriacao: cliente?.dataNascimentoCriacao
        ? toLocalDateISO(cliente.dataNascimentoCriacao)
        : "",
    });
  }, [open, cliente, reset]);

  const cpfCnpjValue = watch("cpfCnpj") ?? "";

  const submit = async (data: ClienteFormData) => {
    try {
      await onSubmit({
        nomeRazao: data.nomeRazao.trim(),
        cpfCnpj: onlyDigits(data.cpfCnpj),
        nomeFantazia: data.nomeFantazia?.trim() || undefined,
        dataNascimentoCriacao: data.dataNascimentoCriacao || undefined,
        fornecedor: cliente?.fornecedor ?? fornecedorContext,
        status: cliente?.status ?? true,
      });
      onClose();
    } catch (err) {
      toast.error(extractApiError(err, "Erro ao salvar registro"));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titulo}
      description={
        isEdit
          ? "Atualize os dados do cadastro."
          : "Preencha os dados para cadastrar."
      }
      size="md"
    >
      <form
        id="cliente-form"
        onSubmit={handleSubmit(submit)}
        noValidate
        className="space-y-5"
      >
        <section>
          <header className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-100">
              Identificação
            </h3>
          </header>
          <div className="space-y-4">
            <Input
              label="Nome / Razão social *"
              placeholder="Ex.: João da Silva ou ACME Ltda"
              error={errors.nomeRazao?.message}
              {...register("nomeRazao")}
            />
            <Input
              label="CPF ou CNPJ *"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              inputMode="numeric"
              icon={<IdCard className="w-5 h-5" />}
              error={errors.cpfCnpj?.message}
              value={cpfCnpjValue}
              onChange={(e) =>
                setValue("cpfCnpj", maskCpfCnpj(e.target.value), {
                  shouldValidate: false,
                })
              }
              hint="CPF (11 dígitos) ou CNPJ (14 dígitos)"
            />
            <Input
              label="Nome fantasia"
              placeholder="Opcional — como é conhecido no mercado"
              icon={<Sparkles className="w-5 h-5" />}
              error={errors.nomeFantazia?.message}
              {...register("nomeFantazia")}
            />
          </div>
        </section>

        <section>
          <header className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-100">
              {fornecedorContext
                ? "Data de criação"
                : "Data de nascimento / criação"}
            </h3>
          </header>
          <Input
            label={fornecedorContext ? "Criação" : "Nascimento / Criação"}
            type="date"
            icon={<Calendar className="w-5 h-5" />}
            error={errors.dataNascimentoCriacao?.message}
            {...register("dataNascimentoCriacao")}
          />
        </section>
      </form>

      <div className="flex gap-2 mt-6">
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="cliente-form"
          className="flex-1"
          loading={isSubmitting}
          loadingText="Salvando..."
        >
          {isEdit ? "Salvar alterações" : "Cadastrar"}
        </Button>
      </div>
    </Modal>
  );
}
