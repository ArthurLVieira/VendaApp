import { Produto } from "@/models/Produto";
import { produtoRepository } from "@/services/api";
import {
  type PageModel,
  type ProdutoPayload,
  type ProdutoSearchParams,
} from "@/types/api";
import { parseApiError } from "@/utils/apiError";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_PARAMS: ProdutoSearchParams = {
  search: "",
  page: 0,
  size: 10,
  sort: "descricao,asc",
};

export function useProdutos(initialParams?: Partial<ProdutoSearchParams>) {
  const [params, setparamsState] = useState<ProdutoSearchParams>({
    ...DEFAULT_PARAMS,
    ...initialParams,
  });

  const [data, setData] = useState<PageModel<Produto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqIdRef = useRef(0);

  const fetchList = useCallback(async () => {
    const id = ++reqIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await produtoRepository.search(params);
      if (id === reqIdRef.current) setData(result);
    } catch (e) {
      if (id === reqIdRef.current) {
        setError(parseApiError(e, "Erro ao carregar produtos").message);
      }
    } finally {
      if (id === reqIdRef.current) setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  const setParams = useCallback(
    (path: Partial<ProdutoSearchParams>) => {
      setparamsState((prev) => ({ ...prev, ...path }));
    },
    [fetchList],
  );

  const create = useCallback(
    async (payload: ProdutoPayload) => {
      const produto = await produtoRepository.create(payload);
      await fetchList();
      return produto;
    },
    [fetchList],
  );

  const update = useCallback(
    async (id: number, payload: ProdutoPayload) => {
      const produto = await produtoRepository.update(id, payload);
      await fetchList();
      return produto;
    },
    [fetchList],
  );

  const remove = useCallback(
    async (id: number) => {
      await produtoRepository.deleteById(id);
      await fetchList();
    },
    [fetchList],
  );

  return {
    data,
    loading,
    error,
    params,
    setParams,
    refresh: fetchList,
    create,
    update,
    remove,
  };
}
