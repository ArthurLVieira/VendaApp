import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Produto } from "@/models/Produto";
import { produtoSchema, type ProdutoFormData } from "@/schemas/produtoSchema";
import type { ProdutoPayload } from "@/types/api";
import { parseApiError } from "@/utils/apiError";
import {
  maskCurrency,
  parseCurrencyToBigDecimal,
  parseDecimalToBigDecimal,
} from "@/utils/functionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Barcode, Boxes, DollarSign, Package } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ProdutoFormModalProps {
  open: boolean;
  onClose: () => void;
  produto?: Produto | null;
  onSubmit: (payload: ProdutoPayload) => Promise<void>;
}

export function ProdutoFormModal({
  open,
  onClose,
  produto,
  onSubmit,
}: ProdutoFormModalProps) {
  const isEdit = Boolean(produto);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      descricao: "",
      codigoDeBarras: "",
      preco: "",
      quantidade: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      descricao: produto?.descricao ?? "",
      codigoDeBarras: produto?.codigoDeBarras ?? "",
      preco: produto ? maskCurrency(produto.preco) : "",
      quantidade: produto ? formatQuantityInput(produto.quantidade) : "",
    });
  }, [open, produto, reset]);

  const precoValue = watch("preco") ?? "";
  const quantidadeValue = watch("quantidade") ?? "";

  const submit = async (data: ProdutoFormData) => {
    try {
      await onSubmit({
        descricao: data.descricao.trim(),
        codigoDeBarras: data.codigoDeBarras?.trim() || undefined,
        preco: parseCurrencyToBigDecimal(data.preco),
        quantidade: parseDecimalToBigDecimal(data.quantidade, 3),
      });

      onClose();
    } catch (err) {
      toast.error(parseApiError(err, "Erro ao salvar produto").message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar produto" : "Novo produto"}
      description={
        isEdit ? "Atualize os dados do produto." : "Cadastre um novo produto."
      }
      size="md"
    >
      <form
        id="produto-form"
        onSubmit={handleSubmit(submit)}
        noValidate
        className="space-y-4"
      >
        <Input
          label="Descrição *"
          placeholder="Ex.: Camiseta Polo Azul M"
          icon={<Package className="w-5 h-5" />}
          error={errors.descricao?.message}
          {...register("descricao")}
        />

        <Input
          label="Código de barras"
          placeholder="7891234567890"
          icon={<Barcode className="w-5 h-5" />}
          error={errors.codigoDeBarras?.message}
          {...register("codigoDeBarras")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Preço *"
            placeholder="0,00"
            inputMode="numeric"
            icon={<DollarSign className="w-5 h-5" />}
            error={errors.preco?.message}
            value={precoValue}
            onChange={(e) =>
              setValue("preco", maskCurrency(e.target.value), {
                shouldValidate: false,
              })
            }
          />

          <Input
            label="Quantidade *"
            placeholder="0"
            inputMode="decimal"
            icon={<Boxes className="w-5 h-5" />}
            error={errors.quantidade?.message}
            value={quantidadeValue}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d,.]/g, "");
              setValue("quantidade", raw, { shouldValidate: false });
            }}
          />
        </div>
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
          form="produto-form"
          className="flex-1"
          loading={isSubmitting}
          loadingText="Salvando..."
        >
          {isEdit ? "Salvar alterações" : "Criar produto"}
        </Button>
      </div>
    </Modal>
  );
}

function formatQuantityInput(value: string): string {
  return value.replace(".", ",");
}
