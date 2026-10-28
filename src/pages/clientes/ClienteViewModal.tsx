import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Switch";
import type { Cliente } from "@/models/Cliente";
import { extractApiError } from "@/utils/apiError";
import { Calendar, IdCard, Loader2, Pencil, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  cliente: Cliente | null;
  onClose: () => void;
  onEdit: () => void;
  onToggleStatus: (id: number) => Promise<void>;
  onToggleFornecedor: (id: number) => Promise<void>;
}

export function ClienteViewModal({
  open,
  cliente,
  onClose,
  onEdit,
  onToggleStatus,
  onToggleFornecedor,
}: Props) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingFornecedor, setUpdatingFornecedor] = useState(false);
  const [localStatus, setLocalStatus] = useState(false);
  const [localFornecedor, setLocalFornecedor] = useState(false);

  useEffect(() => {
    if (cliente) {
      setLocalStatus(cliente.status);
      setLocalFornecedor(cliente.fornecedor);
    }
  }, [cliente]);

  if (!cliente) return null;

  const handleToggleFornecedor = async () => {
    setUpdatingFornecedor(true);
    try {
      await onToggleFornecedor(cliente.id);
      setLocalFornecedor((v) => !v);
      toast.success("Tipo atualizado");
    } catch (err) {
      toast.error(extractApiError(err, "Erro ao alterar tipo"));
    } finally {
      setUpdatingFornecedor(false);
    }
  };

  const handleToggleStatus = async () => {
    setUpdatingStatus(true);
    try {
      await onToggleStatus(cliente.id);
      setLocalStatus((v) => !v);
      toast.success("Status atualizado");
    } catch (err) {
      toast.error(extractApiError(err, "Erro ao alterar status"));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const tipoAtual = cliente.fornecedor ? "Fornecedor" : "cliente";
  const tipoAlternativo = cliente.fornecedor ? "Cliente" : "fornecedor";

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Fechar
          </Button>
          <Button onClick={onEdit} className="flex-1">
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
        </div>
      }
    >
      {/* Cabeçalho */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-950/40
                        text-primary-700 dark:text-primary-300 flex items-center justify-center
                        text-lg font-bold shrink-0"
        >
          {cliente.iniciais}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-primary-950 dark:text-primary-50 truncate">
            {cliente.nomeRazao}
          </h2>
          {cliente.nomeFantazia && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              {cliente.nomeFantazia}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge tone={localStatus ? "success" : "danger"}>
              {localStatus ? "Ativo" : "Inativo"}
            </Badge>
            <Badge tone={localFornecedor ? "info" : "neutral"}>
              {localFornecedor ? "Fornecedor" : "Cliente"}
            </Badge>
            <Badge tone="primary">{cliente.tipoDocumento}</Badge>
          </div>
        </div>
      </div>

      {/* Dados */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 divide-y divide-neutral-100 dark:divide-neutral-700">
        <InfoRow
          icon={<IdCard className="w-4 h-4" />}
          label={cliente.tipoDocumento}
          value={cliente.cpfCnpjFormatado}
        />
        <InfoRow
          icon={<Sparkles className="w-4 h-4" />}
          label="Nome fantasia"
          value={cliente.nomeFantazia || "—"}
        />
        <InfoRow
          icon={<Calendar className="w-4 h-4" />}
          label="Nascimento / Criação"
          value={
            cliente.idade !== undefined
              ? `${cliente.dataNascimentoCriacaoFormatada} (${cliente.idade} anos)`
              : cliente.dataNascimentoCriacaoFormatada
          }
        />
      </div>

      {/* Toggles */}
      <div
        className="mt-6 space-y-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40
                      border border-neutral-200 dark:border-neutral-700 p-4"
      >
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-1">
          Ações rápidas
        </h3>

        <Switch
          checked={localStatus}
          onChange={() => void handleToggleStatus()}
          disabled={updatingStatus}
          label={localStatus ? "Desativar cadastro" : "Ativar cadastro"}
          description={
            localStatus
              ? "O cadastro ficará inativo e não aparecerá em novas transações."
              : "O cadastro voltará a ficar ativo no sistema."
          }
        />

        <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

        <Switch
          checked={localFornecedor}
          onChange={() => void handleToggleFornecedor()}
          disabled={updatingFornecedor}
          label={
            localFornecedor
              ? `Tornar ${tipoAlternativo}`
              : `Tornar ${tipoAlternativo}`
          }
          description={
            localFornecedor
              ? "Este registro deixará de ser fornecedor e passará a ser cliente."
              : "Este registro deixará de ser cliente e passará a ser fornecedor."
          }
        />

        {(updatingStatus || updatingFornecedor) && (
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Atualizando...
          </div>
        )}
      </div>
    </Modal>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-neutral-400 dark:text-neutral-500 shrink-0">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}
