import { Cliente } from "@/models/Cliente";
import { clienteRespository } from "@/services/api";
import {
  type ClientePayload,
  type ClienteSearchParams,
  type PageModel,
} from "@/types/api";
import { extractApiError } from "@/utils/apiError";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_PARAMS: ClienteSearchParams = {
  search: "",
  fornecedor: false,
  page: 0,
  size: 10,
  sort: "sort=nomeCompleto,asc",
};

export function useCliente(initialParams?: Partial<ClienteSearchParams>) {
  const [params, setParamsState] = useState<ClienteSearchParams>({
    ...DEFAULT_PARAMS,
    ...initialParams,
  });
  const [data, setData] = useState<PageModel<Cliente> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqIdRef = useRef(0);

  const fetchList = useCallback(async () => {
    const id = ++reqIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await clienteRespository.search(params);
      if (id === reqIdRef.current) setData(result);
    } catch (e) {
      if (id === reqIdRef.current)
        if (id === reqIdRef.current)
          setError(extractApiError(e, "Erro ao carregar registros"));
    } finally {
      if (id === reqIdRef.current) setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  const setParams = useCallback((patch: Partial<ClienteSearchParams>) => {
    setParamsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const create = useCallback(
    async (payload: ClientePayload) => {
      const cliente = await clienteRespository.create(payload);
      await fetchList();
      return cliente;
    },
    [fetchList],
  );

  const update = useCallback(
    async (id: number, payload: ClientePayload) => {
      const cliente = await clienteRespository.update(id, payload);
      await fetchList();
      return cliente;
    },
    [fetchList],
  );

  const remove = useCallback(
    async (id: number) => {
      await clienteRespository.deleteById(id);
      await fetchList();
    },
    [fetchList],
  );

  const toggleFornecedor = useCallback(
    async (id: number) => {
      const cliente = await clienteRespository.switchFornecedor(id);
      await fetchList();
      return cliente;
    },
    [fetchList],
  );

  const toggleStatus = useCallback(
    async (id: number) => {
      const cliente = await clienteRespository.switchStatus(id);
      await fetchList();
      return cliente;
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
    toggleStatus,
    toggleFornecedor,
  };
}
