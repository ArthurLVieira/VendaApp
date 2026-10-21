import { tokenManager } from "@/services/auth/tokenManager";
import { useEffect } from "react";
import { codec } from "zod";

interface Options {
  intervalMs?: number;
}

export function useSessionHeartbeat({ intervalMs = 60_000 }: Options = {}) {
  useEffect(() => {
    if (!tokenManager.isAuthenticated()) return;

    const check = () => {
      if (!tokenManager.isAuthenticated()) return;
      if (document.visibilityState !== "visible") return;

      if (tokenManager.isExpiringSoon()) {
        void tokenManager.refresh().catch(() => {
          tokenManager.clearSession();
        });
      }
    };

    check();

    const interval = setInterval(check, intervalMs);

    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs]);
}
