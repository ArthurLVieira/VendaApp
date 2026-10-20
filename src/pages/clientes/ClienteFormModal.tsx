import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Cliente } from "@/models/Cliente";
import { clienteSchema, type ClienteFormData } from "@/schemas/clienteSchema";
import type { ClientePayload } from "@/types/api";
import { extractApiError } from "@/utils/apiError";
import { maskCpf, onlyDigits, toLocalDateISO } from "@/utils/functionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, IdCard, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ClienteFormModalProps {
  open: boolean;
  onClose: () => void;
  cliente?: Cliente | null;
  onSubmit: (payload: ClientePayload) => Promise<void>;
}

export function ClienteFormModal({
  open,
  onClose,
  cliente,
  onSubmit,
}: ClienteFormModalProps) {
  const isEdit = Boolean(cliente);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { nomeCompleto: "", cpf: "", dataNascimento: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      nomeCompleto: cliente?.nomeCompleto ?? "",
      cpf: cliente?.cpf ? maskCpf(cliente.cpf) : "",
      dataNascimento: cliente?.dataNascimento
        ? toLocalDateISO(cliente.dataNascimento)
        : "",
    });
  }, [open, cliente, reset]);

  const cpfValue = watch("cpf") ?? "";

  const submit = async (data: ClienteFormData) => {
    try {
      await onSubmit({
        nomeCompleto: data.nomeCompleto.trim(),
        cpf: data.cpf ? onlyDigits(data.cpf) : undefined,
        dataNascimento: data.dataNascimento || undefined,
      });
      onClose();
    } catch (err) {
      toast.error(extractApiError(err, "Erro ao salvar cliente"));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar cliente" : "Novo cliente"}
      description={
        isEdit ? "Atualize os dados do cliente." : "Cadastre um novo cliente."
      }
    >
      <form
        id="cliente-form"
        onSubmit={handleSubmit(submit)}
        noValidate
        className="space-y-4"
      >
        <Input
          label="Nome completo *"
          placeholder="João da Silva"
          icon={<User className="w-5 h-5" />}
          error={errors.nomeCompleto?.message}
          {...register("nomeCompleto")}
        />

        <Input
          label="CPF"
          placeholder="000.000.000-00"
          inputMode="numeric"
          icon={<IdCard className="w-5 h-5" />}
          error={errors.cpf?.message}
          value={cpfValue}
          onChange={(e) =>
            setValue("cpf", maskCpf(e.target.value), { shouldValidate: false })
          }
        />

        <Input
          label="Data de nascimento"
          type="date"
          icon={<Calendar className="w-5 h-5" />}
          error={errors.dataNascimento?.message}
          {...register("dataNascimento")}
        />
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
          {isEdit ? "Salvar alterações" : "Criar cliente"}
        </Button>
      </div>
    </Modal>
  );
}
