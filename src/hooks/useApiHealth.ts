import { useCallback, useEffect, useRef, useState } from "react";

export type ApiStatus = "checking" | "online" | "offline";

interface UseApiHealthOptions {
  endpoint?: string;
  intervalMs?: number;
  timeoutMs?: number;
}

interface UseApiHealthResult {
  status: ApiStatus;
  lastCheckedAt: Date | null;
  check: () => Promise<boolean>;
}

export function useApiHealth({
  endpoint = "/actuator/health",
  intervalMs = 30_000,
  timeoutMs = 5_000,
}: UseApiHealthOptions = {}): UseApiHealthResult {
  const [status, setStatus] = useState<ApiStatus>("checking");
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const check = useCallback(async (): Promise<boolean> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const baseUrl = import.meta.env.VITE_API_URL ?? "";
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      const ok = res.ok;
      setStatus(ok ? "online" : "offline");
      setLastCheckedAt(new Date());
      return ok;
    } catch {
      setStatus("offline");
      setLastCheckedAt(new Date());
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }, [endpoint, timeoutMs]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      await check();
    };

    run();

    if (intervalMs > 0) {
      const id = setInterval(run, intervalMs);
      return () => {
        cancelled = true;
        clearInterval(id);
        abortRef.current?.abort();
      };
    }

    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, [check, intervalMs]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [check]);

  return { status, lastCheckedAt, check };
}
