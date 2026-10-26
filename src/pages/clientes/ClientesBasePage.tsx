import { useCliente } from "@/hooks/useClientes";
import { Cliente } from "@/models/Cliente";
import type { ClientePayload } from "@/types/api";
import { extractApiError } from "@/utils/apiError";
import { Truck, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export type PessoaModo = "cliente" | "fornecedor";

interface ClienteBaseProps {
  modo: PessoaModo;
}

const CONFIG = {
  cliente: {
    title: "Clientes",
    singular: "cliente",
    plural: "clientes",
    icon: Users,
    emptyTitle: "Nenhum cliente encontrado",
    emptyDesc: "Cadastre o primeiro cliente",
    newLabel: "Novo cliente",
    searchPlaceholder: "Busca cliente por nome, CPF/CNPJ",
    deleteTitle: "Excluir cliente",
    basePath: "/dashboard/clientes",
  },
  fornecedor: {
    title: "Fornecedores",
    singular: "fornecedor",
    plural: "fornecedores",
    icon: Truck,
    emptyTitle: "Nenhum fornecedor encontrado",
    emptyDesc: "Cadastre o primeiro fornecedor.",
    newLabel: "Novo fornecedor",
    searchPlaceholder: "Buscar fornecedor por nome, CPF/CNPJ...",
    deleteTitle: "Excluir fornecedor",
    basePath: "/dashboard/fornecedores",
  },
} as const;

export function ClienteBasePage({ modo }: ClienteBaseProps) {
  const cfg = CONFIG[modo];
  const isFornecedor = modo === "fornecedor";

  const {
    data,
    loading,
    error,
    params,
    setParams,
    refresh,
    create,
    update,
    remove,
    toggleStatus,
    toggleFornecedor,
  } = useCliente({ fornecedor: isFornecedor });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [viewing, setviewing] = useState<Cliente | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState(params.search ?? "");

  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => setParams({ search: value, page: 0 }), 400);
  };

  const sortField = params.sort?.split(",")[0] ?? "nomeRazao";
  const sortDir = params.sort?.split(",")[1] ?? "asc";
  const toggleSort = (
    field: "nomeRazao" | "cpfCnpj" | "dataNascimentoCriacao",
  ) => {
    const nextDir = sortField === field && sortDir === "asc" ? "desc" : "asc";
    setParams({ sort: `${field},${nextDir}`, page: 0 });
  };

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (c: Cliente) => {
    setEditing(c);
    setFormOpen(true);
  };

  const handleSave = async (paload: ClientePayload) => {
    if (editing) {
      await update(editing.id, paload);
      toast.success(`${isFornecedor ? "Fornecedor" : "Cliente"} atualizado`);
    } else {
      await create(paload);
      toast.success(`${isFornecedor ? "Fornecedor" : "Cliente"} criado`);
    }
  };

  const handleToggleFornecedor = async (id: number) => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await remove(deleteTarget.id);
      toast.success(`${isFornecedor ? "Fornecedor" : "Cliente"} excluído}`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err, "Error ao excluir."));
    } finally {
      setDeleting(false);
    }
  };
}
