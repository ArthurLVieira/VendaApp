import { tokenManager } from "@/services/auth/tokenManager";
import { useCallback, useEffect, useRef, useState } from "react";

const WARNING_THRESHOLD_MS = 60_000;

export interface SessionWarningState {
  remainingMs: number | null;
  isWarning: boolean;
  modalOpen: boolean;
  floatingVisible: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
  minimize: () => void;
  expand: () => void;
}

export function useSessionWarning(): SessionWarningState {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const autoHandledRef = useRef(false);

  const handleExpire = useCallback(async () => {
    if (autoHandledRef.current) return;
    autoHandledRef.current = true;
    try {
      await tokenManager.refresh();
      setModalOpen(false);
      setDismissed(false);
    } catch {
      tokenManager.clearSession();
      window.location.assign("/login");
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const remaining = tokenManager.getRemainigMs();
      setRemainingMs(remaining);

      if (remaining === null) {
        setModalOpen(false);
        setDismissed(false);
        return;
      }

      if (
        remaining <= WARNING_THRESHOLD_MS &&
        remaining > 0 &&
        !dismissed &&
        !modalOpen
      ) {
        setModalOpen(true);
      }

      if (remaining < 0) {
        void handleExpire();
      }
    };

    tick();

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [dismissed, modalOpen, handleExpire]);

  const refresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await tokenManager.refresh();
      setModalOpen(false);
      setDismissed(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const logout = useCallback(() => {
    tokenManager.clearSession();
    window.location.assign("/login");
  }, []);

  const minimize = useCallback(() => {
    setModalOpen(false);
    setDismissed(true);
  }, []);

  const expand = useCallback(() => {
    setModalOpen(true);
  }, []);

  const isWarning =
    remainingMs !== null &&
    remainingMs <= WARNING_THRESHOLD_MS &&
    remainingMs > 0;

  const floatingVisible = dismissed && remainingMs !== null && remainingMs > 0;

  return {
    remainingMs,
    isWarning,
    modalOpen,
    floatingVisible,
    refreshing,
    refresh,
    logout,
    minimize,
    expand,
  };
}
