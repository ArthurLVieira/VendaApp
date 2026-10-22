import { useState } from "react";
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProdutoFormModal } from "./ProdutoFormModal";
import { useProdutos } from "@/hooks/useProdutos";
import type { Produto } from "@/models/Produto";
import type { ProdutoPayload } from "@/types/api";
import { parseApiError } from "@/utils/apiError";
import clsx from "clsx";

export default function ProdutosPage() {
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
  } = useProdutos();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Produto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState(params.search ?? "");

  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => setParams({ search: value, page: 0 }), 400);
  };

  const sortField = params.sort?.split(",")[0] ?? "descricao";
  const sortDir = params.sort?.split(",")[1] ?? "asc";
  const toggleSort = (field: "descricao" | "preco" | "quantidade") => {
    const nextDir = sortField === field && sortDir === "asc" ? "desc" : "asc";
    setParams({ sort: `${field},${nextDir}`, page: 0 });
  };

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const handleEdit = (p: Produto) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSave = async (payload: ProdutoPayload) => {
    if (editing) {
      await update(editing.id, payload);
      toast.success("Produto atualizado");
    } else {
      await create(payload);
      toast.success("Produto criado");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Produto excluído");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(parseApiError(err, "Erro ao excluir produto").message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Produtos">
      <div className="space-y-5">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-950 dark:text-primary-50">
              Produtos
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {data?.totalElements ?? 0} cadastrado(s)
            </p>
          </div>
          <Button onClick={handleCreate} className="self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Novo produto
          </Button>
        </header>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por descrição, código de barras..."
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
              "rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200",
              "dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300",
            )}
          >
            {error}
            <button onClick={refresh} className="ml-2 underline font-medium">
              Tentar novamente
            </button>
          </div>
        )}

        {loading && !data && (
          <div
            className={clsx(
              "rounded-2xl border border-neutral-200 dark:border-neutral-800",
              "p-12 text-center text-sm text-neutral-500",
            )}
          >
            Carregando...
          </div>
        )}

        {!loading && data && data.content.length === 0 && (
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <EmptyState
              icon={Package}
              title="Nenhum produto encontrado"
              description={
                params.search
                  ? "Tente ajustar a busca."
                  : "Cadastre o primeiro produto."
              }
              action={
                !params.search && (
                  <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4" />
                    Novo produto
                  </Button>
                )
              }
            />
          </div>
        )}

        {data && data.content.length > 0 && (
          <>
            {/* Desktop */}
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
                        onClick={() => toggleSort("descricao")}
                        className="inline-flex items-center gap-1 hover:text-primary-600"
                      >
                        Descrição <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left font-semibold text-neutral-600 dark:text-neutral-300 px-5 py-3">
                      Cód. barras
                    </th>
                    <th className="text-right font-semibold text-neutral-600 dark:text-neutral-300 px-5 py-3">
                      <button
                        onClick={() => toggleSort("preco")}
                        className="inline-flex items-center gap-1 hover:text-primary-600"
                      >
                        Preço <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-right font-semibold text-neutral-600 dark:text-neutral-300 px-5 py-3">
                      <button
                        onClick={() => toggleSort("quantidade")}
                        className="inline-flex items-center gap-1 hover:text-primary-600"
                      >
                        Qtd. <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-right font-semibold text-neutral-600 dark:text-neutral-300 px-5 py-3 w-32">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {data.content.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950/40
                                          text-primary-700 dark:text-primary-300
                                          flex items-center justify-center text-xs font-semibold shrink-0"
                          >
                            {p.iniciais}
                          </div>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {p.descricao}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400 text-sm font-mono">
                        {p.codigoDeBarras ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-primary-700 dark:text-primary-300">
                        {p.precoFormatado}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={clsx(
                            "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
                            p.semEstoque
                              ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              : p.estoqueBaixo
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                          )}
                        >
                          {p.quantidadeFormatada}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            aria-label="Editar"
                            className="p-1.5 rounded-lg text-neutral-500 hover:bg-primary-50 hover:text-primary-600
                                       dark:hover:bg-primary-950/40 dark:hover:text-primary-400"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            aria-label="Excluir"
                            className="p-1.5 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-600
                                       dark:hover:bg-red-950/40 dark:hover:text-red-400"
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

            <div className="md:hidden space-y-3">
              {data.content.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-white dark:bg-neutral-900
                             border border-neutral-200 dark:border-neutral-800 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/40
                                    text-primary-700 dark:text-primary-300
                                    flex items-center justify-center text-sm font-semibold shrink-0"
                    >
                      {p.iniciais}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 break-words">
                        {p.descricao}
                      </p>
                      {p.codigoDeBarras && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                          {p.codigoDeBarras}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                          {p.precoFormatado}
                        </span>
                        <span
                          className={clsx(
                            "text-xs px-2 py-0.5 rounded-md font-medium",
                            p.semEstoque
                              ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              : p.estoqueBaixo
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                          )}
                        >
                          {p.quantidadeFormatada} un.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(p)}
                      className="flex-1"
                    >
                      <Pencil className="w-4 h-4" /> Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTarget(p)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4" /> Excluir
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

      <ProdutoFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        produto={editing}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Excluir produto"
        message={`Tem certeza que deseja excluir "${deleteTarget?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </DashboardLayout>
  );
}
