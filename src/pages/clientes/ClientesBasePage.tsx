import { useCliente } from "@/hooks/useClientes";
import { Cliente } from "@/models/Cliente";
import type { ClientePayload } from "@/types/api";
import { extractApiError } from "@/utils/apiError";
import {
  ArrowUpDown,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { ClienteFormModal } from "./ClienteFormModal";
import { ClienteViewModal } from "./ClienteViewModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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

  const handleConfirmDelete = async (): Promise<void> => {
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
              {data?.totalElements ?? 0} cadastrado(s)
            </p>
          </div>
          <Button onClick={handleCreate} className="self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            {cfg.newLabel}
          </Button>
        </header>

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
              "rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900",
              "p-3 text-sm text-red-700 dark:text-red-300",
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
                params.search ? "Tente ajustar a busca." : cfg.emptyDesc
              }
              action={
                !params.search && (
                  <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4" />
                    {cfg.newLabel}
                  </Button>
                )
              }
            />
          </div>
        )}

        {data && data.content.length > 0 && (
          <>
            {/* Tabela desktop */}
            <div
              className={clsx(
                "hidden md:block rounded-2xl bg-white dark:bg-neutral-900",
                "border border-neutral-200 dark:border-neutral-800 overflow-hidden",
              )}
            >
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="text-left font-semibold text-neutral-600 dark:text-neutral-300 px-5 py-3">
                      <button
                        onClick={() => toggleSort("nomeRazao")}
                        className="inline-flex items-center gap-1 hover:text-primary-600"
                      >
                        Nome / Razão <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left font-semibold text-neutral-600 dark:text-neutral-300 px-5 py-3">
                      <button
                        onClick={() => toggleSort("cpfCnpj")}
                        className="inline-flex items-center gap-1 hover:text-primary-600"
                      >
                        CPF / CNPJ <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left font-semibold text-neutral-600 dark:text-neutral-300 px-5 py-3">
                      Status
                    </th>
                    <th className="text-right font-semibold text-neutral-600 dark:text-neutral-300 px-5 py-3 w-40">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {data.content.map((c) => (
                    <tr
                      key={c.id}
                      className={clsx(
                        "hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition",
                        !c.status && "opacity-60",
                      )}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx(
                              "w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950/40",
                              "text-primary-700 dark:text-primary-300",
                              "flex items-center justify-center text-xs font-semibold shrink-0",
                            )}
                          >
                            {c.iniciais}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                              {c.nomeRazao}
                            </p>
                            {c.nomeFantazia && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                {c.nomeFantazia}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400 font-mono text-xs">
                        {c.cpfCnpjFormatado}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={c.status ? "success" : "danger"}>
                          {c.status ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() => setViewing(c)}
                            aria-label="Visualizar"
                            title="Visualizar"
                            className={clsx(
                              "p-1.5 rounded-lg text-neutral-500 hover:bg-sky-50 hover:text-sky-600",
                              "dark:hover:bg-sky-950/40 dark:hover:text-sky-400",
                            )}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(c)}
                            aria-label="Editar"
                            title="Editar"
                            className={clsx(
                              "p-1.5 rounded-lg text-neutral-500 hover:bg-primary-50 hover:text-primary-600",
                              "dark:hover:bg-primary-950/40 dark:hover:text-primary-400",
                            )}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(c)}
                            aria-label="Excluir"
                            title="Excluir"
                            className={clsx(
                              "p-1.5 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-600",
                              "dark:hover:bg-red-950/40 dark:hover:text-red-400",
                            )}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="md:hidden space-y-3">
              {data.content.map((c) => (
                <div
                  key={c.id}
                  className={clsx(
                    "rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4",
                    !c.status && "opacity-60",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/40
                                    text-primary-700 dark:text-primary-300
                                    flex items-center justify-center text-sm font-semibold shrink-0"
                    >
                      {c.iniciais}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 break-words">
                        {c.nomeRazao}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                        {c.cpfCnpjFormatado}
                      </p>
                      <div className="mt-2">
                        <Badge tone={c.status ? "success" : "danger"}>
                          {c.status ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setViewing(c)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4" /> Ver
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(c)}
                      className="flex-1"
                    >
                      <Pencil className="w-4 h-4" /> Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTarget(c)}
                      aria-label="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Página {data.page + 1} de {data.totalPages || 1} ·{" "}
                {data.totalElements} registro(s)
              </p>
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={(p) => setParams({ page: p })}
              />
            </div>
          </>
        )}
      </div>

      <ClienteFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        cliente={editing}
        fornecedorContext={isFornecedor}
        onSubmit={handleSave}
      />

      <ClienteViewModal
        open={Boolean(viewing)}
        cliente={viewing}
        onClose={() => setViewing(null)}
        onEdit={() => {
          setEditing(viewing);
          setViewing(null);
          setFormOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onToggleFornecedor={handleToggleFornecedor}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title={cfg.deleteTitle}
        message={`Tem certeza que deseja excluir "${deleteTarget?.nomeRazao}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </DashboardLayout>
  );
}
