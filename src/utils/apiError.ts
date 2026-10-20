import type { ApiError, ApiResponse } from "@/types/api";
import { AxiosError } from "axios";

export interface ParsedApiError {
  message: string;
  details: ApiError[];
  status?: number;
  fieldErrors: Record<string, string>;
  codes: string[];
  traceId?: string;
}

export function parseApiError(
  err: unknown,
  fallback = "Erro inesperado. Tente novamente.",
): ParsedApiError {
  if (err instanceof AxiosError) {
    if (!err.response) {
      const isTimeout = err.code === "ECONNABORTED" || err.code === "ETIMEDOUT";
      return {
        message: isTimeout
          ? "A requisição demorou demais. Verifique sua conexão."
          : "Servidor indisponível. Verifique sua conexão e tente novamente.",
        details: [],
        fieldErrors: {},
        codes: [],
      };
    }

    const body = err.response.data as ApiResponse<unknown> | undefined;
    const status = err.response.status;
    const details = (body?.errors ?? []).filter(Boolean);
    const fieldErrors: Record<string, string> = {};
    const codes: string[] = [];

    for (const d of details) {
      if (d.code) {
        codes.push(d.code);
        if (isLikelyFieldName(d.code)) {
          fieldErrors[d.code] = d.message;
        }
      }
    }

    const message =
      body?.message?.trim() ||
      details[0]?.message?.trim() ||
      statusFallback(status) ||
      fallback;

    return {
      message,
      details,
      status,
      fieldErrors,
      codes,
      traceId: body?.traceId ?? undefined,
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message || fallback,
      details: [],
      fieldErrors: {},
      codes: [],
    };
  }

  return { message: fallback, details: [], fieldErrors: {}, codes: [] };
}

export function extractApiError(err: unknown, fallback?: string): string {
  return parseApiError(err, fallback).message;
}

function isLikelyFieldName(code: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(code);
}

function statusFallback(status: number): string | undefined {
  switch (status) {
    case 400:
      return "Dados inválidos. Verifique os campos e tente novamente.";
    case 401:
      return "Sessão expirada. Faça login novamente.";
    case 403:
      return "Você não tem permissão para esta ação.";
    case 404:
      return "Registro não encontrado.";
    case 409:
      return "Registro já existe ou conflito de dados.";
    case 422:
      return "Dados inválidos para processamento.";
    case 500:
      return "Erro interno do servidor. Tente novamente em instantes.";
    case 503:
      return "Serviço indisponível. Tente novamente em instantes.";
    default:
      return undefined;
  }
}
