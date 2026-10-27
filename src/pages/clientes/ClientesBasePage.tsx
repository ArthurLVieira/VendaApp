import { useCliente } from "@/hooks/useClientes";
import { Cliente } from "@/models/Cliente";
import type { ClientePayload } from "@/types/api";
import { extractApiError } from "@/utils/apiError";
import { Plus, Search, Truck, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Dashboard from "../Dashboard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";
import { EmptyState } from "@/components/ui/EmptyState";

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
  const [viewing, setViewing] = useState<Cliente | null>(null);
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
    await toggleFornecedor(id);

    setViewing(null);
  };

  const handleToggleStatus = async (id: number) => {
    await toggleStatus(id);
  };

  const handleConfirmDelete = async (id: number) => {
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

  return (
    <DashboardLayout title={cfg.title}>
      <div className="space-y-5">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-950 dark:text-primary-50">
              {cfg.title}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {data?.totalElements ?? 0} cadastro(s)
            </p>
          </div>
          <Button onClick={handleCreate} className="self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            {cfg.newLabel}
          </Button>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={cfg.searchPlaceholder}
              className={clsx(
                "w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition",
                "bg-white dark:bg-neutral-800",
                "border border-neutral-200 dark:border-neutral-700",
                "text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400",
                "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
              )}
            />
          </div>

          {error && (
            <div
              className={clsx(
                "rounded-lg bg-red-50 dark:bg-red-950/40 border text-sm",
                "border-red-200 dark:border-red-900 p-3 text-red-700 dark:text-red-300",
              )}
            >
              {error}
              <button onClick={refresh} className="ml-2 underline font-medium">
                Tentar novamente
              </button>
            </div>
          )}

          {loading && !data && (
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center text-sm text-neutral-500">
              Carregando...
            </div>
          )}

          {!loading && data && data.content.length === 0 && (
            <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <EmptyState
                icon={cfg.icon}
                title={cfg.emptyTitle}
                description={
                  params.search ? "Tente ajustar a busca" : cfg.emptyDesc
                }
                action={
                  !params.search && (
                    <Button onClick={handleCreate}>
                      <Plus className="w-4 h-4" /> {cfg.newLabel}
                    </Button>
                  )
                }
              />
            </div>
          )}
        </header>
      </div>
    </DashboardLayout>
  );
}
