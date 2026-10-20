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
  const reqCodeRef = useRef(0);

  const fetchList = useCallback(async () => {
    const code = ++reqCodeRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await clienteRespository.search(params);
      if (code === reqCodeRef.current) setData(result);
    } catch (e) {
      if (code === reqCodeRef.current)
        if (code === reqCodeRef.current)
          setError(extractApiError(e, "Erro ao carregar clientes"));
    } finally {
      if (code === reqCodeRef.current) setLoading(false);
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
